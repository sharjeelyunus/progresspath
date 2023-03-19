import React from 'react';
import Layout from '../components/Layout';
import LeaderboardCard from '../components/LeaderboardCard';

type Props = {};

const Leaderboard = (props: Props) => {
  return (
    <Layout title='Leaderboard | ProgressPath'>
      <div className='py-28 flex flex-col justify-center items-center min-h-screen bg-[#635985] text-white'>
        <h1 className='font-bold text-2xl'>Leaderboard</h1>
        <div className='py-5'>
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
