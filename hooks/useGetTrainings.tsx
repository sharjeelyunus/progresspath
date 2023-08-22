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
  const [authorDetails, setAuthorDetails] = useState<UserType>();

  const cacheKey = 'ProgressPath-tracks';

  useEffect(() => {
    const fetchAuthorDetails = async (authorId: string) => {
      if (!authorId) {
        return;
      }

      const q = doc(db, 'users', authorId);

      const querySnapshot = await getDoc(q);
      const documentData = querySnapshot.data();

      setAuthorDetails(documentData as UserType);
    };

    fetchAuthorDetails(trainings[0]?.mentors[0] || '');
  }, [trainings]);

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
      const allTrainingsData = docsArr.map((doc) => {
        return { ...doc.data(), id: doc.id } as TrainingsInterface;
      });
      
      setCache(cacheKey, allTrainingsData);

      setTrainings(allTrainingsData);
    });

    return unsub;
  }, []);

  return trainings.map((training) => ({
    ...training,
    leadName: authorDetails?.name || '',
    leadImage: authorDetails?.photoURL || '',
    leadUsername: authorDetails?.username || '',
  }));
}
