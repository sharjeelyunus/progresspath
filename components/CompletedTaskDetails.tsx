import React, { useState, useEffect } from 'react';
import useGetTargetTask from '../hooks/useGetTargetTask';
import { CompletedTasks } from '../interfaces';
import { BiLink } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';
import ReviewCompletedTask from '../modals/ReviewCompletedTask';

type Props = CompletedTasks & {
  trackId: string;
  leadId: string;
};

const CompletedTaskDetails = ({
  trackId,
  taskId,
  timestamp,
  id,
  codeLink,
  liveLink,
  postLink,
  leadId,
  review,
  points,
  authorId,
}: Props) => {
  const taskDetails = useGetTargetTask(trackId, taskId);
  const { loggedInUser } = useAuth();
  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false);
  const [algoPoints, setAlgoPoints] = useState<number>(0);

  // validate links
  function isValidUrl(url: string): boolean {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    return urlPattern.test(url);
  }

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

    setAlgoPoints(totalPoints);
  }, [codeLink, liveLink, postLink]);

  return (
    <>
      <div
        key={id}
        className='flex flex-col lg:w-[450px] w-[350px] mt-5 bg-gray-700 text-white lg:px-7 p-5 rounded-2xl'
      >
        <div className='flex justify-between'>
          <h1 className='text-lg underline font-semibold'>
            {taskDetails?.taskName}
          </h1>
          {leadId === loggedInUser?.uid && (
            <button
              onClick={() => setOpenReviewModal(true)}
              className='bg-gray-900 px-5 h-9 rounded-lg'
            >
              Review
            </button>
          )}
        </div>
        <div className='flex mt-2 text-sm gap-5'>
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
        <p className='mt-2'>
          {/* Completed on: {timestamp.toDate().toLocaleDateString()} */}
        </p>
        <div
          className={
            points && points !== algoPoints
              ? points > algoPoints
                ? 'text-blue-500 mt-1 flex gap-2 py-1 rounded-md'
                : 'text-red-500 mt-1 flex gap-2 py-1 rounded-md'
              : 'mt-1 flex gap-2 py-1 rounded-md'
          }
        >
          <h1 className='font-semibold'>Points:</h1>
          <p>{points ? points : algoPoints}</p>
        </div>
        {review && review.text && (
          <fieldset className='mt-2 flex gap-2 items-center bg-orange-300 text-orange-900 px-5 py-1 rounded-md border border-orange-900'>
            <legend className='text-sm font-semibold bg-orange-300 underline px-2 rounded-md'>
              Review:
            </legend>
            <p className='text-sm'>{review.text}</p>
          </fieldset>
        )}
      </div>
      <ReviewCompletedTask
        isOpen={openReviewModal}
        setIsOpen={setOpenReviewModal}
        taskName={taskDetails?.taskName}
        codeLink={codeLink}
        liveLink={liveLink}
        postLink={postLink}
        userId={authorId}
        trackId={trackId}
        taskId={taskId}
        dbPoints={points}
        dbReview={review}
      />
    </>
  );
};

export default CompletedTaskDetails;
