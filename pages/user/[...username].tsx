import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import TrackCard from '../../components/TrackCard';
import useFetchTargetUser from '../../hooks/useFetchTargetUser';

const ProfilePage = () => {
  const router = useRouter();
  const username = (router.query.username as string[]) ?? [];
  const targetUser = useFetchTargetUser(username[0]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (targetUser) {
      setLoading(false);
    }
  }, [targetUser]);

  if (loading) {
    return (
      <Layout title='Loading... | ProgressPath'>
        <div className='flex justify-center items-center text-white bg-[#635985] py-28 min-h-screen'>
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${targetUser?.name} | ProgressPath`}>
      <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
        <div className='flex items-center flex-col w-full'>
          <div className='flex gap-5'>
            <img
              src={targetUser?.photoURL ? targetUser.photoURL : '/blank-profile-picture.svg'}
              alt=''
              className='w-24 h-24 rounded-2xl'
            />
            <div>
              <h1 className='text-white font-semibold text-2xl'>
                {targetUser?.name}
              </h1>
              <p className='text-white text-lg'>{targetUser?.bio}</p>
              <p className='text-white'>{targetUser?.organization}</p>
            </div>
          </div>
          {targetUser?.tracks.length > 0 && (
            <div className='mt-5 flex items-center justify-center flex-col w-full'>
              {targetUser?.tracks?.map((track) => (
                <TrackCard key={track.id} {...track} userId={targetUser.uid} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
