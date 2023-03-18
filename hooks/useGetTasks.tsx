import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TaskDetailsInterface, TaskInterface } from '../interfaces';
import useGetTargetTraining from './useGetTargetTraining';

export default function useGetAllTasks(
  slug: string,
  setLoading: (loading) => void
): Array<TaskInterface> {
  const [tasks, setTasks] = useState<Array<TaskInterface>>([]);
  const targetTraining = useGetTargetTraining(slug);

  useEffect(() => {
    setLoading(true);
    if (targetTraining && targetTraining.id) {
      // add a check to ensure that targetTraining and its id are defined
      const db = getFirestore();

      const trainingsRef = collection(
        db,
        'trainings',
        targetTraining.id,
        'tasks'
      );
      const q = query(trainingsRef, orderBy('day', 'asc'));

      const unsub = onSnapshot(q, (docs) => {
        const docsArr = docs.docs;
        const allTasksData = docsArr.map((doc) => {
          return { ...doc.data(), id: doc.id } as TaskInterface;
        });

        Promise.all(
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
        });
      });
      setLoading(false);

      return unsub;
    }
  }, [targetTraining]);

  return tasks;
}

const getTaskDetails = async (tariningId: string, taskId: string) => {
  const db = getFirestore();
  const detailsRef = collection(
    db,
    'trainings',
    tariningId,
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
