import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { TargetUser, UserTracks, UserType } from '../../interfaces';

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

export default async (req, res) => {
  const userRef = collection(db, 'users');
  const userSnapshot = await getDocs(userRef);
  const users = userSnapshot.docs.map(async (doc) => {
    const userData = doc.data() as UserType;
    const tracks = await getTargetUserTracks(doc.id);
    const user = {
      id: doc.id,
      ...userData,
      tracks,
    } as TargetUser;
    return user;
  });
  const result = await Promise.all(users);

  res.status(200).json(result);
};
