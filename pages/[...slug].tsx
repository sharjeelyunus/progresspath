import { useRouter } from 'next/router';
import React, { useState, useMemo } from 'react';
import Collapsible from '../components/Collapsible';
import Layout from '../components/Layout';
import TaskDetails from '../components/TaskDetails';
import { useAuth } from '../context/AuthContext';
import useGetAllTasks from '../hooks/useGetTasks';
import AddTask from '../components/Dashboard/AddTask';
import Loading from '../src/shared/components/Loading';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import UploadTrackImageModal from '../modals/UploadTrackImageModal';
import { TaskInterface } from '../interfaces';
import TaskSidebar from '../components/TaskSidebar';

const Training = () => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) ?? [];
  const [loading, setLoading] = useState(false);
  const [openUploadImageModal, setOpenUploadImageModal] = useState(false);
  const { loggedInUser } = useAuth();
  const { tasks, track } = useGetAllTasks(slug[0], setLoading);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskSelection = (task: TaskInterface) => {
    setSelectedTask(task);
  };

  const lastTaskDay = useMemo(() => {
    if (tasks.length > 0) {
      return tasks[tasks.length - 1].day;
    }
  }, [tasks]);

  if (loading) {
    return <Loading />;
  }

  const handleRequestPublishTrack = async () => {
    await updateDoc(doc(db, 'trainings', track?.id), {
      trackStatus: 'in-review',
    });

    toast.success('Your track has been submitted for review');

    router.push('/');
  };

  return (
    <Layout title={`${track?.name} | ProgressPath`}>
      <div className='flex justify-center bg-gray-700 py-28 min-h-screen'>
        <div className='flex flex-col w-full'>
          <div>
            <div className='flex justify-between px-20'>
              {loggedInUser?.mentorTracks?.includes(track?.id) && (
                <button
                  onClick={() => setOpenUploadImageModal(true)}
                  className='text-white bg-gray-900 px-10 py-4 rounded-xl'
                >
                  Update Track Image
                </button>
              )}
              {loggedInUser?.mentorTracks?.includes(track?.id) && (
                <>
                  {tasks.length > 10 && track?.trackStatus == 'pending' && (
                    <button
                      onClick={handleRequestPublishTrack}
                      className='text-white bg-gray-900 px-10 py-4 rounded-xl'
                    >
                      Publish Track
                    </button>
                  )}
                </>
              )}
            </div>
            {loggedInUser?.mentorTracks?.includes(track?.id) && (
              <>
                {track?.trackStatus !== 'Published' && tasks.length < 10 && (
                  <p className='text-black font-bold text-center bg-white p-3 my-10 rounded-md'>
                    This track is still in development. You'll be able to
                    publish it once you've added at least 10 tasks.
                  </p>
                )}
              </>
            )}
            <h1 className='text-4xl font-bold text-white text-center'>
              {track?.name}
            </h1>
          </div>
          <div className='flex mt-5'>
            <TaskSidebar
              tasks={tasks}
              onSelectTask={handleTaskSelection}
              selectedTask={selectedTask}
            />
            <div className='w-full'>
              {selectedTask ? (
                <TaskDetails
                  trackId={selectedTask.trackId}
                  taskId={selectedTask.id}
                  details={selectedTask.details}
                />
              ) : (
                <p className='text-white mt-3 text-center'>
                  {track?.trackShortDescription}
                </p>
              )}
            </div>
          </div>
          {/* <div className='mt-5'>
            {tasks.map((task, index) => (
              <Collapsible
                key={task.id}
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
          </div> */}
          {loggedInUser?.mentorTracks?.includes(track?.id) && (
            <AddTask trackId={track?.id} lastTaskDay={lastTaskDay} />
          )}
        </div>
      </div>
      {openUploadImageModal && (
        <UploadTrackImageModal
          isOpen={openUploadImageModal}
          setIsOpen={setOpenUploadImageModal}
          trackId={track?.id}
          trackImage={track?.image}
          trackName={track?.name}
        />
      )}
    </Layout>
  );
};

export default Training;
