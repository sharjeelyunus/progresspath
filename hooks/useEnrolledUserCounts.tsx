import { useEffect, useState, useMemo } from 'react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  getSessionStorageCache as getCache,
  setSessionStorageCache as setCache,
} from '../utils/cache';

const useEnrolledUserCounts = () => {
  const [enrolledUserCounts, setEnrolledUserCounts] = useState({});

  const cacheKey = useMemo(() => 'enrolledUserCounts', []);

  const fetchEnrolledUserCounts = async () => {
    const counts = {};
    const q = collectionGroup(db, 'enrolledTracks');
    const querySnapshot = await getDocs(q);

    querySnapshot.docs.forEach((doc) => {
      const trackId = doc.data().trackId;
      if (counts[trackId]) {
        counts[trackId] += 1;
      } else {
        counts[trackId] = 1;
      }
    });

    setEnrolledUserCounts(counts);
    setCache(cacheKey, counts);
  };

  useEffect(() => {
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      setEnrolledUserCounts(cachedData);
    } else {
      fetchEnrolledUserCounts();
    }
  }, []);

  return useMemo(() => enrolledUserCounts, [enrolledUserCounts]);
};

export default useEnrolledUserCounts;
