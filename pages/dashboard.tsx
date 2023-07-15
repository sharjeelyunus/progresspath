import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TracksCard from '../components/Dashboard/TracksCard';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { loggedInUser } = useAuth();
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    if (loggedInUser?.mentorTracks?.length > 0) {
      setIsMentor(true);
    } else {
      setIsMentor(false);
    }
  }, [loggedInUser]);

  if (!isMentor) {
    return (
      <div className='flex justify-center items-center text-white bg-[#635985] py-28 min-h-screen'>
        <h1 className='text-2xl'>Error 404</h1>
      </div>
    );
  }

  return (
    <Layout title='Dashboard | ProgressPath'>
      <div className='flex flex-col justify-center items-center text-white bg-[#635985] py-28 min-h-screen'>
        <h1>Dashboard</h1>
        {loggedInUser?.mentorTracks?.map((track) => (
          <TracksCard trackId={track} />
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
