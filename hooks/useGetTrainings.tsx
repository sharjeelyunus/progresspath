import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '../config/firebase';
import { TrainingsInterface, UserType } from '../interfaces';
import {
  getMemoryCache as getCache,
  setMemoryCache as setCache,
} from '../utils/cache';
import { useRecoilState } from 'recoil';
import TrainingAtom from '../atoms/TrainingsAtom';

export default function useGetAllTrainings(): TrainingsInterface[] {
  const [trainings, setTrainings] =
    useRecoilState<TrainingsInterface[]>(TrainingAtom);
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

        const authorId = trainingData.mentors[0];
        if (authorId) {
          const authorDocRef = doc(db, 'users', authorId);
          const authorSnapshot = await getDoc(authorDocRef);
          const authorData = {
            ...authorSnapshot.data(),
            uid: authorSnapshot.id,
          } as UserType;

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
