import React, { useEffect, useState } from 'react';
import { db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  trackId: string;
  trackImage: string;
  trackName: string;
};

const UploadTrackImageModal = ({
  isOpen,
  setIsOpen,
  trackId,
  trackImage,
  trackName,
}: Props) => {
  const [updatedImage, setUpdatedImage] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string>('');

  useEffect(() => {
    // Preview Selected Image
    if (!updatedImage) {
      setImagePreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(updatedImage);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [updatedImage]);

  const handleOnClose = (e: any) => {
    if (e.target.id === 'container') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  let loadingToastId;

  const updateLoadingToast = (progress) => {
    if (loadingToastId) {
      toast.dismiss(loadingToastId);
    }
    loadingToastId = toast.loading(`Uploading ${progress.toFixed(0)}%`);
  };

  const handleUploadImage = async () => {
    const storageRef = ref(storage, `Tracks/${trackName}-image`);
    const uploadTask = uploadBytesResumable(storageRef, updatedImage);
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
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadedImage(downloadURL);
          toast.dismiss(loadingToastId);
        });
      }
    );
  };

  const updateTrackImage = async () => {
    const trackRef = doc(db, 'trainings', trackId);
    try {
      await updateDoc(trackRef, {
        image: uploadedImage,
      });
      toast.success('Image updated successfully');
    } catch (error) {
      toast.error('Error updating track image');
    }

    setIsOpen(false);
  };

  return (
    <div
      onClick={handleOnClose}
      id='container'
      className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50'
    >
      <div className='bg-gray-800 mt-[-71px] overflow-y-scroll lg:overflow-y-hidden lg:mt-0 lg:px-0 lg:py-0 rounded-3xl shadow-2xl'>
        <div className='flex flex-col w-[350px] lg:w-[500px] justify-center items-center py-6 lg:px-8 px-4'>
          <div className='w-full'>
            <div>
              <h2 className='text-white font-bold text-lg text-center'>
                Upload Track Image!
              </h2>
            </div>
            <div className='mt-2'>
              <div className='py-3'>
                {imagePreview ? (
                  <div>
                    <img
                      className='rounded-[10px] w-full'
                      src={imagePreview}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <div className='relative'>
                    <img
                      className='relative rounded-[10px] w-full'
                      src={trackImage}
                      style={{ objectFit: 'contain' }}
                    />
                    <button
                      onClick={() => {
                        let input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/png, image/jpeg';
                        input.onchange = () => {
                          let files = Array.from(input.files || []);
                          setUpdatedImage(files[0]);
                        };
                        input.click();
                      }}
                      className='absolute top-0 left-0 text-2xl text-black/80 rounded-[10px] p-5 w-full h-full bg-[#C4C4C4] opacity-70'
                    >
                      <div className='w-full flex items-center justify-center'>
                        <svg
                          width='78'
                          height='78'
                          viewBox='0 0 78 78'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M31.6877 42.25C31.6877 38.2114 34.9616 34.9375 39.0002 34.9375C43.0388 34.9375 46.3127 38.2114 46.3127 42.25C46.3127 46.2886 43.0388 49.5625 39.0002 49.5625C34.9616 49.5625 31.6877 46.2886 31.6877 42.25Z'
                            fill='white'
                          />
                          <path
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M24.2896 24.838C24.2896 19.1975 28.8621 14.625 34.5025 14.625H43.4977C49.1381 14.625 53.7106 19.1975 53.7106 24.838C53.7106 24.8862 53.7477 24.9263 53.7957 24.9302L61.0419 25.5187C64.2878 25.7823 66.9572 28.1826 67.5631 31.3823C69.109 39.5473 69.2243 47.9188 67.9037 56.1233L67.5877 58.0869C66.9919 61.7884 63.9455 64.6045 60.2087 64.9079L53.8961 65.4206C43.9818 66.2258 34.0185 66.2258 24.1041 65.4206L17.7916 64.9079C14.0548 64.6045 11.0083 61.7884 10.4125 58.0869L10.0965 56.1233C8.7759 47.9188 8.89118 39.5473 10.4372 31.3823C11.043 28.1826 13.7124 25.7823 16.9583 25.5187L24.2045 24.9302C24.2526 24.9263 24.2896 24.8862 24.2896 24.838ZM39.0002 30.0625C32.2692 30.0625 26.8127 35.519 26.8127 42.25C26.8127 48.981 32.2692 54.4375 39.0002 54.4375C45.7312 54.4375 51.1877 48.981 51.1877 42.25C51.1877 35.519 45.7312 30.0625 39.0002 30.0625Z'
                            fill='white'
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!uploadedImage ? (
            <div className='mt-5 flex w-full items-center'>
              <button
                className='rounded-full bg-gray-900 text-white text-center py-2 w-full'
                onClick={handleUploadImage}
              >
                Upload Image to Firebase
              </button>
            </div>
          ) : (
            <div className='mt-5 flex w-full items-center'>
              <button
                className='rounded-full bg-gray-900 text-white text-center py-2 w-full'
                onClick={updateTrackImage}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadTrackImageModal;
