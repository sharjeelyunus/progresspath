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

  const [loadingOnboardingStatus, setLoadingOnboardingStatus] = useState(true);
  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const [openOnboardingModal, setOpenOnboardingModal] = useState(false);
  const trainings = useGetAllTrainings();
  const userEnrolledTracks = useGetUserTracks();

  useEffect(() => {
    if (loggedInUser) {
      setLoadingOnboardingStatus(true);
      if (!loggedInUser.onboarding) {
        setOpenOnboardingModal(true);
      } else {
        setOpenOnboardingModal(false);
      }
      setLoadingOnboardingStatus(false);
    }
  }, [loggedInUser]);

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <Layout title='Trainings | ProgressPath'>
        {loadingOnboardingStatus ? (
          <div className='flex justify-center items-center text-white text-2xl bg-[#635985] py-28 min-h-screen'>Loading...</div>
        ) : loggedInUser.onboarding ? (
          <>
            <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
              {trainings.map((training, index) => (
                <>
                  {userEnrolledTracks &&
                  userEnrolledTracks
                    .map((track) => track.id)
                    .includes(training.id) ? (
                    <Link
                      key={index}
                      href={training.slug}
                      className='bg-[#393053] min-w-[300px] flex flex-col items-center justify-center px-10 h-[200px] rounded-2xl'
                    >
                      <h1 className='text-2xl font-bold text-white'>
                        {training.name}
                      </h1>
                      <div className='flex items-center mt-4'>
                        <img
                          className='h-8 w-8 rounded-full mr-2'
                          src={training.leadImage ? training.leadImage : '/blank-profile-picture.svg'}
                          alt={training.leadName}
                        />
                        <p className='text-white'>{training.leadName}</p>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setOpenEnrollModal(true)}
                        key={training.id}
                        className='bg-[#393053] min-w-[300px] flex flex-col items-center justify-center px-10 h-[200px] rounded-2xl'
                      >
                        <h1 className='text-2xl font-bold text-white'>
                          {training.name}
                        </h1>
                        <div className='flex items-center mt-4'>
                          <img
                            className='h-8 w-8 rounded-full mr-2'
                            src={training.leadImage}
                            alt={training.leadName}
                          />
                          <p className='text-white'>{training.leadName}</p>
                        </div>
                      </button>
                      {openEnrollModal && (
                        <EnrollModal
                          key={training.id}
                          isOpen={openEnrollModal}
                          trackSlug={training.slug}
                          trackId={training.id}
                          setIsOpen={setOpenEnrollModal}
                        />
                      )}
                    </>
                  )}
                </>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
              <OnboardingModal
                key={1}
                isOpen={openOnboardingModal}
                setIsOpen={setOpenOnboardingModal}
              />
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default TrainingsHomePage;
