import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { TrainingsInterface, UserType } from '../interfaces';

export default function useGetAllTrainings(): Array<TrainingsInterface> {
  const [trainings, setTrainings] = useState<Array<TrainingsInterface>>([]);

  useEffect(() => {
    const trainingsRef = collection(db, 'trainings');
    const q = query(trainingsRef, orderBy('index', 'asc'));

    const unsub = onSnapshot(q, (docs) => {
      const docsArr = docs.docs;
      const allTrainingsData = docsArr.map((doc) => {
        return { ...doc.data(), id: doc.id } as TrainingsInterface;
      });

      getAuthorDetails(allTrainingsData[0].author).then(
        (authorDetails: UserType) => {
          allTrainingsData[0].leadName = authorDetails?.name;
          allTrainingsData[0].leadImage = authorDetails?.photoURL;
          allTrainingsData[0].leadUsername = authorDetails?.username;
          setTrainings(allTrainingsData);
        }
      );
    });

    return unsub;
  }, []);

  return trainings;
}

export const getAuthorDetails = async (authorId: string) => {
  const db = getFirestore();
  const q = doc(db, 'users', authorId);

  const querySnapshot = await getDoc(q);
  const documentData = querySnapshot.data();

  return documentData as Object;
};
