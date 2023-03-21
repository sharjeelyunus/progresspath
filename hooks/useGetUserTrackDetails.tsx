import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { TrainingsInterface, UserType } from '../interfaces';
import useGetLeaderboardData from './useGetLeaderboard';
import { getAuthorDetails } from './useGetTrainings';

export default function useGetUserTrackDetails(
  trackId: string
): TrainingsInterface {
  const [targetUser, setTargetUser] = useState<TrainingsInterface>();
  const leaderboardData = useGetLeaderboardData();

  useEffect(() => {
    const db = getFirestore();
    const userRef = doc(db, 'trainings', trackId);
    const unsub = onSnapshot(userRef, (doc) => {
      const Tracks: TrainingsInterface = {
        ...doc.data(),
        id: doc.id,
      } as TrainingsInterface;

      leaderboardData.filter((user) => {
        if (user.authorId === Tracks.author) {
          Tracks.completedTasksByUser = user.completedTasks;
          Tracks.userPoints = user.points;
        }
      });

      getAuthorDetails(Tracks.author).then((authorDetails: UserType) => {
        Tracks.leadName = authorDetails?.name;
        Tracks.leadImage = authorDetails?.photoURL;
        setTargetUser(Tracks);
      });
    });

    return unsub;
  }, [trackId]);

  return targetUser;
}
