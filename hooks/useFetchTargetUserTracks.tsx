import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../config/firebase';
import { UserTracks } from '../interfaces';

export default function useFetchTargetUserTracks(
  userId: string
): Array<UserTracks> {
  const [completedTasksCache, setCompletedTasksCache] = useState<
    Array<UserTracks>
  >([]);
  const [completedTasks, setCompletedTasks] = useState<Array<UserTracks>>([]);

  const handleSnapshot = useCallback((docs) => {
    const allUserTracksData = docs.docs.map((doc) => doc.data() as UserTracks);
    setCompletedTasksCache(allUserTracksData);
  }, []);

  const userTracksRef = useMemo(
    () => collection(db, 'users', userId, 'enrolledTracks'),
    [userId]
  );
  const userTracksQuery = useMemo(() => query(userTracksRef), [userTracksRef]);

  useEffect(() => {
    if (userId) {
      const unsub = onSnapshot(userTracksQuery, handleSnapshot);

      return unsub;
    }
  }, [userId, userTracksQuery, handleSnapshot]);

  useEffect(() => {
    setCompletedTasks(completedTasksCache);
  }, [completedTasksCache]);

  return completedTasks;
}
