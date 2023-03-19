import { doc, getFirestore, onSnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { UserType } from '../interfaces';

//this function will give you the latest information about a user. By defualt all values will be null.
export default function useGetTargetUser(userId: string): UserType {
  const [targetUser, setTargetUser] = useState<UserType>();

  useEffect(() => {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);
    const unsub = onSnapshot(userRef, (doc) => {
      const userData: UserType = {
        ...doc.data(),
        uid: doc.id,
      } as UserType;
      setTargetUser(userData);
    });

    return () => {
      unsub();
    };
  }, [userId]);

  return targetUser;
}
