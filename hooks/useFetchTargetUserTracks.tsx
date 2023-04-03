import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { UserTracks } from '../interfaces';

export default function useFetchTargetUserTracks(
  userId: string
): Array<UserTracks> {
  const [completedTasks, setCompletedTasks] = useState<Array<UserTracks>>([]);

  const handleSnapshot = useCallback((docs) => {
    const allUserTracksData = docs.docs.map((doc) => doc.data() as UserTracks);
    setCompletedTasks(allUserTracksData);
  }, []);

  useEffect(() => {
    if (userId) {
      const q = query(collection(db, 'users', userId, 'enrolledTracks'));
      const unsub = onSnapshot(q, handleSnapshot);

      return unsub;
    }
  }, [userId, handleSnapshot]);

  return completedTasks;
}
