import React from 'react';
import { AppProps } from 'next/app';

import '../styles/index.css';
import { AuthContextProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <RecoilRoot>
        <Toaster position='top-center' reverseOrder={false} />
        <Component {...pageProps} />
      </RecoilRoot>
    </AuthContextProvider>
  );
}

export default MyApp;
