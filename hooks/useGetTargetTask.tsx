import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { TaskInterface } from '../interfaces';

export default function useGetTargetTask(
  trackId: string,
  taskId: string
): TaskInterface {
  const [targetUser, setTargetUser] = useState<TaskInterface>();

  useEffect(() => {
    const userRef = doc(db, 'trainings', trackId, 'tasks', taskId);
    const unsub = onSnapshot(userRef, (doc) => {
      const userData: TaskInterface = {
        ...doc.data(),
        id: doc.id,
      } as TaskInterface;
      setTargetUser(userData);
    });

    return () => {
      unsub();
    };
  }, [trackId, taskId]);

  return targetUser;
}
