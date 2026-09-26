import { useAuth } from '../context/useAuth';
import { useAsyncData } from './useAsyncData';
import { fetchLeaderboard } from './xp';

const LEADERBOARD_LIMIT = 50;

/** Joriy haftaning reytingi (top 50) + joriy userning o'z qatori. */
export function useLeaderboard() {
  const { user } = useAuth();
  const userId = user?.id;
  const { data, ...state } = useAsyncData(userId ? `leaderboard|${userId}` : null, () =>
    userId ? fetchLeaderboard(userId, LEADERBOARD_LIMIT) : Promise.resolve({ entries: [], me: null }),
  );
  return { leaderboard: data, ...state };
}
