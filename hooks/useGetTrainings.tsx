import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../config/firebase';
import { TrainingsInterface, UserType } from '../interfaces';

export default function useGetAllTrainings(): TrainingsInterface[] {
  const [trainings, setTrainings] = useState<TrainingsInterface[]>([]);

  useEffect(() => {
    const trainingsRef = collection(db, 'trainings');
    const q = query(trainingsRef, orderBy('index', 'asc'));

    const unsub = onSnapshot(q, (snapshot) => {
      const allTrainingsData: TrainingsInterface[] = snapshot.docs.map(
        (doc) => {
          const trainingData = doc.data() as TrainingsInterface;
          return { ...trainingData, id: doc.id };
        }
      );

      if (allTrainingsData.length > 0 && allTrainingsData[0].author) {
        getAuthorDetails(allTrainingsData[0].author).then((authorDetails) => {
          allTrainingsData[0].leadName = authorDetails?.name;
          allTrainingsData[0].leadImage = authorDetails?.photoURL;
          allTrainingsData[0].leadUsername = authorDetails?.username;
          setTrainings(allTrainingsData);
        });
      } else {
        setTrainings(allTrainingsData);
      }
    });

    return unsub;
  }, []);

  const memoizedTrainings = useMemo(() => trainings, [trainings]);

  return memoizedTrainings;
}

export const getAuthorDetails = async (
  authorId: string
): Promise<UserType | null> => {
  const q = doc(db, 'users', authorId);
  const querySnapshot = await getDoc(q);
  const documentData = querySnapshot.data();
  return documentData as UserType | null;
};
