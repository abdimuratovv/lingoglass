-- LingoGlass — darsni tugatish: complete_lesson() + lesson_progress'ni faqat shu funksiya orqali yozish
--
-- Nima qiladi:
--   * complete_lesson(p_lesson_id) — darsni joriy user uchun tugallangan deb belgilaydi va
--     birinchi marta tugatilganda XP beradi (XP = darsning duration_minutes'i).
--   * Darslar ketma-ket ochiladi: oldingi barcha darslar tugallanmagan bo'lsa rad etadi
--     (UI'dagi "Locked" holati bilan bir xil qoida — endi serverda ham majburiy).
--   * lesson_progress'ga to'g'ridan-to'g'ri INSERT/UPDATE/DELETE huquqi olinadi — progress va
--     XP doim birga, bitta joyda yoziladi (xp_events bilan bir xil naqsh).
--
-- Cheklov (ataylab): darslarda hali kontent yo'q, shuning uchun "tugatdi"ni server tekshira
-- olmaydi — bu o'z-o'zini belgilash. XP takrorlanmaydi (xp_events unique cheklovi), lekin
-- user darslarni ketma-ket tez bosib chiqishi mumkin. Kontent/quiz ulanganda shart kuchaytiriladi.
--
-- Hammasi bitta tranzaksiyada; qayta ishga tushirish xavfsiz.

begin;

create or replace function public.complete_lesson(p_lesson_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_course_id text;
  v_position int;
  v_title text;
  v_duration int;
  v_inserted int;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select course_id, position, title, duration_minutes
    into v_course_id, v_position, v_title, v_duration
  from public.lessons
  where id = p_lesson_id;

  if not found then
    raise exception 'lesson not found' using errcode = 'P0002';
  end if;

  -- Ketma-ketlik: shu kursdagi oldingi barcha darslar tugallangan bo'lishi kerak.
  if exists (
    select 1
    from public.lessons l
    where l.course_id = v_course_id
      and l.position < v_position
      and not exists (
        select 1 from public.lesson_progress lp
        where lp.lesson_id = l.id and lp.user_id = v_uid and lp.completed_at is not null
      )
  ) then
    raise exception 'previous lessons are not completed' using errcode = 'P0001';
  end if;

  insert into public.lesson_progress (user_id, lesson_id, completed_at)
  values (v_uid, p_lesson_id, now())
  on conflict (user_id, lesson_id)
    do update set completed_at = coalesce(public.lesson_progress.completed_at, excluded.completed_at);

  -- XP faqat birinchi marta (xp_events'dagi unique (user_id, source_type, source_id)).
  insert into public.xp_events (user_id, source_type, source_id, xp_amount, title)
  values (v_uid, 'lesson_completed', p_lesson_id, v_duration, 'Completed: ' || v_title)
  on conflict (user_id, source_type, source_id) do nothing;

  get diagnostics v_inserted = row_count;

  -- Berilgan XP (dars avval tugatilgan bo'lsa 0).
  return case when v_inserted > 0 then v_duration else 0 end;
end;
$$;

-- lesson_progress: client endi faqat o'qiydi. Yozish yagona yo'li — complete_lesson().
revoke insert, update, delete on public.lesson_progress from anon, authenticated;
grant select on public.lesson_progress to authenticated;

-- Yangi funksiya: PUBLIC default + Supabase'ning anon/authenticated grant'lari olinadi,
-- faqat authenticated'ga qaytariladi (20260924000000 dagi naqsh).
revoke execute on function public.complete_lesson(uuid) from public, anon, authenticated;
grant execute on function public.complete_lesson(uuid) to authenticated;

commit;
