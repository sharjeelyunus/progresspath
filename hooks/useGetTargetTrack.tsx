import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TrainingsInterface, UserType } from '../interfaces';
import { db } from '../config/firebase';

export default function useGetTargetTrack(
  trackId: string
): TrainingsInterface | undefined {
  const [targetTrainingDetails, setTargetTrainingDetails] =
    useState<TrainingsInterface>();

  useEffect(() => {
    if (!trackId) {
      return;
    }

    const trainingRef = doc(db, 'trainings', trackId);
    const unsubscribe = onSnapshot(trainingRef, async (doc) => {
      const trackData: TrainingsInterface = {
        ...doc.data(),
        id: doc.id,
      } as TrainingsInterface;

      const authorDetails = await getAuthorDetails(trackData.author);

      const trainingData: TrainingsInterface = {
        name: trackData.name,
        author: trackData.author,
        id: trackData.id,
        slug: trackData.slug,
        image: trackData.image,
        index: trackData.index,
        lead: authorDetails as UserType,
      };

      setTargetTrainingDetails(trainingData);
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
