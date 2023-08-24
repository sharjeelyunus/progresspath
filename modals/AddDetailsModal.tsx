import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

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
  const [taskType, setTaskType] = useState<string>('docs');
  const [taskLink, setTaskLink] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');

  function isValidUrl(url: string): boolean {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    return urlPattern.test(url);
  }

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const handleAddTask = async () => {
    if (taskTitle.length < 3) {
      toast.error('Task Title should be atleast 3 characters long');
      return;
    }
    if (taskDescription.length < 10) {
      toast.error('Task Description should be atleast 10 characters long');
      return;
    }
    if (taskDay <= lastTaskIndex) {
      toast.error('Task Day should be greater than last task day');
      return;
    }
    if (taskDescription.length > 400) {
      toast.error('Task Description should be less than 400 characters long');
      return;
    }
    if (!isValidUrl(taskLink)) {
      toast.error('Please enter a valid URL');
      return;
    }

    if (
      taskTitle === '' ||
      taskDescription === '' ||
      taskLink === '' ||
      taskType === '' ||
      Number.isNaN(taskDay)
    ) {
      toast.error('Please fill all the fields');
      return;
    }

    await addDoc(
      collection(db, 'trainings', trackId, 'tasks', taskId, 'details'),
      {
        index: taskDay,
        title: taskTitle,
        type: taskType,
        link: taskLink,
        description: taskDescription,
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
      <div className='bg-gray-800 mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl shadow-2xl'>
        <div className='flex flex-col w-[350px] lg:w-[500px] justify-center items-center py-6 lg:px-8 px-4'>
          <div className='w-full'>
            <div>
              <h2 className='text-white font-bold text-lg'>
                Add task resources!
              </h2>
            </div>
            <div className='mt-2'>
              <div className='py-3'>
                <label className='block text-sm font-medium text-gray-300'>
                  Index
                </label>
                <input
                  type='number'
                  placeholder='Index'
                  value={taskDay}
                  onChange={(e) => setTaskDay(e.target.valueAsNumber)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Title
                </label>
                <input
                  type='text'
                  placeholder='Title'
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Description
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
                  Type
                </label>
                <select
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                >
                  <option value='docs'>docs</option>
                  <option value='article'>article</option>
                  <option value='video'>Video</option>
                  <option value='other'>Other</option>
                </select>
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Link
                </label>
                <input
                  type='text'
                  placeholder='Link'
                  value={taskLink}
                  onChange={(e) => setTaskLink(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <div className='flex justify-end'>
                  <p
                    className={`${
                      taskLink === '' || isValidUrl(taskLink)
                        ? 'text-white'
                        : 'text-orange-600'
                    }`}
                  >
                    {taskLink === ''
                      ? ''
                      : isValidUrl(taskLink)
                      ? ''
                      : 'Invalid URL'}
                  </p>
                </div>
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
};

export default AddDetailsModal;
