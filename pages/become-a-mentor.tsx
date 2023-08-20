import React from 'react';
import Layout from '../components/Layout';

const BecomeMentor = () => {
  return (
    <Layout title='Become a Mentor | ProgressPath'>
      <div className='pt-24 flex flex-col items-center bg-[#272829] text-white min-h-screen px-10'>
        <h1 className='text-3xl font-semibold mb-6 mt-10'>
          Become a Mentor at ProgressPath
        </h1>

        <form className='max-w-md w-full'>
          {/* Mentor Information */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Full Name
            </label>
            <input
              type='text'
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Your full name'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Email
            </label>
            <input
              type='email'
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Your email address'
            />
          </div>

          {/* Mentorship Details */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Area of Expertise
            </label>
            <input
              type='text'
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Your area of expertise'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Years of Experience
            </label>
            <input
              type='number'
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Number of years'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Track you want to mentor?
            </label>
            <input
              type='text'
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Track name you want to mentor'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Details about your track? (Description)
            </label>
            <textarea
              rows={4}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Tell us in detail what will be in this track?...'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Why do you want to be a mentor?
            </label>
            <textarea
              rows={4}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Tell us your motivation...'
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full text-white bg-[#443C68] px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-200'
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default BecomeMentor;
