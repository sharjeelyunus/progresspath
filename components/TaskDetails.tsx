import { useEffect, useState } from 'react';
import useGetCompletedTasks from '../hooks/useGetCompletedTasks';
import { Details } from '../interfaces';
import ComplelteTaskModal from '../modals/CompleteTaskModal';
import { MdVideoLibrary } from 'react-icons/md';
import { SiReadthedocs } from 'react-icons/si';
import { RiArticleFill } from 'react-icons/ri';
import { MdOutlineComputer } from 'react-icons/md';

type Props = {
  details: Array<Details>;
  trackId: string;
  taskId: string;
};

const TaskDetails = ({ taskId, trackId, details }: Props) => {
  const [openCompleteTaskModal, setOpenCompleteTaskModal] = useState(false);
  const [markDone, setMarkDone] = useState(false);

  const completedTasks = useGetCompletedTasks(trackId);

  useEffect(() => {
    completedTasks.map((task) => {
      if (task.id === taskId) {
        setMarkDone(true);
      }
    });
  }, [completedTasks]);

  return (
    <>
      <div className='flex justify-between px-5 py-3 bg-[#393053] text-white'>
        <div className='w-full'>
          <div className='text-sm'>
            <div className='flex flex-col'>
              {details.map((detail, index) => (
                <>
                  <a
                    className='p-2'
                    href={detail.link}
                    key={index}
                    target='_blank'
                  >
                    {detail.type === 'video' ? (
                      <div className='flex items-center gap-2'>
                        <MdVideoLibrary /> {detail.title}
                      </div>
                    ) : detail.type === 'article' ? (
                      <div className='flex items-center gap-2'>
                        <RiArticleFill /> {detail.title}
                      </div>
                    ) : detail.type === 'docs' ? (
                      <div className='flex items-center gap-2'>
                        <SiReadthedocs /> {detail.title}
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <MdOutlineComputer /> {detail.title}
                      </div>
                    )}
                  </a>
                </>
              ))}
            </div>
          </div>
          <div className='flex justify-end'>
            <button
              className='bg-green-700 px-5 py-2 rounded-lg text-sm'
              onClick={
                markDone ? () => {} : () => setOpenCompleteTaskModal(true)
              }
            >
              {markDone ? 'Completed' : 'Mark as Done'}
            </button>
          </div>
        </div>
      </div>
      {openCompleteTaskModal && (
        <ComplelteTaskModal
          trackId={trackId}
          taskId={taskId}
          setMarkDone={setMarkDone}
          isOpen={openCompleteTaskModal}
          setIsOpen={setOpenCompleteTaskModal}
        />
      )}
    </>
  );
};

export default TaskDetails;
