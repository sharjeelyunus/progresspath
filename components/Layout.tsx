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
  const { user } = useAuth();
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {user && <Navbar />}
      {children}
      {/* <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer> */}
    </div>
  );
};

export default Layout;
