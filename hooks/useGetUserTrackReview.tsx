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

export default function useGetUserTrackReview(
  userId: string,
  trackId: string
): Review {
  const [review, setReview] = useState<any>(null);
  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'feedbacks'),
        where('userId', '==', userId),
        where('trackId', '==', trackId)
      ),
      (snapshot) => {
        const reviewData = snapshot.docs?.[0]?.data();
        if (reviewData) {
          setReview((prevReview) => ({
            ...prevReview,
            ...reviewData,
            id: snapshot.docs?.[0]?.id,
          }));
        }
      }
    );

    return unsub;
  }, [userId, trackId]);

  return review;
}
