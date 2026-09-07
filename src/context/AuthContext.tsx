import type { Session } from '@supabase/supabase-js';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { AuthContext, type AuthContextValue } from './authContext';

const NOT_CONFIGURED_ERROR =
  'Supabase hali ulanmagan. ".env.local" faylida VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY to\'ldirilishi kerak.';

/** signIn/signUp tarmoq xatosi bilan yiqilib ketmasligi uchun -- xabarni bir xil { error } shaklga keltiradi. */
function toAuthResult(error: unknown): { error: string | null } {
  if (!error) return { error: null };
  if (error instanceof Error) return { error: error.message };
  return { error: String(error) };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      async signIn(email, password) {
        if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          return { error: error?.message ?? null };
        } catch (err) {
          return toAuthResult(err);
        }
      },
      async signUp(email, password, fullName) {
        if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
          });
          return { error: error?.message ?? null };
        } catch (err) {
          return toAuthResult(err);
        }
      },
      async signOut() {
        if (!isSupabaseConfigured) return;
        try {
          await supabase.auth.signOut();
        } catch {
          // Chiqib ketish har doim mahalliy sessiyani tozalashi kerak -- tarmoq xatosi
          // bo'lsa ham foydalanuvchini "Log Out" bosgandan keyin qulflab qo'ymaymiz.
        }
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
