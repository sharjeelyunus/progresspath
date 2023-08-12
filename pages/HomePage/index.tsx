import Layout from '../../components/Layout';
import GoogleLoginButton from '../../src/shared/components/GoogleLoginButton';

const HomePage = () => {
  return (
    <Layout title='ProgressPath'>
      <div className='flex flex-col items-center justify-center bg-[#272829] min-h-screen px-5 lg:px-28'>
        <div className='mt-20 py-20 flex flex-col items-center justify-center'>
          <h1 className='font-bold text-2xl lg:text-3xl text-white text-center'>
            Grow Your Skills To Advance Your Career Path
          </h1>
          <p className='text-amber-400 text-lg text-center px-0 lg:px-60 py-4'>
            Master Tech, Byte by Byte, Day by Day
          </p>
          <p className='text-white text-lg text-center px-0 lg:px-60 py-4'>
            ProgressPath is a comprehensive training platform designed to help
            individuals build new skills and advance their careers. The platform
            is structured as a daily path, with each day unlocking new tasks,
            resources, and challenges to help users stay motivated and engaged.
          </p>
          <div className='flex flex-col justify-center items-center mt-5'>
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
