import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CompletedTasks } from '../interfaces';
import useGetTargetTraining from './useGetTargetTraining';

export default function useGetCompletedTasks(
  trackId: string
): Array<CompletedTasks> {
  const [completedTasks, setCompletedTasks] = useState<Array<CompletedTasks>>(
    []
  );
  const { user } = useAuth();
  useEffect(() => {
    if (trackId) {
      const db = getFirestore();
      const enrolledTrackRef = collection(
        db,
        'users',
        user.uid,
        'enrolledTracks',
        trackId,
        'completedTasks'
      );
      const q = query(enrolledTrackRef, orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(q, (docs) => {
        const docsArr = docs.docs;
        const allUserTracksData = docsArr.map((doc) => {
          return { ...doc.data(), id: doc.id } as CompletedTasks;
        });
        setCompletedTasks(allUserTracksData);
      });

      return unsub;
    }
  }, [trackId]);

  return completedTasks;
}
