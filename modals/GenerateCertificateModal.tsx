import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ReviewModal from './ReviewModal';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

type Props = {
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  isOpen: boolean;
  trackId: string;
};

const GenerateCertificateModal = ({ isOpen, setIsOpen, trackId }: Props) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const { loggedInUser } = useAuth();

  useEffect(() => {
    const checkFeedback = async () => {
      const q = query(
        collection(db, 'feedbacks'),
        where('userId', '==', loggedInUser.uid),
        where('trackId', '==', trackId)
      );
      const querySnapshot = await getDocs(q);
      const feedbacks = querySnapshot.docs.map((doc) => doc.data());
      if (feedbacks.length > 0) {
        setFeedbackSubmitted(true);
      }
    };

    checkFeedback();
  }, []);

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  if (!feedbackSubmitted) {
    return (
      <ReviewModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        trackId={trackId}
        setFeedbackSubmitted={setFeedbackSubmitted}
      />
    );
  }

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
              Thank you for your feedback!
            </h2>
          </div>
          <div className='mt-10'>
            <p className='text-white text-center'>
              Your feedback is valuable to us and will help us improve your
              experience on ProgressPath.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCertificateModal;
