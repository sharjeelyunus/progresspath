import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserTracks } from '../interfaces';
import { db } from '../config/firebase';
import {
  getSessionStorageCache as getCache,
  setSessionStorageCache as setCache,
} from '../utils/cache';

export default function useGetUserTracks(): Array<UserTracks> {
  const { user } = useAuth();

  const [userEnrolledTracks, setUserEnrolledTracks] = useState<
    Array<UserTracks>
  >([]);

  const cacheKey = `ProgressPath-userEnrolledTracks-${user.uid}`;

  useEffect(() => {
    // Check if there is cached data and return it
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setUserEnrolledTracks(cachedData as Array<UserTracks>);
      return;
    }

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
      setCache(cacheKey, allUserTracksData);
    });

    return unsub;
  }, [db, user.uid]);

  const cachedUserEnrolledTracks = useMemo(() => {
    return userEnrolledTracks;
  }, [userEnrolledTracks]);

  return cachedUserEnrolledTracks;
}
