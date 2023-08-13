import { Timestamp, addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

type Props = {
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  isOpen: boolean;
  trackId: string;
  setFeedbackSubmitted: (
    value: boolean | ((prevVar: boolean) => boolean)
  ) => void;
};

const ReviewModal = ({
  setIsOpen,
  isOpen,
  trackId,
  setFeedbackSubmitted,
}: Props) => {
  const { loggedInUser } = useAuth();
  const [trackExperience, setTrackExperience] = useState('5');
  const [trackFeedback, setTrackFeedback] = useState('');
  const [platformExperience, setPlatformExperience] = useState('5');
  const [platformFeedback, setPlatformFeedback] = useState('');

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const submitFeedback = async () => {
    const data = {
      TrackExperence: {
        rating: trackExperience,
        feedback: trackFeedback,
      },
      PlatformExperience: {
        rating: platformExperience,
        feedback: platformFeedback,
      },

      userId: loggedInUser.uid,
      trackId: trackId,
      timestamp: Timestamp.now(),
    };

    await addDoc(collection(db, 'feedbacks'), {
      ...data,
    });
    setFeedbackSubmitted(true);
    toast.success('Feedback submitted successfully');
  };

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();

    // check for empty fields
    if (
      trackFeedback === '' ||
      platformFeedback === '' ||
      trackExperience === '' ||
      platformExperience === ''
    ) {
      toast.error('Please fill in all fields');
    } else {
      // submit feedback
      await submitFeedback();
    }
  };

  return (
    <div
      onClick={handleOnClose}
      id='container'
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50'
    >
      <div className='bg-[#443C68] mt-[-71px] overflow-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl'>
        <div className='flex flex-col w-[350px] lg:w-[900px] h-[calc(100vh-250px)] overflow-y-scroll items-center py-6 lg:px-20 px-4'>
          <div>
            <h2 className='text-center text-white text-lg lg:text-2xl underline'>
              Please share your feedback!
            </h2>
          </div>
          <div className='mt-10'>
            <form>
              <p className='text-white font-bold'>
                Overall Experience on this training:
              </p>
              <div className='flex items-center justify-between gap-5'>
                <label className='text-white'>
                  • On a scale of 1 to 5, how would you rate your overall
                  experience with this training?
                </label>
                <select
                  name='trackExperience'
                  id='trackExperience'
                  className='bg-[#393053] text-white rounded-lg px-4 py-2 mt-2'
                  onChange={(e) => setTrackExperience(e.target.value)}
                >
                  <option value='5'>5</option>
                  <option value='4'>4</option>
                  <option value='3'>3</option>
                  <option value='2'>2</option>
                  <option value='1'>1</option>
                </select>
              </div>

              <div className='flex flex-col'>
                <label className='text-white'>
                  • What did you find most valuable about this training?
                </label>
                <textarea
                  name='mostValuable'
                  id='mostValuable'
                  className='bg-[#393053] text-white rounded-lg px-4 py-2 mt-2'
                  onChange={(e) => setTrackFeedback(e.target.value)}
                />
              </div>

              <p className='text-white font-bold mt-10'>
                Feedback on ProgressPath:
              </p>
              <div className='flex items-center justify-between gap-5'>
                <label className='text-white'>
                  • Please rate your experience with ProgressPath on a scale of
                  1 to 5
                </label>
                <select
                  name='experience'
                  id='experience'
                  className='bg-[#393053] text-white rounded-lg px-4 py-2 mt-2'
                  onChange={(e) => setPlatformExperience(e.target.value)}
                >
                  <option value='5'>5</option>
                  <option value='4'>4</option>
                  <option value='3'>3</option>
                  <option value='2'>2</option>
                  <option value='1'>1</option>
                </select>
              </div>

              <div className='flex flex-col'>
                <label className='text-white'>
                  • Please provide a brief review of your experience using
                  ProgressPath. How did it contribute to your learning journey
                  during this training?
                </label>
                <textarea
                  name='mostValuable'
                  id='mostValuable'
                  className='bg-[#393053] text-white rounded-lg px-4 py-2 mt-2'
                  onChange={(e) => setPlatformFeedback(e.target.value)}
                />
              </div>

              <div className='flex justify-end mt-10'>
                <button
                  className='rounded-full text-white border-[0.3px] border-white bg-[#393053] px-8 py-1 mr-5'
                  onClick={handleOnSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
