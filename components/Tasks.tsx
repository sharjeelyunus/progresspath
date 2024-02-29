import React, { useState } from 'react';
import TaskSidebar from './TaskSidebar';
import TaskDetails from './TaskDetails';
import { TaskInterface, TrainingsInterface } from '../interfaces';
import useGetCompletedTasks from '../hooks/useGetCompletedTasks';

type Props = {
  tasks: TaskInterface[];
  track: TrainingsInterface;
};

const Tasks = ({ tasks, track }: Props) => {
  const [selectedTask, setSelectedTask] = useState<TaskInterface>(null);

  // const completedTasks = useGetCompletedTasks(track.id);

  const handleTaskSelection = (task: TaskInterface) => {
    setSelectedTask(task);
  };
  return (
    <div>
      <TaskSidebar
        tasks={tasks}
        onSelectTask={handleTaskSelection}
        selectedTask={selectedTask}
        // completedTasks={completedTasks}
      />
      <div className='w-full'>
        {selectedTask ? (
          <TaskDetails
            trackId={selectedTask.trackId}
            taskId={selectedTask.id}
            details={selectedTask.details}
            // completedTasks={completedTasks}
          />
        ) : (
          <p className='text-white mt-3 text-center'>
            {track?.trackShortDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
