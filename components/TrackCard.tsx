import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserTracks } from '../interfaces';
import CompletedTaskDetails from './CompletedTaskDetails';
import { useGetUserCompletedTasks } from '../hooks/useGetUserCompletedTasks';

type Props = UserTracks & {
  userId: string;
};

const TrackCard = ({ userId, trackId, timestamp }: Props) => {
  const { loggedInUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  const enrollDate = `${timestamp.toDate().getDate()}/${
    timestamp.toDate().getMonth() + 1
  }/${timestamp.toDate().getFullYear()}`;

  const userTrackDetails = useGetUserCompletedTasks(trackId, userId);

  // sort completed tasks by date
  const sortedCompletedTasks = userTrackDetails?.completedTasksByUser?.sort(
    (a, b) => b.timestamp.seconds - a.timestamp.seconds
  );

  useEffect(() => {
    if (userTrackDetails) {
      setLoading(false);
    }
  }, [userTrackDetails]);

  if (loading) {
    return <div className='text-white mt-5'>Loading...</div>;
  }

  return (
    <div
      className={
        loggedInUser?.uid === userId ||
        userTrackDetails?.lead?.uid === loggedInUser?.uid
          ? 'bg-[#443C68] lg:p-10 p-5 mt-5 rounded-2xl lg:max-w-[80%]'
          : 'w-full'
      }
    >
      <Link href={`/${userTrackDetails?.slug}`} className='flex justify-center'>
        <div className='lg:flex lg:w-full justify-center w-[350px] items-center bg-[#18122B] rounded-2xl p-5 lg:mt-5'>
          <div className='lg:flex gap-5 items-center'>
            <img
              src={
                userTrackDetails?.image
                  ? userTrackDetails?.image
                  : '/blank-profile-picture.svg'
              }
              alt={userTrackDetails?.name}
              className='lg:w-24 lg:h-24 rounded-2xl'
            />
            <div className='lg:flex gap-10'>
              <div>
                <h1 className='text-white font-semibold lg:text-2xl text-3xl'>
                  {userTrackDetails?.name}
                </h1>
                <a
                  href={userTrackDetails?.lead?.uid}
                  className='text-white text-lg flex items-center gap-2 mt-2'
                >
                  <img
                    className='w-6 h-6 rounded-full'
                    src={
                      userTrackDetails?.lead?.photoURL ||
                      '/blank-profile-picture.svg'
                    }
                    alt={userTrackDetails?.lead?.name}
                  />
                  <span>
                    {userTrackDetails?.lead?.name
                      ? userTrackDetails?.lead?.name
                      : 'Sharjeel Yunus'}
                  </span>
                </a>
              </div>
              <div className='lg:border-x lg:px-10'>
                <p className='text-white text-lg'>
                  Completed Tasks:{' '}
                  {userTrackDetails?.completedTasksByUser?.length}
                </p>
                <p className='text-white text-lg'>
                  Points: {userTrackDetails?.userPoints}
                </p>
              </div>
            </div>
          </div>
          <div className='flex lg:gap-0 gap-2 lg:flex-col lg:pl-10 lg:items-center'>
            <p className='text-white text-lg'>Enrolled</p>
            <p className='text-white text-lg'>{enrollDate}</p>
          </div>
        </div>
      </Link>
      {(loggedInUser?.uid === userId ||
        userTrackDetails?.lead?.uid === loggedInUser?.uid) && (
        <div className='w-full flex flex-wrap gap-5 lg:px-20 justify-center'>
          {sortedCompletedTasks?.map((task) => (
            <CompletedTaskDetails
              key={task.id}
              {...task}
              trackId={trackId}
              leadId={userTrackDetails?.lead?.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackCard;
