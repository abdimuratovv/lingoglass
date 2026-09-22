-- LingoGlass — boshlang'ich schema (auth + courses + progress + xp + leaderboard + quiz + admin)
-- Qo'llash: `supabase db push` (Supabase CLI) yoki loyiha SQL Editor'ida qo'lda ishga tushiriladi.
-- Hali hech qanday Supabase loyihasiga qarshi sinalmagan — birinchi marta qo'llashda xato chiqsa shu faylni tuzatib qayta yozamiz.

-- ============================================================
-- 1. PROFILES / SETTINGS
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  avatar_seed text not null default '',
  bio text not null default '',
  cefr_level text,
  daily_goal_minutes int not null default 15,
  created_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  push_notifications boolean not null default true,
  email_notifications boolean not null default true,
  streak_reminders boolean not null default true,
  leaderboard_updates boolean not null default false,
  show_on_leaderboard boolean not null default true,
  share_progress boolean not null default false,
  interface_language text not null default 'en',
  learning_language text not null default 'en',
  timezone text,
  focus_areas text[] not null default '{}'
);

-- Admin ro'yxati alohida jadval — profiles.role emas, chunki shunday bo'lganda
-- "o'z profilini yangilash" yo'li orqali o'zini admin qilib qo'yish xavfi bo'lardi.
-- Bu jadvalga client tomondan (authenticated rol bilan) hech qanday insert/update/delete
-- ruxsati berilmaydi — faqat Supabase dashboard/service-role orqali qo'lda to'ldiriladi.
create table public.admin_users (
  user_id uuid primary key references public.profiles (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Signup bo'lganda profiles/user_settings qatorini avtomatik yaratadi.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_seed)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.id::text);

  insert into public.user_settings (user_id) values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. COURSES / LESSONS / PROGRESS
-- ============================================================

create table public.courses (
  id text primary key,
  title text not null,
  level text not null,
  image text not null,
  description text not null
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id text not null references public.courses (id) on delete cascade,
  position int not null,
  title text not null,
  duration_minutes int not null,
  type text not null check (type in ('video', 'reading', 'listening', 'quiz')),
  unique (course_id, position)
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

-- courses.ts'dagi getCourseStats() bilan bir xil mantiq — progress hech qachon
-- alohida ustunda saqlanmaydi, doim shu funksiya orqali hisoblanadi (CLAUDE.md §7).
create or replace function public.get_course_stats(p_course_id text)
returns table (total_lessons int, completed_lessons int, progress int)
language sql
stable
security invoker
as $$
  select
    count(l.id)::int as total_lessons,
    count(lp.completed_at)::int as completed_lessons,
    case
      when count(l.id) = 0 then 0
      else round(100.0 * count(lp.completed_at) / count(l.id))::int
    end as progress
  from public.lessons l
  left join public.lesson_progress lp
    on lp.lesson_id = l.id and lp.user_id = auth.uid()
  where l.course_id = p_course_id;
$$;

-- ============================================================
-- 3. XP / FAOLIYAT / LEADERBOARD
-- ============================================================

create table public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  source_type text not null check (source_type in ('lesson_completed', 'quiz_passed', 'streak_bonus')),
  source_id uuid,
  xp_amount int not null,
  title text not null,
  created_at timestamptz not null default now()
);

create index xp_events_user_created_idx on public.xp_events (user_id, created_at desc);

-- Haftalik leaderboard — rolling calendar-hafta (Dushanba boshlanadi), reset job kerak emas.
-- security_invoker YO'Q (ataylab): bu view boshqa userlarning xp yig'indisini ko'rsatishi kerak,
-- lekin xp_events jadvalining o'zi RLS bilan faqat "o'z qatorlari"ga cheklangan (pastga qarang).
-- Shuning uchun view definer huquqi bilan ishlaydi va FAQAT agregatsiya qilingan/xavfsiz
-- ustunlarni chiqaradi (xom xp_events qatorlarini emas) — yangi ustun qo'shishdan oldin shuni yodda tuting.
create view public.leaderboard_current_week as
with this_week as (
  select user_id, sum(xp_amount) as xp
  from public.xp_events
  where created_at >= date_trunc('week', now())
  group by user_id
),
last_week as (
  select user_id, sum(xp_amount) as xp
  from public.xp_events
  where created_at >= date_trunc('week', now()) - interval '7 days'
    and created_at < date_trunc('week', now())
  group by user_id
),
this_week_ranked as (
  select user_id, xp, rank() over (order by xp desc) as rank
  from this_week
),
last_week_ranked as (
  select user_id, rank() over (order by xp desc) as rank
  from last_week
)
select
  twr.rank,
  p.id as user_id,
  p.full_name as name,
  p.avatar_seed as avatar,
  twr.xp,
  case
    when lwr.rank is null then 'up'
    when twr.rank < lwr.rank then 'up'
    when twr.rank > lwr.rank then 'down'
    else 'same'
  end as trend
from this_week_ranked twr
join public.profiles p on p.id = twr.user_id
join public.user_settings us on us.user_id = p.id
left join last_week_ranked lwr on lwr.user_id = twr.user_id
where us.show_on_leaderboard
order by twr.rank;

-- Grant: §7 ga qarang (barcha Data API huquqlari bitta joyda boshqariladi).

-- ============================================================
-- 4. QUIZ
-- ============================================================

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons (id) on delete set null,
  title text not null,
  level text not null,
  category text
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  position int not null,
  question_text text not null,
  unique (quiz_id, position)
);

create table public.quiz_answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions (id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  position int not null,
  unique (question_id, position)
);

-- is_correct maxfiy — quiz yechayotgan foydalanuvchi buni to'g'ridan-to'g'ri
-- quiz_answer_options jadvalidan o'qiy olmasligi kerak (aks holda javobni oldindan ko'radi).
-- Shu sabab bazaviy jadval faqat admin uchun ochiq, oddiy foydalanuvchi shu view orqali o'qiydi.
create view public.quiz_answer_options_public as
select id, question_id, option_text, position
from public.quiz_answer_options;

-- Grant: §7 ga qarang (barcha Data API huquqlari bitta joyda boshqariladi).

-- To'g'ri javobni serverda tekshiradigan yagona yo'l — client hech qachon
-- to'g'ridan-to'g'ri xp_events'ga yozmaydi (aks holda o'ziga cheksiz XP bera oladi).
create or replace function public.submit_quiz_answer(p_question_id uuid, p_option_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_correct boolean;
  v_quiz_id uuid;
  v_lesson_id uuid;
begin
  select qao.is_correct, qq.quiz_id
    into v_is_correct, v_quiz_id
  from public.quiz_answer_options qao
  join public.quiz_questions qq on qq.id = qao.question_id
  where qao.id = p_option_id and qao.question_id = p_question_id;

  if v_is_correct then
    select lesson_id into v_lesson_id from public.quizzes where id = v_quiz_id;

    insert into public.xp_events (user_id, source_type, source_id, xp_amount, title)
    values (auth.uid(), 'quiz_passed', v_quiz_id, 10, 'Quiz completed');
  end if;

  return coalesce(v_is_correct, false);
end;
$$;

-- ============================================================
-- 5. NOTIFICATIONS / RESOURCES / IDIOMS
-- ============================================================

create table public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  resource_type text not null,
  level text,
  file_url text not null,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.idioms (
  id uuid primary key default gen_random_uuid(),
  idiom_text text not null,
  meaning text not null,
  example text not null
);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.xp_events enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_answer_options enable row level security;
alter table public.notifications enable row level security;
alter table public.resources enable row level security;
alter table public.idioms enable row level security;

-- profiles: o'zini + hammani (public sifatida ism/avatar) o'qiy oladi, faqat o'zini yangilaydi.
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- user_settings: faqat o'zi.
create policy "user_settings_select_own" on public.user_settings for select using (auth.uid() = user_id);
create policy "user_settings_update_own" on public.user_settings for update using (auth.uid() = user_id);

-- admin_users: authenticated rol uchun hech qanday policy yo'q — demak default deny
-- (RLS yoqilgan bo'lsa va policy topilmasa, hech kim hech narsa qila olmaydi).
-- is_admin() funksiyasi SECURITY DEFINER bo'lgani uchun shu cheklovni chetlab o'tib o'qiy oladi.

-- courses/lessons: public read (mehmon ham kurslarni ko'ra oladi), yozish faqat admin.
create policy "courses_select_all" on public.courses for select using (true);
create policy "courses_admin_write" on public.courses for all using (public.is_admin()) with check (public.is_admin());

create policy "lessons_select_all" on public.lessons for select using (true);
create policy "lessons_admin_write" on public.lessons for all using (public.is_admin()) with check (public.is_admin());

-- lesson_progress: faqat o'zi.
create policy "lesson_progress_own" on public.lesson_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- xp_events: faqat o'zi o'qiydi; to'g'ridan-to'g'ri INSERT policy yo'q — yagona yo'l
-- submit_quiz_answer() kabi SECURITY DEFINER funksiyalar orqali (client o'ziga XP yoza olmasin).
create policy "xp_events_select_own" on public.xp_events for select using (auth.uid() = user_id);

-- quiz: savol/variant matnini hamma o'qiydi, lekin quiz_answer_options'ga (is_correct bor)
-- to'g'ridan-to'g'ri faqat admin kira oladi — oddiy user quiz_answer_options_public view'dan o'qiydi.
create policy "quizzes_select_all" on public.quizzes for select using (true);
create policy "quizzes_admin_write" on public.quizzes for all using (public.is_admin()) with check (public.is_admin());

create policy "quiz_questions_select_all" on public.quiz_questions for select using (true);
create policy "quiz_questions_admin_write" on public.quiz_questions for all using (public.is_admin()) with check (public.is_admin());

create policy "quiz_answer_options_admin_only" on public.quiz_answer_options for all
  using (public.is_admin()) with check (public.is_admin());

-- notifications: faqat o'zi o'qiydi, faqat "read_at"ni yangilay oladi (insert admin/server tomondan).
create policy "notifications_select_own" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update_own" on public.notifications for update using (auth.uid() = user_id);

-- resources/idioms: public read, yozish faqat admin.
create policy "resources_select_all" on public.resources for select using (true);
create policy "resources_admin_write" on public.resources for all using (public.is_admin()) with check (public.is_admin());

create policy "idioms_select_all" on public.idioms for select using (true);
create policy "idioms_admin_write" on public.idioms for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 7. DATA API GRANTS (jadval darajasidagi huquqlar)
-- ============================================================
-- Ikki qatlamli himoya: GRANT "qaysi jadval/amal umuman ochiq"ligini, RLS esa
-- "o'sha jadvalning qaysi qatorlari"ni belgilaydi. Bittasi yetarli emas —
-- RLS tasodifan o'chib qolsa GRANT ushlab qoladi, GRANT keng bo'lsa RLS ushlab qoladi.
--
-- Bu blok Supabase loyihasidagi "Automatically expose new tables" sozlamasi
-- YOQIQ bo'lsa ham, O'CHIQ bo'lsa ham bir xil yakuniy holat berishi uchun avval
-- hamma narsani revoke qiladi, keyin faqat kerakligini qaytarib beradi.
-- Shu blok mavjud bo'lgani uchun o'sha sozlamani O'CHIRIB qo'yish tavsiya etiladi:
-- u faqat KELAJAKDA yaratiladigan jadvallarga ta'sir qiladi, va o'chirilgan bo'lsa
-- yangi jadval avtomatik ochilib qolmaydi — huquqi shu yerga qo'lda yoziladi.
--
-- service_role ataylab tegilmaydi: server tomonidagi vazifalar (seed, admin skriptlar,
-- kelajakdagi Edge Function'lar) uchun to'liq huquq saqlanib qolishi kerak.

grant usage on schema public to anon, authenticated;

revoke all on all tables in schema public from anon, authenticated;

-- anon (login qilmagan mehmon) uchun ataylab hech narsa ochilmaydi — ilovadagi har bir
-- sahifa ProtectedRoute ortida, ya'ni mehmon hech qanday so'rov yubormaydi.
-- Kelajakda mehmonga ochiq landing/katalog qo'shilsa, courses/lessons/idioms uchun
-- shu yerga `grant select ... to anon` qo'shish kifoya — RLS policy'lari (`using (true)`)
-- buni allaqachon qo'llab-quvvatlaydi.

-- profiles: ism/avatar leaderboard uchun hammaga ko'rinadi, yangilash faqat o'zini.
grant select, update on public.profiles to authenticated;

-- user_settings: faqat o'zi. INSERT yo'q — qator handle_new_user() trigger'i orqali yaratiladi.
grant select, update on public.user_settings to authenticated;

-- admin_users: ataylab hech qanday grant yo'q (policy ham yo'q — §6 ga qarang).
-- is_admin() SECURITY DEFINER bo'lgani uchun client huquqiga muhtoj emas.

-- courses / lessons: o'qish hammaga, yozishni RLS admin bilan cheklaydi
-- (Admin UI client tomonda ishlagani uchun yozish huquqi grant darajasida ochiq bo'lishi kerak).
grant select, insert, update, delete on public.courses to authenticated;
grant select, insert, update, delete on public.lessons to authenticated;

-- lesson_progress: foydalanuvchi faqat o'z qatorlarini boshqaradi.
grant select, insert, update, delete on public.lesson_progress to authenticated;

-- xp_events: faqat o'qish. INSERT ataylab berilmaydi — XP yozishning yagona yo'li
-- submit_quiz_answer() kabi SECURITY DEFINER funksiyalar (§4 ga qarang).
grant select on public.xp_events to authenticated;

-- quizzes / quiz_questions: o'qish hammaga, yozish RLS orqali adminga.
grant select, insert, update, delete on public.quizzes to authenticated;
grant select, insert, update, delete on public.quiz_questions to authenticated;

-- quiz_answer_options: DIQQAT — is_correct shu jadvalda turadi va uni yashiradigan
-- yagona narsa "quiz_answer_options_admin_only" RLS policy'si. Admin UI client tomonda
-- bo'lgani uchun grant'ni olib tashlab bo'lmaydi, shuning uchun bu jadvalda RLS
-- hech qachon o'chirilmasligi kerak. Oddiy foydalanuvchi variantlarni
-- quiz_answer_options_public view'idan o'qiydi (is_correct'siz).
grant select, insert, update, delete on public.quiz_answer_options to authenticated;

-- notifications: o'qish + read_at'ni belgilash. INSERT server/admin tomonda qoladi.
grant select, update on public.notifications to authenticated;

-- resources / idioms: o'qish hammaga, yozish RLS orqali adminga.
grant select, insert, update, delete on public.resources to authenticated;
grant select, insert, update, delete on public.idioms to authenticated;

-- View'lar: ikkalasi ham definer huquqi bilan ishlaydi (§3, §4 dagi izohlarga qarang),
-- shuning uchun faqat select — ular orqali yozish mumkin bo'lmasligi kerak.
grant select on public.leaderboard_current_week to authenticated;
grant select on public.quiz_answer_options_public to authenticated;

-- Funksiyalar. Postgres yangi funksiyaga default'da PUBLIC uchun EXECUTE beradi, lekin
-- bunga tayanmaslik kerak — aniq yozilgani xavfsizroq va o'z-o'zini hujjatlaydi.
-- is_admin() alohida muhim: u policy ifodalari ichida chaqiriladi, policy esa invoker
-- huquqi bilan baholanadi — EXECUTE bo'lmasa har bir admin-policy
-- "permission denied for function is_admin" bilan yiqiladi.
grant execute on function public.is_admin() to authenticated;
grant execute on function public.get_course_stats(text) to authenticated;
grant execute on function public.submit_quiz_answer(uuid, uuid) to authenticated;

-- handle_new_user() ataylab ro'yxatda yo'q: u auth.users ustidagi trigger sifatida
-- Supabase auth servisi tomonidan ishga tushadi, client uni hech qachon chaqirmaydi.
