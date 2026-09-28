import { useCallback, useMemo, useRef, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { SettingsContext, type SettingsContextValue } from './settingsContext';
import { useAsyncData } from '../data/useAsyncData';
import { fetchSettings, saveSettings, type UserSettingsUpdate } from '../data/settings';

/**
 * Joriy userning `user_settings` qatori. Context'da, chunki Settings sahifasidan tashqari XpStatsProvider
 * (vaqt zonasi → streak) va Leaderboard (show_on_leaderboard) ham o'qiydi.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const { data, loading, error, reload, mutate } = useAsyncData(userId ? `settings|${userId}` : null, () =>
    userId ? fetchSettings(userId) : Promise.reject(new Error('Not signed in.')),
  );

  // Toggle'ni tez-tez bosganda so'rovlar boshqa tartibda yetib borib, eski qiymat oxirgi bo'lib qolmasligi uchun.
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());

  const updateSettings = useCallback(
    (patch: UserSettingsUpdate) => {
      if (!userId) return Promise.resolve({ error: 'Not signed in.' });
      mutate((s) => ({ ...s, ...patch }));
      const run = writeQueue.current
        .then(() => saveSettings(userId, patch))
        .then(
          () => ({ error: null }),
          (err: unknown) => {
            reload();
            return { error: err instanceof Error ? err.message : String(err) };
          },
        );
      writeQueue.current = run;
      return run;
    },
    [userId, mutate, reload],
  );

  const value = useMemo<SettingsContextValue>(
    () => ({ settings: data, loading, error, reload, updateSettings }),
    [data, loading, error, reload, updateSettings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
