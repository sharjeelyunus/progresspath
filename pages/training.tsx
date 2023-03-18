import React, { useState } from 'react';
import Collapsible from '../components/Collapsible';
import TaskDetails from '../components/TaskDetails';

import data from '../data.json';

const Training = () => {
  const [markDone, setMarkDone] = useState(false);

  const tasks = data.tarinings.map((task) => ({
    taskName: task.taskName,
    details: task.details,
  }));

  return (
    <div className='flex justify-center bg-[#18122B] py-20 min-h-screen'>
      <div className='flex flex-col w-3/4'>
        {tasks.map((task, index) => (
          <Collapsible
            key={index}
            markDone={markDone}
            index={index}
            taskName={task.taskName}
          >
            <TaskDetails
              markDone={markDone}
              setMarkDone={setMarkDone}
              details={task.details}
            />
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default Training;
