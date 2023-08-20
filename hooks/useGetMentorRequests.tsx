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
import { MentorRequests } from '../interfaces';
import {
  getMemoryCache as getCache,
  setMemoryCache as setCache,
} from '../utils/cache';

export default function useGetMentorRequests(): MentorRequests[] {
  const [mentorRequests, setMentorRequests] = useState<MentorRequests[]>([]);

  const cacheKey = 'mentorRequests';

  useEffect(() => {
    const mentorRequestsRef = collection(db, 'mentorRequests');
    const q = query(mentorRequestsRef, orderBy('timestamp', 'desc'));

    // Check if there is cached data and return it
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setMentorRequests(cachedData as MentorRequests[]);
      return;
    }

    const unsub = onSnapshot(q, (docs) => {
      const docsArr = docs.docs;
      const allMentorRequests = docsArr.map((doc) => {
        return { ...doc.data(), id: doc.id } as MentorRequests;
      });

      // Cache the data
      setCache(cacheKey, allMentorRequests);
      setMentorRequests(allMentorRequests);
    });

    return unsub;
  }, []);

  return mentorRequests;
}
