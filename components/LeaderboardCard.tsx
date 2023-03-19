import React from 'react';

type Props = {};

const LeaderboardCard = (props: Props) => {
  return (
    <div className='flex items-center justify-between bg-[#393053] text-white px-5 py-3 rounded-2xl w-[350px] lg:w-[500px] mt-3'>
      <div className='flex items-center gap-3'>
        <span className='font-bold text-xl'>1. </span>
        <img
          src='https://lh3.googleusercontent.com/a/AGNmyxbZYy_DCwiT8JfFuHZX-_YvvjHQrUB18J9mI9jpag=s96-c'
          alt=''
          className='w-10 h-10 rounded-full'
        />
        <h3>Sharjeel Yunus</h3>
      </div>
      <div className='border-l'>
        <p className='font-bold text-lg ml-3'>20pt</p>
      </div>
    </div>
  );
};

export default LeaderboardCard;
