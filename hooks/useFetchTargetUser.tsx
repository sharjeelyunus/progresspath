import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { UserType } from '../interfaces';

export default function useFetchTargetUser(username: string): UserType {
  const [targetUserDetails, setTargetUserDetails] = useState<UserType>(() => {
    return {
      username: '',
      email: '',
      uid: '',
      photoURL: '',
      bio: '',
      name: '',
    };
  });

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'users'), where('username', '==', username || '')),
      async (snapshot) => {
        try {
          const [userData] = snapshot.docs?.map((doc) => ({
            ...doc?.data(),
            uid: doc?.id,
          }));
          setTargetUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            ...userData,
          }));
        } catch (error) {
          console.error(error);
        }
      }
    );

    return unsub;
  }, [username]);

  return targetUserDetails;
}
