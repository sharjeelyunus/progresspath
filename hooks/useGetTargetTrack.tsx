import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TrainingsInterface, UserType } from '../interfaces';
import { db } from '../config/firebase';
import {
  getLocalStorageCache as getCache,
  setLocalStorageCache as setCache,
} from '../utils/cache';

export default function useGetTargetTrack(
  trackId: string
): TrainingsInterface | undefined {
  const [targetTrainingDetails, setTargetTrainingDetails] =
    useState<TrainingsInterface>();

  const cacheKey = `ProgressPath-track-${trackId}`;

  useEffect(() => {
    if (!trackId) {
      return;
    }

    // Check if there is cached data and return it
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setTargetTrainingDetails(cachedData as TrainingsInterface);
      return;
    }

    const trainingRef = doc(db, 'trainings', trackId);
    const unsubscribe = onSnapshot(trainingRef, async (doc) => {
      const trackData: TrainingsInterface = {
        ...doc.data(),
        id: doc.id,
      } as TrainingsInterface;

      const authorDetails = await getAuthorDetails(trackData.mentors[0]);

      const trainingData: TrainingsInterface = {
        name: trackData.name,
        mentors: trackData.mentors,
        id: trackData.id,
        slug: trackData.slug,
        image: trackData.image,
        index: trackData.index,
        lead: authorDetails as UserType,
      };

      setTargetTrainingDetails(trainingData);
      setCache(cacheKey, trainingData);
    });

    return () => unsubscribe();
  }, [trackId]);

  return targetTrainingDetails;
}

const getAuthorDetails = async (authorId: string): Promise<UserType> => {
  const q = doc(db, 'users', authorId);
  const querySnapshot = await getDoc(q);
  return querySnapshot.data() as UserType;
};
