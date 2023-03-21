import Link from 'next/link';
import React from 'react';
import useGetUserTrackDetails from '../hooks/useGetUserTrackDetails';
import { UserTracks } from '../interfaces';

const TrackCard = ({ id, trackId, timestamp }: UserTracks) => {
  const enrollDate = `${timestamp.toDate().getDate()}/${
    timestamp.toDate().getMonth() + 1
  }/${timestamp.toDate().getFullYear()}`;

  const userTrackDetails = useGetUserTrackDetails(trackId);
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
              <p className='text-white text-lg'>
                Lead: {userTrackDetails?.leadName}
              </p>
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
