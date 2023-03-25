import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { TrainingsInterface, UserType } from '../interfaces';
import useGetLeaderboardData from './useGetLeaderboard';
import { getAuthorDetails } from './useGetTrainings';

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
          Tracks.completedTasksByUser = user.totalCompletedTasks;
          Tracks.userPoints = user.points;
        }
      });

      getAuthorDetails(Tracks.author).then((authorDetails: UserType) => {
        Tracks.leadName = authorDetails?.name;
        Tracks.leadImage = authorDetails?.photoURL;
        Tracks.leadUsername = authorDetails?.username;
        setUserTrackDetails(Tracks);
      });
    });

    return unsub;
  }, [trackId, leaderboardData, userId]);

  return userTrackDetails;
}
