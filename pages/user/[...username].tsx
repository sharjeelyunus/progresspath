import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import TrackCard from '../../components/TrackCard';
import useFetchTargetUser from '../../hooks/useFetchTargetUser';

type Props = {};

const ProfilePage = (props: Props) => {
  const router = useRouter();
  const username = (router.query.username as string[]) ?? [];
  const targetUser = useFetchTargetUser(username[0]);

  return (
    <Layout title={`${targetUser?.name} | ProgressPath`}>
      <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
        <div className='flex items-center flex-col'>
          <div className='flex gap-5'>
            <img
              src={targetUser?.photoURL}
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
          <div className='mt-5 flex items-center justify-center flex-col'>
            <h1 className='text-white font-semibold text-3xl'>Tracks</h1>
            {targetUser?.tracks.map((track) => (
              <TrackCard key={track.id} {...track} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
