import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useGetAllTrainings from '../hooks/useGetTrainings';
import OnboardingModal from '../modals/OnboardingModal';
import Layout from './Layout';
import { Toaster } from 'react-hot-toast';
import TrainingCard from './TrainingCard';

const TrainingsHomePage = () => {
  const { loggedInUser } = useAuth();
  const trainings = useGetAllTrainings();
  const [loadingTrainings, setLoadingTrainings] = useState(true);
  const [openOnboardingModal, setOpenOnboardingModal] = useState(false);

  useEffect(() => {
    setLoadingTrainings(true);
    if (loggedInUser && !loggedInUser.onboarding && !openOnboardingModal) {
      setOpenOnboardingModal(true);
    }
    setLoadingTrainings(false);
  }, [loggedInUser, openOnboardingModal]);

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <Layout title='ProgressPath'>
        {loadingTrainings ? (
          <div className='flex justify-center items-center text-white text-2xl bg-[#635985] py-28 min-h-screen'>
            Loading...
          </div>
        ) : loggedInUser?.onboarding ? (
          <div className='flex flex-col lg:flex-row justify-center items-center gap-5 bg-gray-700 py-28 min-h-screen'>
            {trainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        ) : (
          <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
            <OnboardingModal
              isOpen={openOnboardingModal}
              setIsOpen={setOpenOnboardingModal}
            />
          </div>
        )}
      </Layout>
    </>
  );
};

export default TrainingsHomePage;
