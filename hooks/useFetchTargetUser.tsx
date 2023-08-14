import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { UserType } from '../interfaces';
import {
  getLocalStorageCache as getCache,
  setLocalStorageCache as setCache,
} from '../utils/cache';

export default function useFetchTargetUser(username: string): UserType {
  const [targetUserDetails, setTargetUserDetails] = useState<UserType>({
    username: '',
    email: '',
    uid: '',
    photoURL: '',
    bio: '',
    name: '',
  });

  useEffect(() => {
    const cacheKey = `user-${username}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setTargetUserDetails(cachedData as UserType);
      return;
    }

    const unsub = onSnapshot(
      query(collection(db, 'users'), where('username', '==', username || '')),
      (snapshot) => {
        const userData = snapshot.docs?.[0]?.data();
        if (userData) {
          setTargetUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            ...userData,
            uid: snapshot.docs?.[0]?.id,
          }));
          setCache(cacheKey, userData);
        }
      }
    );

    return unsub;
  }, [username]);

  return targetUserDetails;
}
