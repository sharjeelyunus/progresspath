import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../interfaces';
import {
  getLocalStorageCache as getCache,
  setLocalStorageCache as setCache,
} from '../utils/cache';

export default function useGetLeaderboardData(): [LeaderboardEntry[]] {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );

  const cacheKey = 'leaderboardData';

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(`/api/leaderboard`);
      const data = await response.json();
      setLeaderboardData(data.leaderboard);
      setCache(cacheKey, data.leaderboard);
    } catch (error) {
      throw new Error('Failed to fetch leaderboard data');
    }
  };

  useEffect(() => {
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      setLeaderboardData(cachedData as LeaderboardEntry[]);
    } else {
      fetchLeaderboardData().catch((error) => console.error(error.message));
    }
  }, []);

  return [leaderboardData];
}
