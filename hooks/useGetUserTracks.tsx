import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserTracks } from '../interfaces';

export default function useGetUserTracks(): Array<UserTracks> {
  const [userEnrolledTracks, setUserEnrolledTracks] = useState<
    Array<UserTracks>
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    const db = getFirestore();
    const enrolledTrackRef = collection(
      db,
      'users',
      user.uid,
      'enrolledTracks'
    );
    const q = query(enrolledTrackRef, orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (docs) => {
      const docsArr = docs.docs;
      const allUserTracksData = docsArr.map((doc) => {
        return { ...doc.data(), id: doc.id } as UserTracks;
      });
      setUserEnrolledTracks(allUserTracksData);
    });

    return unsub;
  }, []);

  return userEnrolledTracks;
}
