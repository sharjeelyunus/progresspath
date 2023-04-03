import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserTracks } from '../interfaces';
import { db } from '../config/firebase';

export default function useGetUserTracks(): Array<UserTracks> {
  const [userEnrolledTracks, setUserEnrolledTracks] = useState<
    Array<UserTracks>
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    const enrolledTrackRef = collection(
      db,
      'users',
      user.uid,
      'enrolledTracks'
    );
    const q = query(enrolledTrackRef, orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (docs) => {
      const allUserTracksData = docs.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as UserTracks;
      });
      setUserEnrolledTracks(allUserTracksData);
    });

    return unsub;
  }, [db, user.uid]);

  return userEnrolledTracks;
}
