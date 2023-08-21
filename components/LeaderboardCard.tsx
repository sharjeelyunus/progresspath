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
  const isMobile = window.innerWidth < 768;

  const calculateProgress = () => {
    const progress = (completedTasks / 39) * 100;
    return progress.toFixed(0) as unknown as number;
  };

  const progressPercentage = calculateProgress();

  return (
    <>
      {author?.username ? (
        <Link
          href={`/user/${author?.username}`}
          className='flex flex-col items-center justify-between bg-[#393053] text-white px-5 py-2 rounded-2xl w-[350px] lg:w-[650px] mt-3'
        >
          <div className='flex items-center justify-between w-full'>
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
              <div className={isMobile ? '' : 'flex gap-3 items-center'}>
                <h2 className='font-bold'>{author?.name}</h2> {!isMobile && '|'}
                <span className='text-sm'>
                  Completed {completedTasks}{' '}
                  {completedTasks > 1 ? 'tasks' : 'task'}
                </span>
              </div>
            </div>
            <div className='border-l'>
              <p className='font-bold ml-3'>{points}pt</p>
            </div>
          </div>
          <div className='flex w-full items-center text-white mt-1 gap-3'>
            <div className='h-[10px] w-full bg-slate-300 rounded-full'>
              <div
                className='bg-blue-500 h-[10px] rounded-full'
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div>{progressPercentage}%</div>
          </div>
        </Link>
      ) : (
        <div className='flex items-center justify-between bg-[#393053] text-white px-5 py-3 rounded-2xl w-[350px] lg:w-[600px] mt-3'>
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
              <span className='text-sm'>
                Completed {completedTasks}{' '}
                {completedTasks > 1 ? 'tasks' : 'task'}
              </span>
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
