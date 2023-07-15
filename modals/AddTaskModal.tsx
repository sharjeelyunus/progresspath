import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../config/firebase';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  lastTaskDay: number;
  trackId: string;
};

function AddTaskModal({ isOpen, setIsOpen, lastTaskDay, trackId }: Props) {
  const [taskDay, setTaskDay] = useState<number>(lastTaskDay + 1);
  const [taskName, setTaskName] = useState<string>('');
  const [taskType, setTaskType] = useState<string>('');

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const handleAddTask = async () => {
    await addDoc(collection(db, 'trainings', trackId, 'tasks'), {
      day: taskDay,
      taskName: taskName,
      taskType: taskType,
    });
  };

  return (
    <div
      onClick={handleOnClose}
      id='container'
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50'
    >
      <div className='bg-[#443C68] mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl'>
        <div className='flex flex-col w-[350px] lg:w-[500px] justify-center items-center py-6 lg:px-8 px-4'>
          <div className='w-full'>
            <div>
              <h2 className='text-white font-bold text-lg'>Add new task!</h2>
            </div>
            <div className='mt-2'>
              <div className='py-3'>
                <input
                  type='number'
                  placeholder='Day'
                  value={taskDay}
                  onChange={(e) => setTaskDay(e.target.valueAsNumber)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <input
                  type='text'
                  placeholder='Task Name'
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <input
                  type='text'
                  placeholder='Task Type'
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
              </div>
            </div>
          </div>
          <div className='mt-5 flex w-full justify-end items-center'>
            <button
              className='rounded-full bg-[#393053] text-white text-center py-2 w-[100px]'
              onClick={handleAddTask}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
