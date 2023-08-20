import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Error404 from '../src/shared/components/Error404';
import Layout from '../components/Layout';
import useGetMentorRequests from '../hooks/useGetMentorRequests';

const AdminPanel = () => {
  const { loggedInUser } = useAuth();

  if (!loggedInUser?.isAdmin) {
    return <Error404 />;
  }

  const mentorRequests = useGetMentorRequests();

  return (
    <Layout title='Admin Panel | ProgressPath'>
      <div className='text-white bg-[#272829] py-28 min-h-screen px-10'>
        {mentorRequests.map((request, index) => (
          <div key={index} className='bg-[#443C68] p-5 rounded-xl'>
            <h1 className='text-3xl font-bold text-center'>
              {request.trackName} ({request.trackType}) -{' '}
              <span className='font-normal text-lg'>({request.status})</span>
            </h1>
            <div className='lg:flex justify-between items-center gap-10'>
              <div className='lg:flex gap-5 items-center mt-5'>
                <div className='flex gap-5 items-center'>
                  <img
                    src={request.photoURL}
                    alt={request.name}
                    className='w-12 h-12 rounded-full'
                  />
                  <div className='min-w-[200px]'>
                    <p className='font-bold text-lg'>{request.name}</p>
                    <p>{request.areaOfExpertise}</p>
                    <p>Experience: {request.yearsOfExperience} years</p>
                  </div>
                </div>
                <div className='lg:border lg:h-16'></div>
                <div className='min-w-[250px]'>
                  <p className='font-bold text-lg'>Motivation</p>
                  <p>{request.motivation}</p>
                </div>
                <div className='lg:border lg:h-16'></div>
                <div className='w-full'>
                  <p className='font-bold text-lg'>Track Description</p>
                  <p>{request.trackShortDescription}</p>
                </div>
              </div>
              <div className='flex justify-end mt-5 h-10'>
                <button className='bg-green-500 text-white px-5 py-2 rounded-md'>
                  Approve
                </button>
                <button className='bg-red-500 text-white px-5 py-2 rounded-md ml-5'>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default AdminPanel;
