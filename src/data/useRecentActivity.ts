import { useAuth } from '../context/useAuth';
import { useAsyncData } from './useAsyncData';
import { fetchRecentXpEvents } from './xp';

/** Joriy userning oxirgi `limit` ta XP voqeasi (Dashboard'dagi "Recent Activity"). */
export function useRecentActivity(limit = 5) {
  const { user } = useAuth();
  const userId = user?.id;
  const { data, ...state } = useAsyncData(userId ? `${userId}|${limit}` : null, () =>
    userId ? fetchRecentXpEvents(userId, limit) : Promise.resolve([]),
  );
  return { events: data, ...state };
}
