import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LeaderboardCard from '../components/LeaderboardCard';
import useGetLeaderboardData from '../hooks/useGetLeaderboard';

const Leaderboard = () => {
  const [leaderboardData] = useGetLeaderboardData();
  console.log(leaderboardData)

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leaderboardData?.length > 0) {
      setLoading(false);
    }
  }, [leaderboardData]);

  if (loading) {
    return (
      <Layout title='Loading... | ProgressPath'>
        <div className='flex justify-center items-center text-white bg-[#272829] py-28 min-h-screen'>
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title='Leaderboard | ProgressPath'>
      <div className='pt-24 flex flex-col items-center bg-[#272829] text-white min-h-screen'>
        <h1 className='font-bold text-2xl'>Architects of Excellence</h1>
        <div className='py-3'>
          {leaderboardData?.map((entry, index) => (
            <LeaderboardCard
              key={entry.author.uid}
              rank={entry?.rank || index + 1}
              author={entry.author}
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
