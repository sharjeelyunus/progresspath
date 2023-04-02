import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import LeaderboardCard from '../components/LeaderboardCard';
import useGetLeaderboardData from '../hooks/useGetLeaderboard';

const Leaderboard = () => {
  const leaderboardData = useGetLeaderboardData();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leaderboardData) {
      setLoading(false);
    }
  }, [leaderboardData]);

  const sortedData = useMemo(() => {
    if (!leaderboardData) {
      return [];
    }
    return [...leaderboardData].sort((a, b) => b.points - a.points);
  }, [leaderboardData]);

  if (loading) {
    return (
      <Layout title='Loading... | ProgressPath'>
        <div className='flex justify-center items-center text-white bg-[#635985] py-28 min-h-screen'>
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title='Leaderboard | ProgressPath'>
      <div className='py-28 flex flex-col items-center min-h-screen bg-[#635985] text-white'>
        <h1 className='font-bold text-2xl'>Leaderboard</h1>
        <div className='py-5'>
          {sortedData.map((entry, index) => (
            <LeaderboardCard
              key={entry.authorId}
              rank={index + 1}
              authorId={entry.authorId}
              points={entry.points}
              completedTasks={entry.completedTasks.length}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
