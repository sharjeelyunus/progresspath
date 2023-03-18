import { useEffect, useState } from 'react';
import useGetCompletedTasks from '../hooks/useGetCompletedTasks';
import { Details } from '../interfaces';
import ComplelteTaskModal from '../modals/CompleteTaskModal';

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
                    {index + 1}. {detail.title}
                  </a>
                  <ComplelteTaskModal
                    trackId={trackId}
                    taskId={taskId}
                    setMarkDone={setMarkDone}
                    isOpen={openCompleteTaskModal}
                    setIsOpen={setOpenCompleteTaskModal}
                  />
                </>
              ))}
            </div>
          </div>
          <div className='flex justify-end'>
            <button
              className='bg-green-700 px-5 py-2 rounded-lg text-sm'
              onClick={() => setOpenCompleteTaskModal(true)}
            >
              {markDone ? 'Completed' : 'Mark as Done'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetails;
