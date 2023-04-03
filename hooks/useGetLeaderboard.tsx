import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../interfaces';

export default function useGetLeaderboardData(): LeaderboardEntry[] {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboardData(data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return leaderboardData;
}
