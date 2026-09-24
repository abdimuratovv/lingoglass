-- LingoGlass — tuzatish migratsiyasi: XP takrorlanishi + funksiya huquqlari
--
-- Nega alohida fayl: 20260817000000_init_schema.sql production bazaga allaqachon qo'llangan
-- (haqiqiy foydalanuvchilar bor), shuning uchun uni qayta ishga tushirib bo'lmaydi — tuzatishlar
-- mavjud schema ustiga shu fayl orqali qo'shiladi. Foydalanuvchi ma'lumotlariga (profiles,
-- user_settings, auth.users) tegmaydi.
--
-- Tuzatiladigan ikki xato:
--   1. submit_quiz_answer() har bir to'g'ri javob uchun cheklovsiz +10 XP yozardi — bitta
--      to'g'ri javobni RPC orqali N marta yuborib N×10 XP olish mumkin edi.
--   2. Init migratsiyadagi `revoke all on all tables` funksiyalarga ta'sir qilmaydi, Supabase esa
--      public sxemadagi funksiyalarga default'da anon'ga ham EXECUTE beradi. Mehmon
--      submit_quiz_answer()'ni chaqirsa, to'g'ri variantda not-null xatosi, noto'g'rida `false`
--      qaytardi — bu farq login'siz javob kalitini ochib berardi.
--
-- Init migratsiyaning qaysi nusxasi (§7 grant bo'limi bilan yoki usiz) qo'llangan bo'lsa ham,
-- shu fayldan keyin yakuniy holat bir xil bo'ladi. Qayta ishga tushirish ham xavfsiz.
-- Hammasi bitta tranzaksiyada: biror qadam yiqilsa, hech narsa o'zgarmaydi.

begin;

-- ============================================================
-- 1. xp_events: manba bo'yicha XP faqat bir marta
-- ============================================================

-- source_type ro'yxati: 'quiz_passed' → 'quiz_answer_correct' (XP endi quiz emas, savol
-- bo'yicha beriladi, source_id = savol ID). Eski CHECK nomi Postgres tomonidan avtomatik
-- berilgan, shuning uchun nomiga emas, mazmuniga qarab topib o'chiriladi.
do $$
declare
  v_name text;
begin
  for v_name in
    select conname from pg_constraint
    where conrelid = 'public.xp_events'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%source_type%'
  loop
    execute format('alter table public.xp_events drop constraint %I', v_name);
  end loop;
end;
$$;

-- Agar jadvalda 'quiz_passed' qatorlari bo'lsa, bu qadam xato beradi va butun tranzaksiya
-- bekor bo'ladi — ma'lumot jimgina o'zgartirilmaydi (bunday qatorlar bo'lmasligi kerak:
-- hozircha frontend'da quiz yechish yo'q).
alter table public.xp_events
  add constraint xp_events_source_type_check
  check (source_type in ('lesson_completed', 'quiz_answer_correct', 'streak_bonus'));

-- Bitta manba (dars / savol) uchun XP faqat BIR MARTA. source_id NULL bo'lgan qatorlar
-- (masalan streak_bonus) cheklovga tushmaydi (NULL'lar o'zaro teng hisoblanmaydi) — bunday
-- XP yozadigan funksiya takrorlanishni o'zi nazorat qilishi kerak.
alter table public.xp_events drop constraint if exists xp_events_user_id_source_type_source_id_key;
alter table public.xp_events
  add constraint xp_events_user_id_source_type_source_id_key
  unique (user_id, source_type, source_id);

-- ============================================================
-- 2. submit_quiz_answer(): anon rad etiladi, XP takrorlanmaydi
-- ============================================================

create or replace function public.submit_quiz_answer(p_question_id uuid, p_option_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_correct boolean;
begin
  -- Mehmon (auth.uid() = NULL) uchun aniq rad etish — to'g'ri/noto'g'ri variantda javob bir xil.
  -- (EXECUTE huquqi ham pastda anon'dan olinadi — bu ikkinchi qatlam.)
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select qao.is_correct
    into v_is_correct
  from public.quiz_answer_options qao
  where qao.id = p_option_id and qao.question_id = p_question_id;

  -- XP har bir savol uchun faqat birinchi to'g'ri javobda (parallel so'rovlarda ham).
  if v_is_correct then
    insert into public.xp_events (user_id, source_type, source_id, xp_amount, title)
    values (auth.uid(), 'quiz_answer_correct', p_question_id, 10, 'Correct quiz answer')
    on conflict (user_id, source_type, source_id) do nothing;
  end if;

  return coalesce(v_is_correct, false);
end;
$$;

-- ============================================================
-- 3. DATA API GRANTS — init migratsiyadagi §7 to'liq qayta qo'llanadi
-- ============================================================
-- Init'ning eski nusxasida §7 bo'lmagan bo'lishi mumkin, shuning uchun jadval huquqlari ham shu
-- yerda qayta o'rnatiladi (idempotent: allaqachon to'g'ri bo'lsa hech narsa o'zgarmaydi).
-- Izohlar va har bir grant'ning sababi init migratsiyaning §7 bo'limida.

grant usage on schema public to anon, authenticated;

revoke all on all tables in schema public from anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, update on public.user_settings to authenticated;
grant select, insert, update, delete on public.courses to authenticated;
grant select, insert, update, delete on public.lessons to authenticated;
grant select, insert, update, delete on public.lesson_progress to authenticated;
grant select on public.xp_events to authenticated;
grant select, insert, update, delete on public.quizzes to authenticated;
grant select, insert, update, delete on public.quiz_questions to authenticated;
grant select, insert, update, delete on public.quiz_answer_options to authenticated;
grant select, update on public.notifications to authenticated;
grant select, insert, update, delete on public.resources to authenticated;
grant select, insert, update, delete on public.idioms to authenticated;
grant select on public.leaderboard_current_week to authenticated;
grant select on public.quiz_answer_options_public to authenticated;

-- Funksiyalar: avval hamma huquq olinadi (PUBLIC default + Supabase'ning anon/authenticated'ga
-- bergan to'g'ridan-to'g'ri grant'lari), keyin faqat kerakligi authenticated'ga qaytariladi.
-- Ataylab `all functions in schema public` emas, aniq ro'yxat — public sxemada Supabase'ning
-- o'z funksiyalari ham bor (masalan "automatic RLS" sozlamasining rls_auto_enable'i), ularga tegilmaydi.
-- handle_new_user() — trigger funksiyasi, trigger ishga tushganda EXECUTE tekshirilmaydi.
revoke execute on function public.is_admin() from public, anon, authenticated;
revoke execute on function public.get_course_stats(text) from public, anon, authenticated;
revoke execute on function public.submit_quiz_answer(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.get_course_stats(text) to authenticated;
grant execute on function public.submit_quiz_answer(uuid, uuid) to authenticated;

-- Kelajakda yangi funksiya qo'shilsa, u ham yangi migratsiyada shu tarzda aniq
-- revoke + grant bilan yozilishi kerak.

commit;
