import { useMemo, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { XpStatsContext, type XpStatsContextValue } from './xpStatsContext';
import { useAsyncData } from '../data/useAsyncData';
import { fetchXpStats } from '../data/xp';

/**
 * Joriy userning umumiy XP'si va streak'i (TopNav'dagi belgi). Bitta joyda saqlanadi, chunki XP
 * boshqa sahifada o'zgaradi (CourseDetail'da dars tugatilganda) — o'sha yerdan `reload()` chaqiriladi.
 */
export function XpStatsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsyncData(user ? user.id : null, fetchXpStats);

  const value = useMemo<XpStatsContextValue>(
    () => ({ stats: data, loading, error, reload }),
    [data, loading, error, reload],
  );

  return <XpStatsContext.Provider value={value}>{children}</XpStatsContext.Provider>;
}
