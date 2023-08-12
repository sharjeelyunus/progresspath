import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const { loggedInUser } = useAuth();
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {!loggedInUser && (
        <div className='flex fixed w-full justify-between items-center bg-[#272829] px-5 lg:px-28 drop-shadow-xl'>
          <div className='flex items-center py-5'>
            <Link href='/' className='text-white text-xl font-bold'>
              ProgressPath
            </Link>
          </div>
          {/* <div className='flex items-center'>
            <Link href='/login' className='text-white text-xl font-bold'>
              Login
            </Link>
          </div> */}
        </div>
      )}
      {loggedInUser && <Navbar />}
      {children}
    </div>
  );
};

export default Layout;
