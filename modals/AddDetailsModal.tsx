import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  lastTaskIndex: number;
  trackId: string;
  taskId: string;
};

const AddDetailsModal = ({
  isOpen,
  lastTaskIndex,
  setIsOpen,
  trackId,
  taskId,
}: Props) => {
  const [taskDay, setTaskDay] = useState<number>(lastTaskIndex + 1);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskType, setTaskType] = useState<string>('');
  const [taskLink, setTaskLink] = useState<string>('');

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const handleAddTask = async () => {
    await addDoc(
      collection(db, 'trainings', trackId, 'tasks', taskId, 'details'),
      {
        index: taskDay,
        title: taskTitle,
        type: taskType,
        link: taskLink,
      }
    );
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
          <div className='w-full'>
            <div>
              <h2 className='text-white font-bold text-lg'>
                Add task resources!
              </h2>
            </div>
            <div className='mt-2'>
              <div className='py-3'>
                <input
                  type='number'
                  placeholder='Index'
                  value={taskDay}
                  onChange={(e) => setTaskDay(e.target.valueAsNumber)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <input
                  type='text'
                  placeholder='Title'
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <input
                  type='text'
                  placeholder='Type'
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <input
                  type='text'
                  placeholder='Link'
                  value={taskLink}
                  onChange={(e) => setTaskLink(e.target.value)}
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
};

export default AddDetailsModal;
