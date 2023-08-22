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
  const { loggedInUser } = useAuth();

  const data = useGetAllTasks(slug[0], setLoading);

  const tasks = data.tasks.map((task) => ({
    id: task.id,
    taskName: task.taskName,
    details: task.details,
    trackId: task.trackId,
    day: task.day,
  }));

  // useEffect(() => {
  //   if (loggedInUser?.mentorTracks?.length > 0) {
  //     setIsMentor(loggedInUser?.mentorTracks?.includes(data?.track?.id));
  //   }
  // }, [loggedInUser]);

  if (loading) {
    return (
      <Layout title='Loading... | ProgressPath'>
        <div className='flex justify-center items-center text-white bg-[#272829] py-28 min-h-screen'>
          <div className='flex flex-col'>
            <h1>Loading...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  const lastTaskDay = tasks[tasks.length - 1]?.day;

  return (
    <Layout title={`${data?.track?.name} | ProgressPath`}>
      <div className='flex justify-center bg-[#272829] py-28 min-h-screen'>
        <div className='flex flex-col w-11/12 lg:w-3/4'>
          <div>
            <h1 className='text-4xl font-bold text-white text-center'>
              {data?.track?.name}
            </h1>
            <p className='text-white mt-3 text-center'>
              {data?.track?.trackShortDescription}
            </p>
          </div>
          <div className='mt-5'>
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
          </div>
          {loggedInUser?.mentorTracks?.length > 0 &&
            loggedInUser?.mentorTracks.includes(data?.track?.id) && (
              <AddTask trackId={data?.track?.id} lastTaskDay={lastTaskDay} />
            )}
        </div>
      </div>
    </Layout>
  );
};

export default Training;
