import { useMemo, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { useSettings } from './useSettings';
import { XpStatsContext, type XpStatsContextValue } from './xpStatsContext';
import { useAsyncData } from '../data/useAsyncData';
import { fetchXpStats } from '../data/xp';
import { browserTimeZone } from '../lib/time';

/**
 * Joriy userning umumiy XP'si va streak'i (TopNav'dagi belgi). Bitta joyda saqlanadi, chunki XP
 * boshqa sahifada o'zgaradi (CourseDetail'da dars tugatilganda) — o'sha yerdan `reload()` chaqiriladi.
 *
 * Streak Settings'da tanlangan vaqt zonasida, tanlanmagan bo'lsa (yoki sozlamalar o'qilmasa) brauzer zonasida
 * hisoblanadi. Sozlamalar yuklanguncha so'rov yuborilmaydi — aks holda streak avval brauzer zonasida,
 * keyin boshqa zonada qayta hisoblanib "sakrab" qolishi mumkin.
 */
export function XpStatsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { settings, loading: settingsLoading } = useSettings();
  const timeZone = settings?.timezone || browserTimeZone();
  const key = user && !settingsLoading ? `${user.id}|${timeZone}` : null;
  const { data, loading, error, reload } = useAsyncData(key, () => fetchXpStats(timeZone));

  const value = useMemo<XpStatsContextValue>(
    () => ({ stats: data, loading, error, reload }),
    [data, loading, error, reload],
  );

  return <XpStatsContext.Provider value={value}>{children}</XpStatsContext.Provider>;
}
