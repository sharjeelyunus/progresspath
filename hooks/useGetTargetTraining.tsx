import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TrainingsInterface } from '../interfaces';

export default function useGetTargetTraining(slug: string): TrainingsInterface {
  const [targetTrainingDetails, setTargetTrainingDetails] =
    useState<TrainingsInterface>();

  useEffect(() => {
    const db = getFirestore();

    if (slug) {
      // add a check to ensure that slug is defined
      const unsub = onSnapshot(
        query(collection(db, 'trainings'), where('slug', '==', slug)),
        (docs) => {
          const TrainingData: TrainingsInterface = {
            ...docs.docs[0].data(),
            id: docs.docs[0].id,
          } as TrainingsInterface;
          setTargetTrainingDetails(TrainingData);
        }
      );

      return unsub;
    }
  }, [slug]);

  return targetTrainingDetails;
}
