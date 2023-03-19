import Link from 'next/link';
import React, { useState } from 'react';
import useGetAllTrainings from '../hooks/useGetTrainings';
import useGetUserTracks from '../hooks/useGetUserTracks';
import EnrollModal from '../modals/EnrollModal';
import Layout from './Layout';

const TrainingsHomePage = () => {
  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const trainings = useGetAllTrainings();
  const userEnrolledTracks = useGetUserTracks();

  return (
    <>
      <Layout title='React & Nextjs | ProgressPath'>
        <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
          {trainings.map((training, index) => (
            <>
              {userEnrolledTracks &&
              userEnrolledTracks
                .map((track) => track.id)
                .includes(training.id) ? (
                <Link
                  key={index}
                  href={training.slug}
                  className='bg-[#393053] flex flex-col items-center justify-center px-10 h-[200px] rounded-2xl'
                >
                  <h1 className='text-2xl font-bold text-white'>
                    {training.name}
                  </h1>
                  <div className='flex items-center mt-4'>
                    <img
                      className='h-8 w-8 rounded-full mr-2'
                      src={training.leadImage}
                      alt={training.leadName}
                    />
                    <p className='text-white'>{training.leadName}</p>
                  </div>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setOpenEnrollModal(true)}
                    key={training.id}
                    className='bg-[#393053] flex flex-col items-center justify-center px-10 h-[200px] rounded-2xl'
                  >
                    <h1 className='text-2xl font-bold text-white'>
                      {training.name}
                    </h1>
                    <div className='flex items-center mt-4'>
                      <img
                        className='h-8 w-8 rounded-full mr-2'
                        src={training.leadImage}
                        alt={training.leadName}
                      />
                      <p className='text-white'>{training.leadName}</p>
                    </div>
                  </button>
                  {openEnrollModal && (
                    <EnrollModal
                      key={training.id}
                      isOpen={openEnrollModal}
                      trackSlug={training.slug}
                      trackId={training.id}
                      setIsOpen={setOpenEnrollModal}
                    />
                  )}
                </>
              )}
            </>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default TrainingsHomePage;
