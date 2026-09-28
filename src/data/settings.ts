import { supabase } from '../lib/supabaseClient';

/** `user_settings` qatori (signup'da handle_new_user() trigger'i yaratadi). Ustun nomlari bazadagidek. */
export interface UserSettings {
  push_notifications: boolean;
  email_notifications: boolean;
  streak_reminders: boolean;
  leaderboard_updates: boolean;
  /** `false` bo'lsa leaderboard_current_week view userni chiqarmaydi. */
  show_on_leaderboard: boolean;
  share_progress: boolean;
  interface_language: string;
  learning_language: string;
  /** IANA zona (masalan "Asia/Tashkent"); `null` — brauzer zonasi ishlatiladi. Streak shu zonada hisoblanadi. */
  timezone: string | null;
  focus_areas: string[];
}

export type UserSettingsUpdate = Partial<UserSettings>;

const SETTINGS_COLUMNS =
  'push_notifications, email_notifications, streak_reminders, leaderboard_updates, show_on_leaderboard, ' +
  'share_progress, interface_language, learning_language, timezone, focus_areas';

export async function fetchSettings(userId: string): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .select(SETTINGS_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle()
    .overrideTypes<UserSettings | null, { merge: false }>();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Settings not found for this account.');
  return data;
}

/** RLS yozishni rad etsa PostgREST xato emas, 0 qator qaytaradi — shuning uchun qaytgan qatorlar tekshiriladi. */
export async function saveSettings(userId: string, patch: UserSettingsUpdate): Promise<void> {
  const { data, error } = await supabase.from('user_settings').update(patch).eq('user_id', userId).select('user_id');
  if (error) throw new Error(error.message);
  if (data.length === 0) throw new Error('Settings were not saved.');
}
