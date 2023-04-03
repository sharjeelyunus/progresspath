import { doc, getDoc } from 'firebase/firestore';
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
  const [authorDetails, setAuthorDetails] = useState<UserType>();
  const leaderboardData = useGetLeaderboardData();

  useEffect(() => {
    const trackRef = doc(db, 'trainings', trackId);
    const authorRef = doc(db, 'users', userId);

    Promise.all([
      getDoc(trackRef),
      getDoc(authorRef).then((doc) => doc.data() as UserType),
    ]).then(([trackDoc, authorData]) => {
      const Tracks: TrainingsInterface = {
        ...trackDoc.data(),
        id: trackDoc.id,
      } as TrainingsInterface;

      leaderboardData.forEach((user) => {
        if (user.authorId === userId) {
          Tracks.completedTasksByUser = user.completedTasks;
          Tracks.userPoints = user.points;
        }
      });

      setAuthorDetails(authorData);
      setUserTrackDetails((prevState) => ({
        ...prevState,
        ...Tracks,
        leadName: authorData?.name,
        leadImage: authorData?.photoURL,
        leadUsername: authorData?.username,
        leadId: authorData?.uid,
      }));
    });
  }, [trackId, userId, leaderboardData]);

  return userTrackDetails;
}
