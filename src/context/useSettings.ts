import { useContext } from 'react';
import { SettingsContext, type SettingsContextValue } from './settingsContext';

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings() faqat <SettingsProvider> ichida ishlatilishi kerak.');
  return ctx;
}
