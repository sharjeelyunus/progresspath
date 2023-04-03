import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { TaskInterface } from '../interfaces';

export default function useGetTargetTask(
  trackId: string,
  taskId: string
): TaskInterface | undefined {
  const [targetTask, setTargetTask] = useState<TaskInterface>();

  useEffect(() => {
    if (trackId && taskId) {
      const taskRef = doc(db, 'trainings', trackId, 'tasks', taskId);
      const unsubscribe = onSnapshot(taskRef, (doc) => {
        const taskData: TaskInterface = {
          ...doc.data(),
          id: doc.id,
        } as TaskInterface;
        setTargetTask(taskData);
      });

      return unsubscribe;
    }
  }, [trackId, taskId]);

  return targetTask;
}
