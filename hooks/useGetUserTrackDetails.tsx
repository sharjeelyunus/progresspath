import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { TrainingsInterface, UserType } from '../interfaces';
import useGetLeaderboardData from './useGetLeaderboard';

export default function useGetUserTrackDetails(
  trackId: string,
  userId: string
): TrainingsInterface {
  const [userTrackDetails, setUserTrackDetails] =
    useState<TrainingsInterface>();
  const leaderboardData = useGetLeaderboardData();

  useEffect(() => {
    const userRef = doc(db, 'trainings', trackId);
    const unsub = onSnapshot(userRef, (doc) => {
      const Tracks: TrainingsInterface = {
        ...doc.data(),
        id: doc.id,
      } as TrainingsInterface;

      leaderboardData.filter((user) => {
        if (user.authorId === userId) {
          Tracks.completedTasksByUser = user.completedTasks;
          Tracks.userPoints = user.points;
        }
      });

      getAuthorDetails(Tracks.author).then((authorDetails: UserType) => {
        Tracks.lead = authorDetails as UserType;
        setUserTrackDetails(Tracks);
      });
    });

    return unsub;
  }, [trackId, leaderboardData, userId]);

  return userTrackDetails;
}

const getAuthorDetails = async (authorId: string) => {
  const q = doc(db, 'users', authorId);

  const querySnapshot = await getDoc(q);
  const documentData = querySnapshot.data();

  return documentData as UserType;
};
