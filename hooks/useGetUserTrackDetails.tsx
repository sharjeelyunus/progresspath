import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
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

  const memoizedGetAuthorDetails = useMemo(() => getAuthorDetails, []);

  useEffect(() => {
    const userRef = doc(db, 'trainings', trackId);
    const unsub = onSnapshot(userRef, (doc) => {
      const Tracks: TrainingsInterface = {
        ...doc.data(),
        id: doc.id,
      } as TrainingsInterface;

      leaderboardData.forEach((user) => {
        if (user.authorId === userId) {
          Tracks.completedTasksByUser = user.completedTasks.slice();
          Tracks.userPoints = user.points;
        }
      });

      setUserTrackDetails(Tracks);

      memoizedGetAuthorDetails(Tracks.author).then(
        (authorDetails: UserType | null) => {
          Tracks.leadName = authorDetails?.name;
          Tracks.leadImage = authorDetails?.photoURL;
          Tracks.leadUsername = authorDetails?.username;
          Tracks.leadId = authorDetails?.uid;
          setUserTrackDetails(Tracks);
        }
      );
    });

    return unsub;
  }, [trackId, userId, leaderboardData, memoizedGetAuthorDetails]);

  return userTrackDetails;
}
