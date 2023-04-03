import React from 'react';
import useFetchTargetUserTracks from '../hooks/useFetchTargetUserTracks';
import { UserType } from '../interfaces';
import TrackCard from './TrackCard';

type Props = {
    uid: string;
};

const UserTracks = ({ uid }: Props) => {
  const userTracks = useFetchTargetUserTracks(uid);
  return (
    <div>
      {userTracks.length > 0 && (
        <div className='mt-5 flex items-center justify-center flex-col w-full'>
          {userTracks?.map((track) => (
            <TrackCard key={track.id} {...track} userId={uid} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTracks;
