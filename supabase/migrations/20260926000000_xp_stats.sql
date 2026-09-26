-- LingoGlass — joriy userning XP statistikasi: get_my_xp_stats(p_tz)
--
-- Nima qiladi:
--   * total_xp     — userning barcha xp_events yig'indisi.
--   * streak_days  — XP olingan ketma-ket kunlar soni, bugun yoki kechada tugaydigan (bugun hali XP
--                    olinmagan bo'lsa ham streak "uzilmagan" hisoblanadi — kun oxirigacha vaqt bor).
--   * active_today — bugun kamida bitta XP olinganmi (UI'da streak belgisini yoqish/xira qilish uchun).
--
-- Nega client'da hisoblanmaydi: umumiy XP uchun userning BARCHA qatorlari kerak, PostgREST esa
-- bitta so'rovda ko'pi bilan "Max rows" (Supabase default: 1000) qator qaytaradi — yig'indi shu
-- chegaradan keyin jimgina noto'g'ri bo'lib qolardi.
--
-- "Kun" userning vaqt zonasida hisoblanadi (p_tz — brauzerning IANA nomi, masalan 'Asia/Tashkent').
-- Noma'lum zona xato bermaydi, UTC'ga tushadi. Haftalik leaderboard esa (leaderboard_current_week)
-- hamon UTC bo'yicha — bu ikki xil narsa: streak shaxsiy, reyting hamma uchun bitta.
--
-- SECURITY INVOKER (ataylab): xp_events RLS'i userga faqat o'z qatorlarini beradi, funksiya boshqa
-- hech narsaga muhtoj emas — definer huquqi kerak emas.
--
-- Hammasi bitta tranzaksiyada; qayta ishga tushirish xavfsiz.

begin;

create or replace function public.get_my_xp_stats(p_tz text default 'UTC')
returns table (total_xp int, streak_days int, active_today boolean)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_tz text := coalesce(p_tz, 'UTC');
  v_today date;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  begin
    v_today := (now() at time zone v_tz)::date;
  exception when invalid_parameter_value then
    v_tz := 'UTC';
    v_today := (now() at time zone v_tz)::date;
  end;

  return query
  with days as (
    select distinct (e.created_at at time zone v_tz)::date as d
    from public.xp_events e
    where e.user_id = v_uid
  ),
  runs as (
    -- Ketma-ket kunlar bitta guruhga tushadi: kamayish tartibida d + row_number() o'zgarmaydi.
    select r.d, r.d + (row_number() over (order by r.d desc))::int as grp
    from days r
  ),
  latest_run as (
    select max(r.d) as last_day, count(*)::int as len
    from runs r
    group by r.grp
    order by max(r.d) desc
    limit 1
  )
  select
    (select coalesce(sum(e.xp_amount), 0)::int from public.xp_events e where e.user_id = v_uid),
    coalesce((select case when lr.last_day >= v_today - 1 then lr.len else 0 end from latest_run lr), 0),
    exists (select 1 from days dd where dd.d = v_today);
end;
$$;

-- Yangi funksiya: PUBLIC default + Supabase'ning anon/authenticated grant'lari olinadi,
-- faqat authenticated'ga qaytariladi (20260924000000 dagi naqsh).
revoke execute on function public.get_my_xp_stats(text) from public, anon, authenticated;
grant execute on function public.get_my_xp_stats(text) to authenticated;

commit;
