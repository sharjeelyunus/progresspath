import React from 'react';
import Layout from '../components/Layout';
import LeaderboardCard from '../components/LeaderboardCard';
import useGetLeaderboardData from '../hooks/useGetLeaderboard';

const Leaderboard = () => {
  const leaderboardData = useGetLeaderboardData();

  return (
    <Layout title='Leaderboard | ProgressPath'>
      <div className='py-28 flex flex-col items-center min-h-screen bg-[#635985] text-white'>
        <h1 className='font-bold text-2xl'>Leaderboard</h1>
        <div className='py-5'>
          {leaderboardData.map((entry, index) => (
            <LeaderboardCard
              key={entry.authorId}
              rank={index + 1}
              authorId={entry.authorId}
              points={entry.points}
              completedTasks={entry.totalCompletedTasks}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
