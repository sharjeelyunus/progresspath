import React from 'react';
import { CompletedTasks, TaskInterface } from '../interfaces';

type Props = {
  // completedTasks: CompletedTasks[];
  task: TaskInterface;
  selectedTask: TaskInterface | null;
  onSelectTask: (task: any) => void;
};

const SidebarItem = ({
  task,
  selectedTask,
  onSelectTask,
}: // completedTasks,
Props) => {
  // const isCompleted = completedTasks?.some((item) => item.id === task.id);

  return (
    <li
      className={
        selectedTask?.id === task.id
          ? // || isCompleted
            'bg-gray-900 text-white cursor-pointer'
          : 'bg-gray-800 text-white cursor-pointer'
      }
      key={task.id}
      onClick={() => onSelectTask(task)}
    >
      <p className='rounded-r-full p-5'>
        {task.day}. {task.taskName}
      </p>
    </li>
  );
};

export default SidebarItem;
