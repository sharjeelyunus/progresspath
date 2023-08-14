import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();

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

  const navigateToCertificatePage = () => {
    // Navigate to certificate generation page with userId and trackId as query parameters
    router.push({
      pathname: '/certificate/generate',
      query: {
        userId: loggedInUser.uid,
        trackId: trackId,
      },
    });
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
  } else {
    // If feedback has been submitted, navigate to the certificate generation page
    navigateToCertificatePage();
    return null;
  }
};

export default GenerateCertificateModal;
