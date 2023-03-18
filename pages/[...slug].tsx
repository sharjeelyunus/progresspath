import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Collapsible from '../components/Collapsible';
import Layout from '../components/Layout';
import TaskDetails from '../components/TaskDetails';
import useGetAllTasks from '../hooks/useGetTasks';

const Training = () => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) ?? [];

  const data = useGetAllTasks(slug[0]);
  const [markDone, setMarkDone] = useState(false);

  const tasks = data.map((task) => ({
    taskName: task.taskName,
    details: task.details,
  }));

  return (
    <Layout title='React & Nextjs | ProgressPath'>
      <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
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
    </Layout>
  );
};

export default Training;
