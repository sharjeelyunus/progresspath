import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { BiLink } from 'react-icons/bi';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

type Props = {
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  isOpen: boolean;
  taskName: string;
  codeLink: string;
  liveLink: string;
  postLink: string;
  userId: string;
  trackId: string;
  taskId: string;
  dbPoints: number;
  dbReview: {
    text: string;
    reviewer: string;
  };
};

const ReviewCompletedTask = ({
  isOpen,
  setIsOpen,
  taskName,
  codeLink,
  liveLink,
  postLink,
  userId,
  trackId,
  taskId,
  dbReview,
  dbPoints
}: Props) => {
  const [review, setReview] = useState<string>(dbReview?.text || '');
  const [taskPoints, setTaskPoints] = useState<number>(0);
  const { loggedInUser } = useAuth();

  useEffect(() => {
    let totalPoints = 0;
    let links = [codeLink, liveLink, postLink];
    let validLinks = links.filter((link) => link && isValidUrl(link));

    // Check if at least one link is valid
    if (validLinks.length > 0) {
      totalPoints += validLinks.length * 5;
      totalPoints += 5; // Additional 5 points for completing the task
    } else {
      totalPoints = 5;
    }
    if (dbPoints) {
      setTaskPoints(dbPoints);
    } else {
      setTaskPoints(totalPoints);
    }
  }, [codeLink, liveLink, postLink, dbPoints]);

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  // validate links
  function isValidUrl(url: string): boolean {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    return urlPattern.test(url);
  }

  const handleSubmitReview = async () => {
    const docRef = doc(
      db,
      'users',
      userId,
      'enrolledTracks',
      trackId,
      'completedTasks',
      taskId
    );
    const reviewData = {
      review: {
        text: review,
        reviewer: loggedInUser?.uid,
      },
      points: taskPoints,
    };
    await setDoc(docRef, reviewData, { merge: true });
    setIsOpen(false);
  };

  return (
    <div
      onClick={handleOnClose}
      id='container'
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50'
    >
      <div className='bg-[#443C68] mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl'>
        <div className='flex flex-col w-[350px] lg:w-[500px] justify-center items-center py-6 lg:px-8 px-4'>
          <div>
            <h2 className='text-center text-white font-bold text-lg lg:text-2xl'>
              Review: <span className='font-normal underline'>{taskName}</span>
            </h2>
          </div>
          <div className='flex mt-5 text-sm gap-5 items-center justify-center text-white'>
            {codeLink && isValidUrl(codeLink) && (
              <a
                className='font-semibold flex items-center gap-1'
                href={codeLink}
                target='_blank'
                rel='noreferrer'
              >
                <BiLink /> Code Link
              </a>
            )}
            {liveLink && isValidUrl(liveLink) && (
              <a
                className='font-semibold flex items-center gap-1'
                href={liveLink}
                target='_blank'
                rel='noreferrer'
              >
                <BiLink /> Live Link
              </a>
            )}
            {postLink && isValidUrl(postLink) && (
              <a
                className='font-semibold flex items-center gap-1'
                href={postLink}
                target='_blank'
                rel='noreferrer'
              >
                <BiLink /> Post Link
              </a>
            )}
          </div>
          <div className='w-full'>
            <textarea
              className='w-full mt-5 bg-[#393053] text-white rounded-lg p-2'
              placeholder='Write your review here...'
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <div>
            <div className='text-white mt-2 flex items-center gap-2'>
              <span className='font-bold'>Points:</span>
              <div className='flex items-center gap-1'>
                <input
                  className='bg-[#393053] w-14 px-2 py-1 rounded-lg border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400'
                  value={taskPoints}
                  onChange={(e) => setTaskPoints(parseInt(e.target.value))}
                  type='number'
                  min={0}
                  max={20}
                />
                <span>/20</span>
              </div>
            </div>
          </div>
          <div className='mt-10 flex justify-end w-full'>
            <button
              className='rounded-full text-white bg-[#393053] py-1 w-[100px]'
              onClick={handleSubmitReview}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCompletedTask;
