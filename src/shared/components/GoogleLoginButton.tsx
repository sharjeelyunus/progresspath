import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const GoogleLoginButton = () => {
  const { login } = useAuth();
  return (
    <div className='w-[300px]'>
      <button
        aria-label='Continue with google'
        role='button'
        onClick={login}
        className='focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-white flex items-center justify-center w-full mt-5'
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
  );
};

export default GoogleLoginButton;
