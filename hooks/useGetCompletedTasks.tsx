import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CompletedTasks } from '../interfaces';
import { db } from '../config/firebase';
import {
  getMemoryCache as getCache,
  setMemoryCache as setCache,
} from '../utils/cache';

export default function useGetCompletedTasks(
  trackId: string
): Array<CompletedTasks> {
  const [completedTasks, setCompletedTasks] = useState<Array<CompletedTasks>>(
    []
  );
  const { user } = useAuth();

  const cacheKey = `user-${user.uid}-tracks-${trackId}`;

  useEffect(() => {
    // Check if there is cached data and return it
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setCompletedTasks(cachedData as Array<CompletedTasks>);
      return;
    }

    if (trackId) {
      const enrolledTrackRef = collection(
        db,
        'users',
        user.uid,
        'enrolledTracks',
        trackId,
        'completedTasks'
      );
      const q = query(enrolledTrackRef, orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(q, {
        next: (docs) => {
          const docsArr = docs.docs;
          const allUserTracksData = docsArr.map((doc) => {
            return { ...doc.data(), id: doc.id } as CompletedTasks;
          });
          setCompletedTasks(allUserTracksData);
          setCache(cacheKey, allUserTracksData);
        },
        error: (error) => {
          console.error(error);
        },
      });

      return unsub;
    }
  }, [trackId]);

  return completedTasks;
}
