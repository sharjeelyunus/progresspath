import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../interfaces';
import { getCache, setCache } from '../utils/cache';
import { useSetRecoilState } from 'recoil';
import LeaderboardAtom from '../atoms/LeaderboardAtom';

export default function useGetLeaderboardData(): void {
  const setLeaderboardData = useSetRecoilState(LeaderboardAtom);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboardData(data.leaderboard);
      setCache('leaderboardData', data.leaderboard); // cache the fetched data
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  useEffect(() => {
    const cachedData = getCache<LeaderboardEntry[]>('leaderboardData'); // check if there is cached data
    if (cachedData) {
      setLeaderboardData(cachedData); // set the cached data if available
    } else {
      fetchLeaderboardData(); // fetch data if there is no cached data
    }
  }, []);
}
