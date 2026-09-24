import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { ProfileContext, type Profile, type ProfileContextValue, type ProfileUpdate } from './profileContext';

const PROFILE_COLUMNS = 'id, full_name, avatar_seed, bio, cefr_level, daily_goal_minutes';

interface Result {
  userId: string;
  profile: Profile | null;
  error: string | null;
}

/**
 * Joriy userning `profiles` qatori (signup'da handle_new_user() trigger'i yaratadi).
 * TopNav va Dashboard bir xil ma'lumotni ko'rsatishi va profil tahrirlangandan keyin
 * ikkalasi ham darhol yangilanishi uchun bitta joyda saqlanadi.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [result, setResult] = useState<Result>({ userId: '', profile: null, error: null });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', userId)
      .single()
      .overrideTypes<Profile, { merge: false }>()
      .then(({ data, error }) => {
        if (!cancelled) setResult({ userId, profile: error ? null : data, error: error?.message ?? null });
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const updateProfile = useCallback(
    async (patch: ProfileUpdate) => {
      if (!userId) return { error: 'Not signed in.' };
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(patch)
          .eq('id', userId)
          .select(PROFILE_COLUMNS)
          .single()
          .overrideTypes<Profile, { merge: false }>();
        if (error) return { error: error.message };
        setResult({ userId, profile: data, error: null });
        return { error: null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
    [userId],
  );

  const isCurrent = result.userId === userId;

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile: isCurrent ? result.profile : null,
      loading: !!userId && !isCurrent,
      error: isCurrent ? result.error : null,
      updateProfile,
    }),
    [isCurrent, result, userId, updateProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
