import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TrainingsInterface } from '../interfaces';
import { db } from '../config/firebase';
import {
  getLocalStorageCache as getCache,
  setLocalStorageCache as setCache,
} from '../utils/cache';

export default function useGetTargetTraining(
  slug: string
): TrainingsInterface | undefined {
  const [targetTrainingDetails, setTargetTrainingDetails] =
    useState<TrainingsInterface>();

  const cacheKey = `ProgressPath-training-${slug}`;

  useEffect(() => {
    if (!slug) {
      return; // Early return if slug is undefined
    }

    // Check if there is cached data and return it
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setTargetTrainingDetails(cachedData as TrainingsInterface);
      return;
    }

    const trainingRef = collection(db, 'trainings');
    const q = query(trainingRef, where('slug', '==', slug));

    getDocs(q).then((docs) => {
      if (docs.size === 0) {
        return; // Early return if there are no matching documents
      }

      const TrainingData: TrainingsInterface = {
        ...docs.docs[0].data(),
        id: docs.docs[0].id,
      } as TrainingsInterface;

      setTargetTrainingDetails(TrainingData);
      setCache(cacheKey, TrainingData);
    });
  }, [slug]);

  return targetTrainingDetails;
}
