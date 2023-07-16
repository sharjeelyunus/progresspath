import { useEffect, useState, useMemo } from 'react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserTracks } from '../interfaces';

const getEnrolledUserCount = async (trackId) => {
  const q = collectionGroup(db, 'enrolledTracks');
  const querySnapshot = await getDocs(q);
  const enrolledUserCount = querySnapshot.docs.filter(
    (doc) => doc.data().trackId === trackId
  ).length;
  return enrolledUserCount;
};

const useEnrolledUserCounts = (userEnrolledTracks: UserTracks[]) => {
  const [enrolledUserCounts, setEnrolledUserCounts] = useState({});

  useEffect(() => {
    const fetchEnrolledUserCounts = async () => {
      const counts = {};
      const enrolledTrackIds: string[] = Array.from(
        userEnrolledTracks,
        (track) => track.id
      );
      for (const trackId of enrolledTrackIds) {
        const count = await getEnrolledUserCount(trackId);
        counts[trackId] = count;
      }
      setEnrolledUserCounts(counts);
    };

    fetchEnrolledUserCounts();
  }, [userEnrolledTracks]);

  return useMemo(() => enrolledUserCounts, [enrolledUserCounts]);
};

export default useEnrolledUserCounts;
