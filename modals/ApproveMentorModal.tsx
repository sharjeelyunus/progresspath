import React, { useEffect, useState } from 'react';
import { MentorRequests } from '../interfaces';
import { Timestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  request: MentorRequests;
};

const ApproveMentorModal = ({ isOpen, setIsOpen, request }: Props) => {
  const [index, setIndex] = useState(0);
  const [slug, setSlug] = useState('');
  const [trackName, setTrackName] = useState('');
  const [trackImage, setTrackImage] = useState<File>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    if (trackImage) {
      setImagePreviewUrl(URL.createObjectURL(trackImage));
    }
  }, [trackImage]);

  useEffect(() => {
    setSlug(request.trackName.toLowerCase().replace(' ', '-'));
    setTrackName(request.trackName);
  }, [request.trackName]);

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const handleApproveMentorRequest = async (e: any) => {
    e?.preventDefault();

    if (!index || !slug || !trackName) {
      toast.error('Please fill all the fields');
      return;
    }

    if (slug.includes(' ')) {
      toast.error('Slug cannot contain spaces');
      return;
    }

    if (request.trackType === 'new') {
      // approve mentor request and add track && update user profile
      const mentorRequestsRef = doc(db, 'mentorRequests', request.id);
      const userRef = doc(db, 'users', request.userId);

      if (!request.trackSubType) {
        toast.error('Invalid track sub-type');
        return;
      }

      const updateMentor = {
        status: 'approved',
      };

      const trainingData = {
        trackName: trackName,
        trackShortDescription: request.trackShortDescription,
        mentors: [request.userId],
        index: index,
        slug: slug,
        timestamp: Timestamp.now(),
        trackStatus: 'pending',
        trackType: request.trackSubType,
        image: uploadedImage,
      };

      const userData = {
        mentorTracks: [request.id],
        linkedin: request.linkedin,
        github: request.github,
        twitter: request.twitter,
        website: request.portfolio,
      };

      try {
        await updateDoc(mentorRequestsRef, updateMentor);
        await updateDoc(userRef, userData);

        // Create a new training document with request.id as the document ID
        const newTrainingDocRef = doc(db, 'trainings', request.id);
        await setDoc(newTrainingDocRef, trainingData);

        toast.success('Request approved successfully');
      } catch (error) {
        toast.error('Something went wrong');
        console.log(error);
      }

      setIsOpen(false);
    } else {
      // add to existing mentors
    }
  };

  const handleUploadImage = async () => {
    if (!trackImage) {
      toast.error('Please select an image');
      return;
    }

    const storageRef = ref(storage, `Tracks/${trackName}-image`);
    const uploadTask = uploadBytesResumable(storageRef, trackImage);

    let loadingToastId;

    const updateLoadingToast = (progress) => {
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      loadingToastId = toast.loading(`Uploading ${progress.toFixed(0)}%`);
    };

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        updateLoadingToast(progress);
      },
      (error) => {
        toast.error('Something went wrong');
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadedImage(downloadURL);
          toast.dismiss(loadingToastId); // Dismiss the final loading toast
          toast.success('Image uploaded successfully');
        } catch (error) {
          toast.error('Error getting download URL');
        }
      }
    );
  };

  const handleGenerateImage = async () => {
    if (!trackName) {
      toast.error('Please enter a track name');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;

    const ctx = canvas.getContext('2d');

    // Background color
    ctx.fillStyle = '#443C68';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 80px Arial';

    // Calculate text width and x position to center-align
    const trackNameWidth = ctx.measureText(trackName).width;
    const trackNameX = (canvas.width - trackNameWidth) / 2;
    ctx.fillText(trackName, trackNameX, 300);

    ctx.font = 'bold 60px Arial';

    // Calculate text width and x position to center-align
    const progressPathWidth = ctx.measureText('ProgressPath').width;
    const progressPathX = (canvas.width - progressPathWidth) / 2;
    ctx.fillText('ProgressPath', progressPathX, 400);

    // Convert canvas to a Blob file and update state
    canvas.toBlob(async (blob) => {
      if (blob) {
        const generatedImage = new File([blob], `${trackName}-image.png`);
        setTrackImage(generatedImage);
        setImagePreviewUrl(URL.createObjectURL(generatedImage));
      }
    }, 'image/png');
  };

  return (
    <div
      onClick={handleOnClose}
      id='container'
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50'
    >
      <div className='bg-[#443C68] mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl'>
        <div className='flex flex-col w-[350px] lg:w-[500px] justify-center items-center py-6 lg:px-8 px-4'>
          <div className='w-full'>
            <div>
              <h2 className='text-white font-bold text-2xl text-center'>
                {request.trackName}
              </h2>
            </div>
            <div className='mt-2'>
              <div className='py-3'>
                <label className='block text-sm font-medium text-gray-300'>
                  Index
                </label>
                <input
                  type='number'
                  placeholder='Index'
                  value={index}
                  onChange={(e) => setIndex(+e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Track Name
                </label>
                <input
                  type='text'
                  placeholder='Track Name'
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Slug
                </label>
                <input
                  type='text'
                  placeholder='slug'
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                />
                <label className='block text-sm font-medium text-gray-300 mt-5'>
                  Track Image
                </label>
                {imagePreviewUrl ? (
                  <div className='flex flex-col gap-5'>
                    <img
                      src={imagePreviewUrl}
                      alt='Track Image'
                      className='w-full h-[200px] object-cover rounded-md mt-2 border-[3px] border-white shadow-md'
                    />
                    <button
                      className='rounded-full bg-[#393053] text-white text-center py-2 px-5'
                      onClick={handleUploadImage}
                    >
                      Upload Image to firebase
                    </button>
                  </div>
                ) : (
                  <div className='flex gap-5 items-center'>
                    <input
                      type='file'
                      placeholder='Track Image'
                      onChange={(e) => setTrackImage(e.target.files[0])}
                      className='mt-2 border px-4 py-2 bg-[#443C68] text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm'
                    />
                    <button
                      className='rounded-full bg-[#393053] text-white text-center p-2 w-full'
                      onClick={handleGenerateImage}
                    >
                      Generate Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='mt-5 flex w-full'>
            <button
              className='rounded-full bg-[#393053] text-white text-center py-2 w-full'
              onClick={handleApproveMentorRequest}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveMentorModal;
