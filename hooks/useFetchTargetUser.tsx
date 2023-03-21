import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { TargetUser, UserTracks, UserType } from '../interfaces';

//this function will give you the latest information about a user. By defualt all values will be null.
export default function useFetchTargetUser(username: string): TargetUser {
  const [targetUserDetails, setTargetUserDetails] = useState<TargetUser>();

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
        const targetUserTracks = await getTargetUserTracks(userData.uid);
        setTargetUserDetails({ ...userData, tracks: targetUserTracks });
      }
    );

    return unsub;
  }, [username]);

  return targetUserDetails;
}

const getTargetUserTracks = async (uid: string): Promise<UserTracks[]> => {
  const q = query(collection(db, 'users', uid, 'enrolledTracks'));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    trackId: doc.data().trackId,
    timestamp: doc.data().timestamp,
  }));
  return data;
};
