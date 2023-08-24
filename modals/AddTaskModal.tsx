import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  lastTaskDay: number;
  trackId: string;
};

function AddTaskModal({ isOpen, setIsOpen, lastTaskDay, trackId }: Props) {
  const [taskDay, setTaskDay] = useState<number>(lastTaskDay + 1);
  const [taskName, setTaskName] = useState<string>('');
  const [taskType, setTaskType] = useState<string>('resources');
  const [taskDescription, setTaskDescription] = useState<string>('');

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const handleAddTask = async () => {
    if (taskName.length < 3) {
      toast.error('Task Name should be atleast 3 characters long');
      return;
    }
    if (taskDescription.length < 10) {
      toast.error('Task Description should be atleast 10 characters long');
      return;
    }
    if (taskDay < 1) {
      toast.error('Task Day should be greater than 0');
      return;
    }

    if (taskDescription.length > 400) {
      toast.error('Task Description should be less than 400 characters long');
      return;
    }

    // task day should be greater than last task day
    if (taskDay <= lastTaskDay) {
      toast.error('Task Day should be greater than last task day');
      return;
    }

    if (
      taskName === '' ||
      taskDescription === '' ||
      taskType === '' ||
      Number.isNaN(taskDay)
    ) {
      toast.error('Please fill all the fields');
      return;
    }

    await addDoc(collection(db, 'trainings', trackId, 'tasks'), {
      day: taskDay,
      taskName: taskName,
      taskType: taskType,
      taskDescription: taskDescription,
    });
    setIsOpen(false);
  };

  return (
    <div
      onClick={handleOnClose}
      id='container'
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50'
    >
      <div className='bg-gray-800 mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl shadow-2xl'>
        <div className='flex flex-col w-[350px] lg:w-[500px] justify-center items-center py-6 lg:px-8 px-4'>
          <div className='w-full'>
            <div>
              <h2 className='text-white font-bold text-lg'>Add new task!</h2>
            </div>
            <div className='mt-2'>
              <div className='py-3'>
                <label className='block text-sm font-medium text-gray-300'>
                  Day
                </label>
                <input
                  type='number'
                  placeholder='Day'
                  value={taskDay}
                  onChange={(e) => setTaskDay(e.target.valueAsNumber)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Task Name
                </label>
                <input
                  type='text'
                  placeholder='Task Name'
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Task Description
                </label>
                <textarea
                  placeholder='Task Description'
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <div className='flex justify-end'>
                  <p
                    className={`${
                      taskDescription.length < 400
                        ? 'text-white'
                        : 'text-orange-600'
                    }`}
                  >
                    {taskDescription.length}/400
                  </p>
                </div>
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Task Type
                </label>
                <select
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                >
                  <option value='resources'>Resources</option>
                  <option value='project'>Project</option>
                  <option value='other'>Other</option>
                </select>
              </div>
            </div>
          </div>
          <div className='mt-5 flex w-full justify-end items-center'>
            <button
              className='rounded-full bg-gray-900 text-white text-center py-2 w-full'
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
