import { createContext } from 'react';

export interface Profile {
  id: string;
  full_name: string;
  avatar_seed: string;
  bio: string;
  cefr_level: string | null;
  daily_goal_minutes: number;
}

export type ProfileUpdate = Partial<Pick<Profile, 'full_name' | 'bio'>>;

export interface ProfileContextValue {
  profile: Profile | null;
  /** True while the current user's profile row is being fetched. */
  loading: boolean;
  error: string | null;
  updateProfile: (patch: ProfileUpdate) => Promise<{ error: string | null }>;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);

/** Avatar hozircha picsum placeholder — `avatar_seed` (signup'da user id) bo'yicha barqaror rasm. */
export function avatarUrl(seed: string | undefined, size: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed || 'lingoglass')}/${size}/${size}`;
}

/** `full_name` bo'sh bo'lsa email'ning @ gacha qismi, u ham bo'lmasa bo'sh qator. */
export function displayName(profile: Profile | null, email: string | undefined): string {
  return profile?.full_name.trim() || email?.split('@')[0] || '';
}
