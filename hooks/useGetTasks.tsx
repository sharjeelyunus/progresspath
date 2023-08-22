import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import {
  TaskDetailsInterface,
  TaskInterface,
  TrainingsInterface,
} from '../interfaces';
import useGetTargetTraining from './useGetTargetTraining';
import { db } from '../config/firebase';

export default function useGetAllTasks(
  slug: string,
  setLoading: (value: boolean) => void
): {
  tasks: Array<TaskInterface>;
  track: TrainingsInterface | undefined;
} {
  const [tasks, setTasks] = useState<Array<TaskInterface>>([]);
  const targetTraining = useGetTargetTraining(slug);

  const fetchTasks = useMemo(async () => {
    if (targetTraining && targetTraining.id) {
      const trainingsRef = collection(
        db,
        'trainings',
        targetTraining.id,
        'tasks'
      );
      const q = query(trainingsRef, orderBy('day', 'asc'));

      const unsub = onSnapshot(q, async (docs) => {
        setLoading(true);
        const docsArr = docs.docs;
        const allTasksData = docsArr.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as TaskInterface)
        );

        const taskPromises = allTasksData.map(async (task) => {
          const taskDetails = await getTaskDetails(targetTraining.id, task.id);
          task.trackId = targetTraining.id;
          task.details = taskDetails;
          return task;
        });

        const updatedTasks = await Promise.all(taskPromises);
        setTasks(updatedTasks);
        setLoading(false);
      });

      return () => unsub();
    }
  }, [targetTraining, setLoading]);

  useEffect(() => {
    fetchTasks;
  }, [fetchTasks]);

  return { tasks, track: targetTraining };
}

const getTaskDetails = async (
  trainingId: string,
  taskId: string
): Promise<TaskDetailsInterface[]> => {
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
  const documentData = querySnapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      } as TaskDetailsInterface)
  );
  return documentData;
};
