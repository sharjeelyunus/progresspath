import Link from 'next/link';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { login } = useAuth();

  return (
    <Layout title='Home | ProgressPath'>
      <div className='flex flex-col items-center justify-center h-screen bg-[#635985] px-5 lg:px-28'>
        <h1 className='font-bold text-2xl lg:text-5xl text-white'>
          Welcome to{' '}
          <span className='text-[#18122B] underline'>ProgressPath</span>👋
        </h1>
        <div className='flex flex-col justify-center items-center mt-5'>
          <p className='text-white text-lg text-center'>
            ProgressPath is a comprehensive training platform designed to help
            individuals build new skills and advance their careers. The platform
            is structured as a daily path, with each day unlocking new tasks,
            resources, and challenges to help users stay motivated and engaged.
          </p>
          <div className='w-[300px]'>
            <button
              aria-label='Continue with google'
              role='button'
              onClick={login}
              className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-white flex items-center w-full mt-5'
            >
              <img
                src='https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg'
                alt='google'
              />
              <p className='text-base font-medium ml-4 text-white'>
                Login with Google
              </p>
            </button>
          </div>
          <div className='mt-5'>
            <span className='text-[#18122B] text-2xl font-bold underline'>
              Instructions
            </span>
            <ul className='list-disc list-inside text-white text-lg'>
              <li>
                Sign in with same email you applied for Bytewise fellowship
              </li>
              <li>Enroll in a track</li>
              <li>Complete tasks</li>
              <li>Check leaderboard to track your progress</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
