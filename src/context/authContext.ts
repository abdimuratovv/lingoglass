import type { Session, User } from '@supabase/supabase-js';
import { createContext } from 'react';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** True while the initial session is being restored from storage. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
