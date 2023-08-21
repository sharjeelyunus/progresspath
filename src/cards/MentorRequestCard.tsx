import React, { useState } from 'react';
import { MentorRequests } from '../../interfaces';
import ApproveMentorModal from '../../modals/ApproveMentorModal';
import { AiFillLinkedin } from 'react-icons/ai';
import { AiFillGithub } from 'react-icons/ai';
import { AiOutlineTwitter } from 'react-icons/ai';
import { TbWorld } from 'react-icons/tb';

type Props = {
  request: MentorRequests;
};

const MentorRequestCard = ({ request }: Props) => {
  const [openApproveModal, setOpenApproveModal] = useState(false);
  return (
    <>
      <div className='bg-[#443C68] p-5 rounded-xl mt-5'>
        <h1 className='text-3xl font-bold text-center'>
          {request.trackName} ({request.trackType}) -{' '}
          <span className='font-normal text-lg'>({request.status})</span>
        </h1>
        <div className='lg:flex justify-between items-center gap-10'>
          <div className='lg:flex gap-5 items-center mt-5'>
            <div className='flex gap-5 items-center'>
              <img
                src={request.photoURL}
                alt={request.name}
                className='w-12 h-12 rounded-full'
              />
              <div className='min-w-[200px]'>
                <p className='font-bold text-lg'>{request.name}</p>
                <p>{request.areaOfExpertise}</p>
                <p>Experience: {request.yearsOfExperience} years</p>
                <div className='mt-5 flex gap-2'>
                  {request.linkedin && (
                    <a href={request.linkedin} target='_blank' rel='noreferrer'>
                      <AiFillLinkedin size={20} />
                    </a>
                  )}
                  {request.github && (
                    <a href={request.github} target='_blank' rel='noreferrer'>
                      <AiFillGithub size={20} />
                    </a>
                  )}
                  {request.twitter && (
                    <a href={request.twitter} target='_blank' rel='noreferrer'>
                      <AiOutlineTwitter size={20} />
                    </a>
                  )}
                  {request.portfolio && (
                    <a
                      href={request.portfolio}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <TbWorld size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className='lg:border lg:h-16'></div>
            <div className='min-w-[250px]'>
              <p className='font-bold text-lg'>Motivation</p>
              <p>{request.motivation}</p>
            </div>

            <div className='lg:border lg:h-16'></div>
            {request.trackShortDescription && (
              <div className='w-full'>
                <p className='font-bold text-lg'>Track Description</p>
                <p>{request.trackShortDescription}</p>
              </div>
            )}
            {request.trackSubType && (
              <>
                <div className='lg:border lg:h-16'></div>
                <div className='w-[300px]'>
                  <p className='font-bold text-lg'>Track Sub Type</p>
                  <p>{request.trackSubType}</p>
                </div>
              </>
            )}
          </div>
          <div className='flex justify-end mt-5 h-10'>
            <button
              className='bg-green-500 text-white px-5 py-2 rounded-md'
              onClick={() => setOpenApproveModal(true)}
            >
              Approve
            </button>
            <button className='bg-red-500 text-white px-5 py-2 rounded-md ml-5'>
              Reject
            </button>
          </div>
        </div>
      </div>
      {openApproveModal && (
        <ApproveMentorModal
          isOpen={openApproveModal}
          setIsOpen={setOpenApproveModal}
          request={request}
        />
      )}
    </>
  );
};

export default MentorRequestCard;
