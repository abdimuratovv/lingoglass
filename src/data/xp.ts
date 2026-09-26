import { supabase } from '../lib/supabaseClient';

export type XpSourceType = 'lesson_completed' | 'quiz_answer_correct' | 'streak_bonus';

export interface XpEvent {
  id: number;
  sourceType: XpSourceType;
  xpAmount: number;
  title: string;
  createdAt: string;
}

export interface XpStats {
  totalXp: number;
  /** XP olingan ketma-ket kunlar (bugun yoki kechada tugaydigan) — userning vaqt zonasida. */
  streakDays: number;
  /** Bugun kamida bitta XP olinganmi. `false` va `streakDays > 0` — streak bugun uzilishi mumkin. */
  activeToday: boolean;
}

export type LeaderboardTrend = 'up' | 'down' | 'same';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarSeed: string;
  xp: number;
  trend: LeaderboardTrend;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
  /** Joriy userning qatori (ro'yxat chegarasidan tashqarida bo'lsa ham); bu hafta XP'si yo'q bo'lsa `null`. */
  me: LeaderboardEntry | null;
}

/** Brauzerning IANA vaqt zonasi (masalan "Asia/Tashkent") — streak kunlari shu zonada hisoblanadi. */
function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** Umumiy XP va streak — get_my_xp_stats() RPC (20260926000000_xp_stats.sql). */
export async function fetchXpStats(): Promise<XpStats> {
  const { data, error } = await supabase
    .rpc('get_my_xp_stats', { p_tz: browserTimeZone() })
    .single()
    .overrideTypes<{ total_xp: number; streak_days: number; active_today: boolean }, { merge: false }>();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('get_my_xp_stats returned no row');
  return { totalXp: data.total_xp, streakDays: data.streak_days, activeToday: data.active_today };
}

/** Joriy userning oxirgi XP voqealari (yangisi birinchi). RLS bo'yicha faqat o'z qatorlari. */
export async function fetchRecentXpEvents(userId: string, limit: number): Promise<XpEvent[]> {
  const { data, error } = await supabase
    .from('xp_events')
    .select('id, source_type, xp_amount, title, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit)
    .overrideTypes<
      { id: number; source_type: XpSourceType; xp_amount: number; title: string; created_at: string }[],
      { merge: false }
    >();
  if (error) throw new Error(error.message);
  return data.map((e) => ({
    id: e.id,
    sourceType: e.source_type,
    xpAmount: e.xp_amount,
    title: e.title,
    createdAt: e.created_at,
  }));
}

interface LeaderboardRow {
  rank: number;
  user_id: string;
  name: string;
  avatar: string;
  xp: number;
  trend: LeaderboardTrend;
}

const LEADERBOARD_COLUMNS = 'rank, user_id, name, avatar, xp, trend';

function toEntry(r: LeaderboardRow): LeaderboardEntry {
  return { rank: r.rank, userId: r.user_id, name: r.name, avatarSeed: r.avatar, xp: r.xp, trend: r.trend };
}

/**
 * Joriy haftaning reytingi (leaderboard_current_week view — hafta dushanba 00:00 UTC'da boshlanadi).
 * Top `limit` qator va joriy userning o'z qatori parallel olinadi, shunda user ro'yxatdan tashqarida
 * bo'lsa ham o'rni ko'rinadi. Teng XP'da rank bir xil (SQL `rank()`), tartib `user_id` bo'yicha barqaror.
 */
export async function fetchLeaderboard(userId: string, limit: number): Promise<Leaderboard> {
  const [listRes, meRes] = await Promise.all([
    supabase
      .from('leaderboard_current_week')
      .select(LEADERBOARD_COLUMNS)
      .order('rank')
      .order('user_id')
      .limit(limit)
      .overrideTypes<LeaderboardRow[], { merge: false }>(),
    supabase
      .from('leaderboard_current_week')
      .select(LEADERBOARD_COLUMNS)
      .eq('user_id', userId)
      .maybeSingle()
      .overrideTypes<LeaderboardRow | null, { merge: false }>(),
  ]);
  if (listRes.error) throw new Error(listRes.error.message);
  if (meRes.error) throw new Error(meRes.error.message);
  return { entries: listRes.data.map(toEntry), me: meRes.data ? toEntry(meRes.data) : null };
}

/** Leaderboard'da ko'rsatiladigan ism — `full_name` bo'sh bo'lsa (email hech qachon ochilmaydi). */
export function leaderboardName(entry: LeaderboardEntry): string {
  return entry.name.trim() || 'Anonymous learner';
}
