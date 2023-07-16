import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Collapsible from '../components/Collapsible';
import Layout from '../components/Layout';
import TaskDetails from '../components/TaskDetails';
import { useAuth } from '../context/AuthContext';
import useGetAllTasks from '../hooks/useGetTasks';
import AddTask from '../components/Dashboard/AddTask';

const Training = () => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) ?? [];
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, []);

  const data = useGetAllTasks(slug[0], setLoading);

  const tasks = data.map((task) => ({
    id: task.id,
    taskName: task.taskName,
    details: task.details,
    trackId: task.trackId,
    day: task.day,
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

  const lastTaskDay = tasks[tasks.length - 1]?.day;

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
                key={task.id}
                trackId={task.trackId}
                taskId={task.id}
                details={task.details}
              />
            </Collapsible>
          ))}
          <AddTask trackId={data[0]?.trackId} lastTaskDay={lastTaskDay} />
        </div>
      </div>
    </Layout>
  );
};

export default Training;
