import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TrainingsInterface } from '../interfaces';

export default function useGetAllTrainings(): Array<TrainingsInterface> {
  const [trainings, setTrainings] = useState<Array<TrainingsInterface>>([]);

  useEffect(() => {
    const db = getFirestore();

    const trainingsRef = collection(db, 'trainings');
    const q = query(trainingsRef, orderBy('index', 'desc'));

    const unsub = onSnapshot(q, (docs) => {
      var docsArr = docs.docs;
      var allTrainingsData = docsArr.map((doc) => {
        return { ...doc.data(), id: doc.id } as TrainingsInterface;
      });
      setTrainings(allTrainingsData);
    });

    return () => {
      unsub();
    };
  }, []);

  return trainings;
}
