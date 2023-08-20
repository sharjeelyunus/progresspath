import React from 'react';
import Layout from '../../../components/Layout';

type Props = {};

const Error404 = (props: Props) => {
  return (
    <Layout title='Error 404 | ProgressPath'>
      <div className='flex justify-center items-center text-white bg-[#272829] py-28 min-h-screen'>
        <h1 className='text-2xl'>Error 404</h1>
      </div>
    </Layout>
  );
};

export default Error404;
