import { Dialog, Transition } from '@headlessui/react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  trackId: string;
  trackSlug: string;
};

const EnrollModal = ({ trackId, trackSlug, isOpen, setIsOpen }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  function closeModal() {
    setIsOpen(false);
  }

  const handleCompleteTask = async () => {
    await setDoc(doc(db, 'users', user.uid, 'enrolledTracks', trackId), {
      trackId,
      timestamp: Timestamp.now(),
    });
    closeModal();
    router.push(`/${trackSlug}`);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-[#443C68] p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-white'
                  >
                    Enroll
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-white'>
                      Are you sure you want to enroll in this track?
                    </p>
                  </div>

                  <div className='mt-4 flex justify-end'>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium bg-[#18122B] text-white hover:bg-[#393053] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={handleCompleteTask}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EnrollModal;
