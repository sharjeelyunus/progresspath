import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { TrainingsInterface, UserType } from '../interfaces';
import {
  getMemoryCache as getCache,
  setMemoryCache as setCache,
} from '../utils/cache';

export default function useGetAllTrainings(): TrainingsInterface[] {
  const [trainings, setTrainings] = useState<TrainingsInterface[]>([]);
  const cacheKey = 'ProgressPath-tracks';

  useEffect(() => {
    const trainingsRef = collection(db, 'trainings');
    const q = query(trainingsRef, orderBy('index', 'asc'));

    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setTrainings(cachedData as TrainingsInterface[]);
      return;
    }

    const unsub = onSnapshot(q, (docs) => {
      const docsArr = docs.docs;
      const allTrainingsData = docsArr.map(async (document) => {
        const trainingData = {
          ...document.data(),
          id: document.id,
        } as TrainingsInterface;

        // Fetch author details for each training
        const authorId = trainingData.mentors[0]; // Assuming mentors is an array of author IDs
        if (authorId) {
          const authorDocRef = doc(db, 'users', authorId); // Use doc function from firestore package
          const authorSnapshot = await getDoc(authorDocRef);
          const authorData = {
            ...authorSnapshot.data(),
            uid: authorSnapshot.id,
          } as UserType;

          // Update the training data with author details
          trainingData.lead = authorData;
        }

        return trainingData;
      });

      Promise.all(allTrainingsData).then((completedTrainings) => {
        setCache(cacheKey, completedTrainings);
        setTrainings(completedTrainings);
      });
    });

    return unsub;
  }, []);

  return trainings;
}
