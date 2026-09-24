import { useContext } from 'react';
import { ProfileContext, type ProfileContextValue } from './profileContext';

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile() faqat <ProfileProvider> ichida ishlatilishi kerak.');
  return ctx;
}
