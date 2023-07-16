import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useGetAllTrainings from '../hooks/useGetTrainings';
import useGetUserTracks from '../hooks/useGetUserTracks';
import EnrollModal from '../modals/EnrollModal';
import OnboardingModal from '../modals/OnboardingModal';
import Layout from './Layout';
import { Toaster } from 'react-hot-toast';
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const TrainingsHomePage = () => {
  const { loggedInUser } = useAuth();
  const trainings = useGetAllTrainings();
  const userEnrolledTracks = useGetUserTracks();
  const [loadingTrainings, setLoadingTrainings] = useState(true);
  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const [openOnboardingModal, setOpenOnboardingModal] = useState(false);
  const enrolledTrackIds = new Set(userEnrolledTracks.map((track) => track.id));
  const [enrolledUserCounts, setEnrolledUserCounts] = useState({});

  useEffect(() => {
    setLoadingTrainings(true);
    if (loggedInUser && !loggedInUser.onboarding && !openOnboardingModal) {
      setOpenOnboardingModal(true);
    }
    setLoadingTrainings(false);
  }, [loggedInUser, openOnboardingModal]);

  useEffect(() => {
    const fetchEnrolledUserCounts = async () => {
      const counts = {};
      const enrolledTrackIds: string[] = Array.from(
        userEnrolledTracks,
        (track) => track.id
      );
      for (const trackId of enrolledTrackIds) {
        const count = await getEnrolledUserCount(trackId);
        counts[trackId] = count;
      }
      setEnrolledUserCounts(counts);
    };

    fetchEnrolledUserCounts();
  }, [enrolledTrackIds]);

  const getEnrolledUserCount = async (trackId) => {
    const q = collectionGroup(db, 'enrolledTracks');
    const querySnapshot = await getDocs(q);
    const enrolledUserCount = querySnapshot.docs.filter(
      (doc) => doc.data().trackId === trackId
    ).length;
    return enrolledUserCount;
  };

  const renderTrainingCard = (training) => {
    const isEnrolled = enrolledTrackIds.has(training.id);
    const enrolledUserCount = enrolledUserCounts[training.id];

    return (
      <div
        key={training.id}
        className='bg-[#393053] min-w-[300px] flex flex-col items-center justify-center px-10 h-[200px] rounded-2xl'
      >
        <button onClick={() => setOpenEnrollModal(true)} className='w-full justify-center items-center'>
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
          <div className='flex justify-end mt-5'>
            <p className='text-white'>{enrolledUserCount} Enrolled</p>
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
        {loadingTrainings ? (
          <div className='flex justify-center items-center text-white text-2xl bg-[#635985] py-28 min-h-screen'>
            Loading...
          </div>
        ) : loggedInUser?.onboarding ? (
          <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
            {trainings.map((training) => (
              <Link key={training.id} href={training.slug}>
                {renderTrainingCard(training)}
              </Link>
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
