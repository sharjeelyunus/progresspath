import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useGetAllTrainings from '../hooks/useGetTrainings';
import useGetUserTracks from '../hooks/useGetUserTracks';
import EnrollModal from '../modals/EnrollModal';
import OnboardingModal from '../modals/OnboardingModal';
import Layout from './Layout';
import { Toaster } from 'react-hot-toast';

const TrainingsHomePage = () => {
  const { loggedInUser } = useAuth();
  const trainings = useGetAllTrainings();
  const userEnrolledTracks = useGetUserTracks();
  const [loading, setLoading] = useState(true);
  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const [openOnboardingModal, setOpenOnboardingModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (loggedInUser && !loggedInUser.onboarding) {
      setOpenOnboardingModal(true);
    }
    setLoading(false);
  }, [loggedInUser]);

  const renderTrainingCard = (training) => {
    const isEnrolled = userEnrolledTracks
      .map((track) => track.id)
      .includes(training.id);

    return (
      <div key={training.id}>
        <button
          onClick={() => setOpenEnrollModal(true)}
          className='bg-[#393053] min-w-[300px] flex flex-col items-center justify-center px-10 h-[200px] rounded-2xl'
        >
          <h1 className='text-2xl font-bold text-white'>{training.name}</h1>
          <div className='flex items-center mt-4'>
            <img
              className='h-8 w-8 rounded-full mr-2'
              src={
                training.leadImage
                  ? training.leadImage
                  : '/blank-profile-picture.svg'
              }
              alt={training.leadName}
            />
            <p className='text-white'>{training.leadName}</p>
          </div>
        </button>
        {openEnrollModal && isEnrolled && (
          <EnrollModal
            isOpen={openEnrollModal}
            trackSlug={training.slug}
            trackId={training.id}
            setIsOpen={setOpenEnrollModal}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <Layout title='Trainings | ProgressPath'>
        {loading ? (
          <div className='flex justify-center items-center text-white text-2xl bg-[#635985] py-28 min-h-screen'>
            Loading...
          </div>
        ) : loggedInUser?.onboarding ? (
          <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
            {trainings.map((training) =>
              userEnrolledTracks
                .map((track) => track.id)
                .includes(training.id) ? (
                <Link key={training.id} href={training.slug}>
                  {renderTrainingCard(training)}
                </Link>
              ) : (
                renderTrainingCard(training)
              )
            )}
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
