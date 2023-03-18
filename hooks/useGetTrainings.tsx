import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TrainingsInterface, UserType } from '../interfaces';

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

      getAuthorDetails(allTrainingsData[0].author).then(
        (authorDetails: UserType) => {
          allTrainingsData[0].leadName = authorDetails?.name;
          allTrainingsData[0].leadImage = authorDetails?.photoURL;
          setTrainings(allTrainingsData);
        }
      );
    });

    return () => {
      unsub();
    };
  }, []);

  return trainings;
}

const getAuthorDetails = async (authorId: string) => {
  const db = getFirestore();
  const q = doc(db, 'users', authorId);

  const querySnapshot = await getDoc(q);
  const documentData = querySnapshot.data();

  return documentData as Object;
};
