import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { UserType } from '../interfaces';

export default function useFetchTargetUser(username: string): UserType {
  const [targetUserDetails, setTargetUserDetails] = useState<UserType>();

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'users'),
        where('username', '==', username ? username : '')
      ),
      async (docs) => {
        const userData: UserType = {
          ...docs.docs[0]?.data(),
          uid: docs.docs[0]?.id,
        } as UserType;
        setTargetUserDetails({ ...userData });
      }
    );

    return unsub;
  }, [username]);

  return targetUserDetails;
}
