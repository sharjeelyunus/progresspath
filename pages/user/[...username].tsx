import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import useFetchTargetUser from '../../hooks/useFetchTargetUser';
import UserTracks from '../../components/UserTracks';
import Loading from '../../src/shared/components/Loading';

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
      <Loading />
    );
  }

  return (
    <Layout title={`${targetUser?.name} | ProgressPath`}>
      <div className='flex justify-center bg-gray-700 py-28 min-h-screen'>
        <div className='flex items-center flex-col w-full'>
          <div className='flex gap-5'>
            <img
              src={targetUser?.photoURL ? targetUser?.photoURL : '/blank-profile-picture.svg'}
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
          {targetUser?.uid && <UserTracks uid={targetUser.uid} />}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
