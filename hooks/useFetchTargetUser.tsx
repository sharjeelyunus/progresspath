import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { UserType } from '../interfaces';

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
        }
      }
    );

    return unsub;
  }, [username]);

  return targetUserDetails;
}
