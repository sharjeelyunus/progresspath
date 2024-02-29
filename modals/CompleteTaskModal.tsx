import { doc, setDoc, Timestamp } from 'firebase/firestore';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { isValidUrl } from '../src/utils';
import ValidateURL from '../src/shared/components/ValidateURL';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  // setMarkDone: (markDone: boolean) => void;
  trackId: string;
  taskId: string;
};

const CompleteTaskModal = ({
  trackId,
  // setMarkDone,
  isOpen,
  setIsOpen,
  taskId,
}: Props) => {
  const [postLink, setPostLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [codeLink, setCodeLink] = useState('');

  const { user } = useAuth();

  const cacheKey = useMemo(() => `${trackId}-${user.uid}`, [trackId, user.uid]);

  const handleCompleteTask = async () => {
    // Ensure at least one link is present
    if (!postLink && !liveLink && !codeLink) {
      toast.error('Please submit at least one link');
      return;
    }

    if (postLink && !isValidUrl(postLink)) {
      toast.error('Please enter a valid post URL');
      return;
    } else if (liveLink && !isValidUrl(liveLink)) {
      toast.error('Please enter a valid live URL');
      return;
    } else if (codeLink && !isValidUrl(codeLink)) {
      toast.error('Please enter a valid code URL');
      return;
    }

    await setDoc(
      doc(
        db,
        'users',
        user.uid,
        'enrolledTracks',
        trackId,
        'completedTasks',
        taskId
      ),
      {
        taskId,
        timestamp: Timestamp.now(),
        postLink,
        liveLink,
        codeLink,
        authorId: user.uid,
      }
    );
    // update cache
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      parsedData.completedTasksByUser.push({
        taskId,
        timestamp: Timestamp.now(),
        postLink,
        liveLink,
        codeLink,
        authorId: user.uid,
      });
    }

    // update local storage
    const localStorageData = localStorage.getItem(cacheKey);
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      parsedData.completedTasksByUser.push({
        taskId,
        timestamp: Timestamp.now(),
        postLink,
        liveLink,
        codeLink,
        authorId: user.uid,
      });
    }

    toast.success('Task completed successfully');
    setIsOpen(false);
    // setMarkDone(true);
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
      <div className='bg-gray-800 mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl shadow-2xl'>
        <div className='flex flex-col w-[350px] lg:w-[500px] justify-center items-center py-6 lg:px-8 px-4'>
          <div className='w-full'>
            <div>
              <h2 className='text-white font-bold text-lg text-center'>
                Complete Task
              </h2>
            </div>
            <div className='mt-2 w-full'>
              <div className='py-3 w-full'>
                <label className='block text-sm font-medium text-gray-300'>
                  Project URL (GitHub)
                </label>
                <input
                  type='text'
                  placeholder='Project URL (GitHub)'
                  value={codeLink}
                  onChange={(e) => setCodeLink(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <ValidateURL url={codeLink} />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Project URL (Live)
                </label>
                <input
                  type='text'
                  placeholder='Project URL (Live)'
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <ValidateURL url={liveLink} />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Post URL
                </label>
                <input
                  type='text'
                  placeholder='Post URL'
                  value={postLink}
                  onChange={(e) => setPostLink(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <ValidateURL url={postLink} />
              </div>
            </div>
          </div>
          <div className='mt-5 flex w-full items-center'>
            <button
              className='rounded-full bg-gray-900 text-white text-center py-2 w-full'
              onClick={handleCompleteTask}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteTaskModal;
