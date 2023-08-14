import React, { useState } from 'react';
import AddTaskModal from '../../modals/AddTaskModal';

type Props = {
  trackId: string;
  lastTaskDay: number;
};

const AddTask = ({ trackId, lastTaskDay }: Props) => {
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  return (
    <div className='flex justify-center mt-20'>
      <button
        className='text-white bg-[#443C68] px-5 py-2 rounded-lg'
        onClick={() => setAddTaskOpen(true)}
      >
        Add Task
      </button>

      {addTaskOpen && (
        <AddTaskModal
          isOpen={addTaskOpen}
          setIsOpen={setAddTaskOpen}
          lastTaskDay={lastTaskDay}
          trackId={trackId}
        />
      )}
    </div>
  );
};

export default AddTask;
