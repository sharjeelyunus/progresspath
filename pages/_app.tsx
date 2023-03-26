import React from 'react';
import { AppProps } from 'next/app';

import '../styles/index.css';
import { AuthContextProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Toaster position='top-center' reverseOrder={false} />
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
