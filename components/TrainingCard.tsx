import React, { useEffect, useState } from 'react';
import useEnrolledUserCounts from '../hooks/useEnrolledUserCounts';
import Link from 'next/link';
import EnrollModal from '../modals/EnrollModal';
import useGetUserTracks from '../hooks/useGetUserTracks';
import { useGetUserCompletedTasks } from '../hooks/useGetUserCompletedTasks';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import GenerateCertificateModal from '../modals/GenerateCertificateModal';

type Props = {
  training: any;
};

const TrainingCard = ({ training }: Props) => {
  const { user } = useAuth();
  const userEnrolledTracks = useGetUserTracks();
  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const enrolledUserCounts = useEnrolledUserCounts();
  const enrolledTrackIds = new Set(userEnrolledTracks.map((track) => track.id));
  const isEnrolled = enrolledTrackIds.has(training.id);
  const enrolledUserCount = enrolledUserCounts[training.id];

  if (isEnrolled) {
    return <EnrolledTrainingCard training={training} />;
  }

  if (!isEnrolled && training.trackStatus !== 'published') {
    if (training.mentors.includes(user.uid)) {
      return <EnrolledTrainingCard training={training} />;
    } else {
      return null;
    }
  }

  return (
    <>
      <button
        onClick={() => setOpenEnrollModal(true)}
        className='bg-[#393053] min-w-[300px] flex flex-col justify-center px-10 h-[200px] rounded-2xl'
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
        <div className='flex justify-end mt-5 w-full'>
          <p className='text-white'>{enrolledUserCount} Enrolled</p>
        </div>
      </button>
      {openEnrollModal && (
        <EnrollModal
          isOpen={openEnrollModal}
          trackSlug={training.slug}
          trackId={training.id}
          setIsOpen={setOpenEnrollModal}
        />
      )}
    </>
  );
};

export default TrainingCard;

const EnrolledTrainingCard = ({ training }: Props) => {
  const enrolledUserCounts = useEnrolledUserCounts();
  const enrolledUserCount = enrolledUserCounts[training.id];
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);
  const { user } = useAuth();
  const userTrackDetails = useGetUserCompletedTasks(training.id, user.uid);
  const calculateProgress = () => {
    const completedTasks = userTrackDetails?.completedTasksByUser;
    const progress = (completedTasks?.length / totalTasks) * 100;
    return progress.toFixed(2) as unknown as number;
  };

  const progressPercentage = calculateProgress();
  useEffect(() => {
    const fetchTotalTasks = async () => {
      const q = collection(db, 'trainings', training.id, 'tasks');
      const querySnapshot = await getDocs(q);
      const totalTasks = querySnapshot.docs.length;
      setTotalTasks(totalTasks);
    };

    fetchTotalTasks();
  }, []);
  return (
    <>
      <div className='bg-gray-800 min-w-[300px] flex flex-col justify-center h-full rounded-2xl border-2 border-[#272829]'>
        <Link key={training.id} href={training.slug}>
          <div className='h-[200px] w-[300px]'>
            <img
              src={training?.image}
              alt={training?.name}
              className='h-full w-full object-cover rounded-t-2xl'
            />
          </div>
          <div className='p-5'>
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
            <div className='flex mt-5 w-full justify-end'>
              <p className='text-white'>{enrolledUserCount} Enrolled</p>
            </div>
            <div className='flex w-full items-center text-white mt-5 gap-3'>
              <div className='h-[10px] w-full bg-slate-300 rounded-full'>
                <div
                  className='bg-blue-500 h-[10px] rounded-full'
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className='text-sm'>{progressPercentage}%</p>
            </div>
          </div>
        </Link>
        {progressPercentage >= 80 && (
          <button
            className='text-amber-400 py-5 bg-gray-800 rounded-b-2xl'
            onClick={() => setOpenReviewModal(true)}
          >
            Generate Certificate
          </button>
        )}
      </div>
      {openReviewModal && (
        <GenerateCertificateModal
          isOpen={openReviewModal}
          setIsOpen={setOpenReviewModal}
          trackId={training.id}
        />
      )}
    </>
  );
};
