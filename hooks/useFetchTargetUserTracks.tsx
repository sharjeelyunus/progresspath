import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { UserTracks } from '../interfaces';
import { useRecoilState } from 'recoil';
import UserTrackAtom from '../atoms/UserTracks';

export default function useFetchTargetUserTracks(
    userId: string,
): Array<UserTracks> {
  const [completedTasks, setCompletedTasks] = useRecoilState(UserTrackAtom);
  useEffect(() => {
    if (userId) {
      const q = query(collection(db, 'users', userId, 'enrolledTracks'));
      const unsub = onSnapshot(q, (docs) => {
        const docsArr = docs.docs;
        const allUserTracksData = docsArr.map((doc) => {
          return { ...doc.data(), id: doc.id } as UserTracks;
        });
        setCompletedTasks(allUserTracksData);
      });

      return unsub;
    }
  }, [userId]);

  return completedTasks;
}