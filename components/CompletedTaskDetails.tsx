import React from 'react';
import useGetTargetTask from '../hooks/useGetTargetTask';
import { CompletedTasks } from '../interfaces';
import { BiLink } from 'react-icons/bi';

type Props = CompletedTasks & {
  trackId: string;
};

const CompletedTaskDetails = ({
  trackId,
  taskId,
  timestamp,
  id,
  codeLink,
  liveLink,
  postLink,
}: Props) => {
  const taskDetails = useGetTargetTask(trackId, taskId);

  // validate links
  function isValidUrl(url: string): boolean {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    return urlPattern.test(url);
  }

  return (
    <div
      key={id}
      className='flex flex-col lg:w-[450px] w-[350px] mt-5 bg-[#393053] text-white lg:px-10 px-5 py-5 rounded-2xl'
    >
      <h1 className='text-lg underline font-semibold'>
        {taskDetails?.taskName}
      </h1>
      <div className='flex mt-2 text-sm gap-5'>
        {codeLink && isValidUrl(codeLink) && (
          <a className='font-semibold flex items-center gap-1' href={codeLink} target='_blank' rel='noreferrer'>
            <BiLink /> Code Link
          </a>
        )}
        {liveLink && isValidUrl(liveLink) && (
          <a className='font-semibold flex items-center gap-1' href={liveLink} target='_blank' rel='noreferrer'>
            <BiLink /> Live Link
          </a>
        )}
        {postLink && isValidUrl(postLink) && (
          <a className='font-semibold flex items-center gap-1' href={postLink} target='_blank' rel='noreferrer'>
            <BiLink /> Post Link
          </a>
        )}
      </div>
      <p className='mt-2'>
        Completed on: {timestamp.toDate().toLocaleDateString()}
      </p>
    </div>
  );
};

export default CompletedTaskDetails;
