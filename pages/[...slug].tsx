import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Collapsible from '../components/Collapsible';
import Layout from '../components/Layout';
import TaskDetails from '../components/TaskDetails';
import useGetCompletedTasks from '../hooks/useGetCompletedTasks';
import useGetAllTasks from '../hooks/useGetTasks';

const Training = () => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) ?? [];
  const [loading, setLoading] = useState(false);

  const data = useGetAllTasks(slug[0], setLoading);

  const tasks = data.map((task) => ({
    id: task.id,
    taskName: task.taskName,
    details: task.details,
    trackId: task.trackId,
  }));

  if (loading) {
    return (
      <Layout title='React & Nextjs | ProgressPath'>
        <div className='flex justify-center items-center text-white bg-[#635985] py-28 min-h-screen'>
          <div className='flex flex-col'>
            <h1>Loading...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title='React & Nextjs | ProgressPath'>
      <div className='flex justify-center bg-[#635985] py-28 min-h-screen'>
        <div className='flex flex-col w-11/12 lg:w-3/4'>
          {tasks.map((task, index) => (
            <Collapsible
              key={index}
              index={index}
              taskId={task.id}
              taskName={task.taskName}
              trackId={task.trackId}
            >
              <TaskDetails
                trackId={task.trackId}
                taskId={task.id}
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
