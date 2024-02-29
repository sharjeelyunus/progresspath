import React from 'react';
import { TaskInterface } from '../interfaces';
import SidebarItem from './SidebarItem';
import useGetCompletedTasks from '../hooks/useGetCompletedTasks';

type Props = {
  tasks: TaskInterface[];
  onSelectTask: (task: any) => void;
  selectedTask: TaskInterface | null;
  // completedTasks: any;
};

const TaskSidebar = ({ tasks, onSelectTask, selectedTask }: Props) => {
  return (
    <div className='sidebar'>
      <ul className='w-[350px] h-screen overflow-x-auto'>
        {tasks.map((task, index) => (
          <SidebarItem
            key={task.id}
            task={task}
            selectedTask={selectedTask}
            onSelectTask={onSelectTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskSidebar;
