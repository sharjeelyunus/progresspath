import { doc, setDoc, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  setMarkDone: (markDone: boolean) => void;
  trackId: string;
  taskId: string;
};

const CompleteTaskModal = ({
  trackId,
  setMarkDone,
  isOpen,
  setIsOpen,
  taskId,
}: Props) => {
  const [postLink, setPostLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [codeLink, setCodeLink] = useState('');

  const { user } = useAuth();

  const handleCompleteTask = async () => {
    // Ensure at least one link is present
    if (!postLink && !liveLink && !codeLink) {
      toast.error('Please submit at least one link');
      return;
    }

    // Validate URLs
    const urlRegex = new RegExp(
      /^(http|https):\/\/(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\S*$/i
    );
    
    if (postLink && !urlRegex.test(postLink)) {
      toast.error('Please enter a valid post URL');
      return;
    } else if (liveLink && !urlRegex.test(liveLink)) {
      toast.error('Please enter a valid live URL');
      return;
    } else if (codeLink && !urlRegex.test(codeLink)) {
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
    setIsOpen(false);
    setMarkDone(true);
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
            <div>
              <h2 className='text-white font-bold text-lg'>Complete Task</h2>
            </div>
            <div className='mt-2'>
              <h3 className='text-white'>
                Are you sure you want to complete this task?
              </h3>
              <div className='py-3'>
                <input
                  type='text'
                  placeholder='Project URL (GitHub)'
                  value={codeLink}
                  onChange={(e) => setCodeLink(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <input
                  type='text'
                  placeholder='Project URL (Live)'
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <input
                  type='text'
                  placeholder='Post URL'
                  value={postLink}
                  onChange={(e) => setPostLink(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
              </div>
            </div>
          </div>
          <div className='mt-5 flex w-full justify-end items-center'>
            <button
              className='rounded-full bg-[#393053] text-white text-center py-2 w-[100px]'
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
