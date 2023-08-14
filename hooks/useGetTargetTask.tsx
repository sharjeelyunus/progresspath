import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { TaskInterface } from '../interfaces';
import {
  getMemoryCache as getCache,
  setMemoryCache as setCache,
} from '../utils/cache';

export default function useGetTargetTask(
  trackId: string,
  taskId: string
): TaskInterface | undefined {
  const [targetTask, setTargetTask] = useState<TaskInterface>();

  const cacheKey = `${trackId}-${taskId}`;

  useEffect(() => {
    if (trackId && taskId) {
      const taskRef = doc(db, 'trainings', trackId, 'tasks', taskId);

      // Check if there is cached data and return it
      const cachedData = getCache(cacheKey);

      if (cachedData) {
        setTargetTask(cachedData as TaskInterface);
        return;
      }

      const unsubscribe = onSnapshot(taskRef, (doc) => {
        const taskData: TaskInterface = {
          ...doc.data(),
          id: doc.id,
        } as TaskInterface;
        setTargetTask(taskData);
        setCache(cacheKey, taskData);
      });

      return unsubscribe;
    }
  }, [trackId, taskId]);

  return targetTask;
}
