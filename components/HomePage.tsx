import Link from 'next/link';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { login, user } = useAuth();

  return (
    <Layout title='Home | ProgressPath'>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='font-bold text-5xl'>Welcome to ProgressPath 👋</h1>
        {!user ? (
          <div className='w-[300px]'>
            <button
              aria-label='Continue with google'
              role='button'
              onClick={login}
              className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10'
            >
              <img
                src='https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg'
                alt='google'
              />
              <p className='text-base font-medium ml-4 text-gray-700'>
                Login with Google
              </p>
            </button>
          </div>
        ) : (
          <Link href='/training' className='font-bold mt-5'>
            /training
          </Link>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
