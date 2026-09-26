import { useContext } from 'react';
import { XpStatsContext, type XpStatsContextValue } from './xpStatsContext';

export function useXpStats(): XpStatsContextValue {
  const ctx = useContext(XpStatsContext);
  if (!ctx) throw new Error('useXpStats() faqat <XpStatsProvider> ichida ishlatilishi kerak.');
  return ctx;
}
