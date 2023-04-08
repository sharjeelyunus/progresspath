import Link from 'next/link';
import React from 'react';
import { UserType } from '../interfaces';

type Props = {
  author: UserType;
  points: number;
  completedTasks: number;
  rank: number;
};

const LeaderboardCard = ({ rank, author, points, completedTasks }: Props) => {

  return (
    <>
      {author?.username ? (
        <Link
          href={`/user/${author?.username}`}
          className='flex items-center justify-between bg-[#393053] text-white px-5 py-1 rounded-2xl w-[350px] lg:w-[500px] mt-3'
        >
          <div className='flex items-center gap-3'>
            <span className='font-bold'>{rank}. </span>
            <img
              src={
                author?.photoURL
                  ? author?.photoURL
                  : '/blank-profile-picture.svg'
              }
              alt=''
              className='w-5 h-5 rounded-full'
            />
            <div className='flex gap-3 items-center'>
              <h2 className='font-bold'>{author?.name}</h2> |
              <span className='text-sm'>Completed {completedTasks} {completedTasks > 1 ? 'tasks' : 'task'}</span>
            </div>
          </div>
          <div className='border-l'>
            <p className='font-bold ml-3'>{points}pt</p>
          </div>
        </Link>
      ) : (
        <div className='flex items-center justify-between bg-[#393053] text-white px-5 py-3 rounded-2xl w-[350px] lg:w-[500px] mt-3'>
          <div className='flex items-center gap-3'>
            <span className='font-bold'>{rank}. </span>
            <img
              src={
                author?.photoURL
                  ? author?.photoURL
                  : '/blank-profile-picture.svg'
              }
              alt=''
              className='w-10 h-10 rounded-full'
            />
            <div>
              <h2 className='font-bold'>{author?.name}</h2>
              <span className='text-sm'>Completed {completedTasks} {completedTasks > 1 ? 'tasks' : 'task'}</span>
            </div>
          </div>
          <div className='border-l'>
            <p className='font-bold ml-3'>{points}pt</p>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderboardCard;
