import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useGetAllTrainings from '../hooks/useGetTrainings';
import Layout from './Layout';
import { Toaster } from 'react-hot-toast';
import TrainingCard from './TrainingCard';
import { useRouter } from 'next/router';

const TrainingsHomePage = () => {
  const { loggedInUser } = useAuth();
  const trainings = useGetAllTrainings();
  const [loadingTrainings, setLoadingTrainings] = useState(true);

  const router = useRouter();
  
  useEffect(() => {
    setLoadingTrainings(true);
    if (loggedInUser && !loggedInUser.onboarding) {
      router.push('/onboarding');
    }
    setLoadingTrainings(false);
  }, [loggedInUser]);

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <Layout title='ProgressPath'>
        {loadingTrainings ? (
          <div className='flex justify-center items-center text-white text-2xl bg-[#635985] py-28 min-h-screen'>
            Loading...
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row justify-center items-center gap-5 bg-gray-700 py-28 min-h-screen'>
            {trainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        )}
      </Layout>
    </>
  );
};

export default TrainingsHomePage;
