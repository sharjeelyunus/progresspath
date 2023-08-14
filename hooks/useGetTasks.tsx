import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TaskDetailsInterface, TaskInterface } from '../interfaces';
import useGetTargetTraining from './useGetTargetTraining';
import { db } from '../config/firebase';
import {
  getLocalStorageCache as getCache,
  setLocalStorageCache as setCache,
} from '../utils/cache';

export default function useGetAllTasks(
  slug: string,
  setLoading
): Array<TaskInterface> {
  const [tasks, setTasks] = useState<Array<TaskInterface>>([]);
  const targetTraining = useGetTargetTraining(slug);

  const cacheKey = `tasks-${slug}`;

  const fetchTasks = async () => {
    if (targetTraining && targetTraining.id) {
      const trainingsRef = collection(
        db,
        'trainings',
        targetTraining.id,
        'tasks'
      );
      const q = query(trainingsRef, orderBy('day', 'asc'));

      const unsub = onSnapshot(q, (docs) => {
        setLoading(true);
        const docsArr = docs.docs;
        const allTasksData = docsArr.map((doc) => {
          return { ...doc.data(), id: doc.id } as TaskInterface;
        });

        Promise.allSettled(
          allTasksData.map((task) => {
            return getTaskDetails(targetTraining.id, task.id).then(
              (taskDetails: TaskDetailsInterface[]) => {
                task.trackId = targetTraining.id;
                task.details = taskDetails;
              }
            );
          })
        ).then(() => {
          setTasks(allTasksData);
          setCache(cacheKey, allTasksData);
          setLoading(false);
        });
      });

      return () => unsub();
    }
  };

  useEffect(() => {
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      setTasks(cachedData as Array<TaskInterface>);
    } else {
      fetchTasks();
    }
  }, [targetTraining]);

  return tasks;
}

const getTaskDetails = async (trainingId: string, taskId: string) => {
  const detailsRef = collection(
    db,
    'trainings',
    trainingId,
    'tasks',
    taskId,
    'details'
  );
  const q = query(detailsRef, orderBy('index', 'asc'));

  const querySnapshot = await getDocs(q);
  const documentData = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id } as TaskDetailsInterface;
  });
  return documentData as Object;
};
