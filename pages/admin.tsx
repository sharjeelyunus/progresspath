import React from 'react';
import { useAuth } from '../context/AuthContext';
import Error404 from '../src/shared/components/Error404';
import Layout from '../components/Layout';
import useGetMentorRequests from '../hooks/useGetMentorRequests';
import MentorRequestCard from '../src/cards/MentorRequestCard';
import useGetAllTrainings from '../hooks/useGetTrainings';
import Link from 'next/link';

const AdminPanel = () => {
  const { loggedInUser } = useAuth();

  if (!loggedInUser?.isAdmin) {
    return <Error404 />;
  }

  const mentorRequests = useGetMentorRequests();

  const trainings = useGetAllTrainings();

  return (
    <Layout title='Admin Panel | ProgressPath'>
      <div className='text-white bg-gray-700 py-28 min-h-screen px-10'>
        {trainings.filter((training) => training?.trackStatus === 'in-review')
          .length > 0 && (
          <div className='mb-10'>
            <h1 className='text-3xl font-bold mb-5'>Trainings in Review</h1>
            {trainings
              .filter((training) => training?.trackStatus === 'in-review')
              .map((training, index) => (
                <Link
                  href={`/${training?.slug}`}
                  target='_blank'
                  key={index}
                  className='flex items-center justify-between bg-gray-800 rounded-lg p-5 mb-5'
                >
                  <div className='flex items-center'>
                    <img
                      src={training?.image}
                      alt='track'
                      className='w-20 h-20 rounded-full'
                    />
                    <div className='ml-5'>
                      <h1 className='text-xl font-bold'>{training?.name}</h1>
                      <p className='text-sm'>
                        {training?.trackShortDescription}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <button className='bg-green-500 text-white px-5 py-2 rounded-lg mr-5'>
                      Approve
                    </button>
                    <button className='bg-red-500 text-white px-5 py-2 rounded-lg'>
                      Reject
                    </button>
                  </div>
                </Link>
              ))}
          </div>
        )}
        {mentorRequests.map((request, index) => (
          <MentorRequestCard key={index} request={request} />
        ))}
      </div>
    </Layout>
  );
};

export default AdminPanel;
