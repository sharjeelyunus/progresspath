import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../config/firebase';
import { UserTracks } from '../interfaces';
import {
  getMemoryCache as getCache,
  setMemoryCache as setCache,
} from '../utils/cache';

export default function useFetchTargetUserTracks(
  userId: string
): Array<UserTracks> {
  const [completedTasks, setCompletedTasks] = useState<Array<UserTracks>>([]);

  const cacheKey = `user-${userId}-tracks`;

  const handleSnapshot = useCallback((docs) => {
    const allUserTracksData = docs.docs.map((doc) => doc.data() as UserTracks);
    setCompletedTasks(allUserTracksData);
    setCache(cacheKey, allUserTracksData);
  }, []);

  const userTracksRef = useMemo(
    () => collection(db, 'users', userId, 'enrolledTracks'),
    [userId]
  );
  const userTracksQuery = useMemo(() => query(userTracksRef), [userTracksRef]);

  useEffect(() => {
    if (userId) {
      // Check if there is cached data and return it
      const cachedData = getCache(cacheKey);

      if (cachedData) {
        setCompletedTasks(cachedData as Array<UserTracks>);
        return;
      }

      const unsub = onSnapshot(userTracksQuery, handleSnapshot);
      return unsub;
    }
  }, [userId, userTracksQuery, handleSnapshot]);

  return completedTasks;
}
