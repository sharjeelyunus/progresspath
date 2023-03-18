import Link from 'next/link';
import React from 'react';
import useGetAllTrainings from '../hooks/useGetTrainings';
import Layout from './Layout';

type Props = {};

const TrainingsHomePage = (props: Props) => {
  const trainings = useGetAllTrainings();

  return (
    <Layout title='React & Nextjs | ProgressPath'>
      <div className='flex justify-center bg-[#635985] text-white py-28 min-h-screen'>
        {trainings.map((training) => (
          <Link
            key={training.id}
            href={training.slug}
            className='bg-[#393053] flex flex-col items-center justify-center px-10 h-[200px] rounded-2xl'
          >
            <h1 className='text-2xl font-bold'>{training.name}</h1>
            <div className='flex items-center mt-4'>
              <img
                className='h-8 w-8 rounded-full mr-2'
                src={training.leadImage}
                alt={training.leadName}
              />
              <p>{training.leadName}</p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default TrainingsHomePage;
