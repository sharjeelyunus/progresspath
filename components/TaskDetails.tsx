import { useState } from 'react';
import { Details } from '../interfaces';
import ComplelteTaskModal from '../modals/CompleteTaskModal';

type Props = {
  markDone: boolean;
  setMarkDone: (markDone: boolean) => void;
  details: Array<Details>;
  trackId: string;
};

const TaskDetails = ({ trackId, markDone, setMarkDone, details }: Props) => {
  const [openCompleteTaskModal, setOpenCompleteTaskModal] = useState(false);

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
                    taskId={detail.id}
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
