import Link from 'next/link';
import React from 'react';
import Layout from './Layout';

type Props = {};

const TrainingsHomePage = (props: Props) => {
  return (
    <Layout title='React & Nextjs | ProgressPath'>
      <div className='flex justify-center bg-[#635985] text-white py-28 min-h-screen'>
        <Link
          href='/react-nextjs-track'
          className='bg-[#393053] flex flex-col items-center justify-center px-10 h-[200px] rounded-2xl'
        >
          <h1 className='text-2xl font-bold'>React & Nextjs Track</h1>
          <div className='flex items-center mt-4'>
            <img
              className='h-8 w-8 rounded-full mr-2'
              src='https://lh3.googleusercontent.com/a/AGNmyxbZYy_DCwiT8JfFuHZX-_YvvjHQrUB18J9mI9jpag=s96-c'
              alt=''
            />
            <p>Sharjeel Yunus</p>
          </div>
        </Link>
      </div>
    </Layout>
  );
};

export default TrainingsHomePage;
