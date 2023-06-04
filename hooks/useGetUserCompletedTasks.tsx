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
import { CompletedTasks, TrainingsInterface, UserType } from '../interfaces';

export default function useGetUserCompletedTasks(
  trackId: string,
  userId: string
): TrainingsInterface {
  const [userTrackDetails, setUserTrackDetails] =
    useState<TrainingsInterface>();
  const [cachedData, setCachedData] = useState<TrainingsInterface>();

  useEffect(() => {
    const trainingsRef = collection(
      db,
      'users',
      userId,
      'enrolledTracks',
      trackId,
      'completedTasks'
    );
    const q = query(trainingsRef, orderBy('timestamp', 'desc'));

    // Check if there is cached data and return it
    if (cachedData) {
      setUserTrackDetails(cachedData);
      return;
    }

    const unsub = onSnapshot(q, async (docs) => {
      const docsArr = docs.docs;
      const userCompletedTasks = docsArr.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          } as CompletedTasks)
      );

      const userTrackDetails = await getTrackDetails(trackId);

      let userPoints = 0;

      for (const task of userCompletedTasks) {
        if (task.points) {
          userPoints += task.points;
        } else {
          userPoints += 5; // Add 5 points for each completed task

          if (task.codeLink && isValidUrl(task.codeLink)) {
            userPoints += 5; // Add 5 points for valid codeLink
          }
          if (task.liveLink && isValidUrl(task.liveLink)) {
            userPoints += 5; // Add 5 points for valid liveLink
          }
          if (task.postLink && isValidUrl(task.postLink)) {
            userPoints += 5; // Add 5 points for valid postLink
          }
        }
      }

      const allTrainingsData: TrainingsInterface = {
        ...userTrackDetails,
        lead: await getAuthorDetails(userTrackDetails.author),
        completedTasksByUser: userCompletedTasks,
        userPoints,
      };

      // Cache the data
      setCachedData(allTrainingsData);

      setUserTrackDetails(allTrainingsData);
    });

    return unsub;
  }, [cachedData]);

  return { ...userTrackDetails };
}

const getAuthorDetails = async (authorId: string): Promise<UserType> => {
  const q = doc(db, 'users', authorId);
  const querySnapshot = await getDoc(q);
  return querySnapshot.data() as UserType;
};

const getTrackDetails = async (
  trackId: string
): Promise<TrainingsInterface> => {
  const q = doc(db, 'trainings', trackId);
  const querySnapshot = await getDoc(q);
  return querySnapshot.data() as TrainingsInterface;
};

function isValidUrl(url: string): boolean {
  const urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return urlPattern.test(url);
}
