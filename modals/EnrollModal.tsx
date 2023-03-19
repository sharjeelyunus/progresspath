import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

type Props = {
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  trackId: string;
  trackSlug: string;
  isOpen: boolean;
};

const EnrollModal = ({ trackId, trackSlug, setIsOpen, isOpen }: Props) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleEnrollTrack = async () => {
    await setDoc(doc(db, 'users', user.uid, 'enrolledTracks', trackId), {
      trackId,
      timestamp: Timestamp.now(),
    });
    setIsOpen(false);
    router.push(`/${trackSlug}`);
  };

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOnClose}
      id='container'
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50'
    >
      <div className='bg-[#443C68] mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl'>
        <div className='flex flex-col w-[350px] lg:w-auto justify-center items-center py-6 lg:px-8 px-4'>
          <div>
            <h2 className='text-center text-white text-lg lg:text-2xl'>
              Are you sure you want to enroll in this track?
            </h2>
          </div>
          <div className='mt-5'>
            <button
              className='rounded-full text-white border-[0.3px] border-white bg-[#393053] px-8 py-1 mr-5 w-[100px]'
              onClick={handleEnrollTrack}
            >
              Yes
            </button>
            <button
              className='rounded-full text-white border-[0.3px] border-white px-8 py-1 w-[100px]'
              onClick={() => setIsOpen(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollModal;
