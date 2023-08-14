import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { Review } from '../interfaces';
import {
  getSessionStorageCache as getCache,
  setSessionStorageCache as setCache,
} from '../utils/cache';

export default function useGetUserTrackReview(
  userId: string,
  trackId: string
): Review {
  const [review, setReview] = useState<Review>(null);

  const cacheKey = `ProgressPath-review-${userId}-${trackId}`;

  useEffect(() => {
    // Check if there is cached data and return it
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setReview(cachedData as Review);
      return;
    }

    const unsub = onSnapshot(
      query(
        collection(db, 'feedbacks'),
        where('userId', '==', userId),
        where('trackId', '==', trackId)
      ),
      (snapshot) => {
        const reviewData = snapshot.docs?.[0]?.data();
        if (reviewData) {
          setReview(
            (prevReview) =>
              ({
                ...prevReview,
                ...reviewData,
                id: snapshot.docs?.[0]?.id,
              } as Review)
          );
          setCache(cacheKey, reviewData);
        }
      }
    );

    return unsub;
  }, [userId, trackId]);

  return review;
}
