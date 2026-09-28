import { createContext } from 'react';
import type { UserSettings, UserSettingsUpdate } from '../data/settings';

export interface SettingsContextValue {
  /** `null` — yuklanmoqda yoki xato. */
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  /**
   * Optimistik: UI darhol yangilanadi, yozuvlar navbat bilan (yuborilgan tartibda) bazaga ketadi.
   * Xato bo'lsa sozlamalar bazadan qayta o'qiladi va xato matni qaytariladi.
   */
  updateSettings: (patch: UserSettingsUpdate) => Promise<{ error: string | null }>;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);
