import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import useGetUserTrackDetails from '../hooks/useGetUserTrackDetails';
import { UserTracks } from '../interfaces';

type Props = UserTracks & {
  userId: string;
};

const TrackCard = ({ userId, trackId, timestamp }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);

  const enrollDate = `${timestamp.toDate().getDate()}/${
    timestamp.toDate().getMonth() + 1
  }/${timestamp.toDate().getFullYear()}`;

  const userTrackDetails = useGetUserTrackDetails(trackId, userId);

  useEffect(() => {
    if (userTrackDetails) {
      setLoading(false);
    }
  }, [userTrackDetails]);

  if (loading) {
    return <div className='text-white mt-5'>Loading...</div>;
  }

  return (
    <Link href={`/${userTrackDetails?.slug}`}>
      <div className='lg:flex lg:w-full w-[350px] items-center bg-[#18122B] rounded-2xl p-5 mt-5'>
        <div className='lg:flex gap-5 items-center'>
          <img
            src={userTrackDetails?.image}
            alt=''
            className='lg:w-24 lg:h-24 rounded-2xl'
          />
          <div className='lg:flex gap-10'>
            <div>
              <h1 className='text-white font-semibold lg:text-2xl text-3xl'>
                {userTrackDetails?.name}
              </h1>
              <a
                href={userTrackDetails?.leadUsername}
                className='text-white text-lg flex items-center gap-2 mt-2'
              >
                <img
                  className='w-6 h-6 rounded-full'
                  src={userTrackDetails?.leadImage}
                  alt={userTrackDetails?.leadName}
                />
                <span>{userTrackDetails?.leadName}</span>
              </a>
            </div>
            <div className='lg:border-x lg:px-10'>
              <p className='text-white text-lg'>
                Completed Tasks: {userTrackDetails?.completedTasksByUser}
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
  );
};

export default TrackCard;
