import { createContext } from 'react';
import type { XpStats } from '../data/xp';

export interface XpStatsContextValue {
  /** `null` — yuklanmoqda yoki xato (masalan get_my_xp_stats migratsiyasi hali qo'llanmagan). */
  stats: XpStats | null;
  loading: boolean;
  error: string | null;
  /** XP o'zgaradigan amaldan keyin (masalan darsni tugatish) chaqiriladi. */
  reload: () => void;
}

export const XpStatsContext = createContext<XpStatsContextValue | null>(null);
