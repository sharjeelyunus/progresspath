import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Loading from '../src/shared/components/Loading';

const OnboardingModal = () => {
  const { loggedInUser, user } = useAuth();
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    if (loggedInUser) {
      setName(loggedInUser.name ? loggedInUser.name : user.name);
      setUsername(loggedInUser.username);
      setBio(loggedInUser.bio);
      setOrganization(loggedInUser.organization);
      setLocation(loggedInUser.location);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser && loggedInUser.onboarding) {
      router.push('/');
    }
  }, [loggedInUser]);

  const updateUser = async (e: any) => {
    e?.preventDefault();
    const userRef = doc(db, 'users', loggedInUser?.uid);
    await setDoc(
      userRef,
      {
        uid: loggedInUser?.uid,
        name: name,
        username: username,
        email: user?.email,
        photoURL: user?.photoURL,
        bio: bio,
        organization: organization,
        location: location,
        onboarding: true,
      },
      { merge: true }
    );
  };

  const handleOnboarding = async (e: any) => {
    e?.preventDefault();
    // check empty values
    if (!name || !username || !bio || !location || !organization) {
      toast.error('Please fill all the fields');
      return;
    } else {
      // check for whitespace in username
      if (username.includes(' ')) {
        toast.error('Username should not contain spaces');
        return;
      }
      // check minimum length of username
      if (username.length < 8) {
        toast.error('Username must be at least 8 characters long');
        return;
      }

      // check if username exists
      const userRef = collection(db, 'users');
      const q = query(
        userRef,
        where('username', '==', username ? username : '')
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0 && loggedInUser?.username !== username) {
        toast.error('Username already exists');
        return;
      }
    }

    // update user
    await updateUser(e);

    // redirect to home
    router.push('/');
    window.location.reload();
  };

  if (!loggedInUser || !user) {
    return <Loading />;
  }

  return (
    <div className='fixed inset-0 bg-gray-700 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className='bg-gray-800 mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl'>
        <div className='flex flex-col w-[350px] lg:w-[500px] justify-center items-center py-6 lg:px-8 px-4'>
          <div>
            <h2 className='text-center text-white font-bold text-lg lg:text-2xl'>
              Onboarding
            </h2>
          </div>
          <div>
            <form
              onSubmit={(e) => handleOnboarding(e)}
              className='flex flex-col gap-3 mt-5'
            >
              <div>
                <img
                  src={
                    loggedInUser?.photoURL
                      ? loggedInUser?.photoURL
                      : user.photoURL
                  }
                  alt=''
                  className='w-20 h-20 rounded-2xl'
                />
              </div>
              <input
                type='text'
                placeholder='Name'
                value={name}
                className='border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-[300px] sm:text-sm'
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type='text'
                placeholder='Username'
                value={username}
                className='border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-[300px] sm:text-sm'
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type='text'
                placeholder='Bio / Tagline'
                value={bio}
                className='border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-[300px] sm:text-sm'
                onChange={(e) => setBio(e.target.value)}
              />
              <input
                type='text'
                placeholder='Company / University / Community'
                value={organization}
                className='border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-[300px] sm:text-sm'
                onChange={(e) => setOrganization(e.target.value)}
              />
              <input
                type='text'
                placeholder='Location (City, Country)'
                value={location}
                className='border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-[300px] sm:text-sm'
                onChange={(e) => setLocation(e.target.value)}
              />
            </form>
            <div className='mt-10 flex justify-end w-full'>
              <button
                className='rounded-full text-white bg-[#393053] py-1 w-[100px]'
                type='submit'
                onClick={(e) => handleOnboarding(e)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
