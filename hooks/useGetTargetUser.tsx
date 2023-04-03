import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { UserType } from '../interfaces';
import { db } from '../config/firebase';

export default function useGetTargetUser(userId: string): UserType {
  const [targetUser, setTargetUser] = useState<UserType>();

  useEffect(() => {
    const userRef = doc(db, 'users', userId);
    const unsub = onSnapshot(userRef, (doc) => {
      const userData = { ...doc.data(), uid: doc.id } as UserType;
      setTargetUser(userData);
    });

    return () => unsub();
  }, [userId]);

  return targetUser;
}
