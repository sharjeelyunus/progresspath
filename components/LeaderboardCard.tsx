import Link from 'next/link';
import React from 'react';
import useGetTargetUser from '../hooks/useGetTargetUser';

type Props = {
  authorId: string;
  points: number;
  completedTasks: number;
  rank: number;
};

const LeaderboardCard = ({ rank, authorId, points, completedTasks }: Props) => {
  const targetUser = useGetTargetUser(authorId);

  return (
    <>
      {targetUser?.username ? (
        <Link
          href={`/user/${targetUser?.username}`}
          className='flex items-center justify-between bg-[#393053] text-white px-5 py-3 rounded-2xl w-[350px] lg:w-[500px] mt-3'
        >
          <div className='flex items-center gap-3'>
            <span className='font-bold text-xl'>{rank}. </span>
            <img
              src={
                targetUser?.photoURL
                  ? targetUser?.photoURL
                  : '/blank-profile-picture.svg'
              }
              alt=''
              className='w-10 h-10 rounded-full'
            />
            <div>
              <h2 className='font-bold'>{targetUser?.name}</h2>
              <span className='text-sm'>Completed {completedTasks} tasks</span>
            </div>
          </div>
          <div className='border-l'>
            <p className='font-bold text-lg ml-3'>{points}pt</p>
          </div>
        </Link>
      ) : (
        <div className='flex items-center justify-between bg-[#393053] text-white px-5 py-3 rounded-2xl w-[350px] lg:w-[500px] mt-3'>
          <div className='flex items-center gap-3'>
            <span className='font-bold text-xl'>{rank}. </span>
            <img
              src={
                targetUser?.photoURL
                  ? targetUser?.photoURL
                  : '/blank-profile-picture.svg'
              }
              alt=''
              className='w-10 h-10 rounded-full'
            />
            <div>
              <h2 className='font-bold'>{targetUser?.name}</h2>
              <span className='text-sm'>Completed {completedTasks} tasks</span>
            </div>
          </div>
          <div className='border-l'>
            <p className='font-bold text-lg ml-3'>{points}pt</p>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderboardCard;
