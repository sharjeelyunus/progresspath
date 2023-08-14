import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import useGetTargetTrack from '../../hooks/useGetTargetTrack';
import Logo from '../../src/shared/components/Logo';

const GenerateCertificate = () => {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const { userId, trackId } = router.query;

  const trackDetails = useGetTargetTrack(trackId as string);

  const generateCertificate = () => {
    const certificateContainer = document.getElementById(
      'certificate-container'
    );

    html2canvas(certificateContainer).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', [900, 600]);
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 277);
      pdf.save('certificate.pdf');
    });
  };

  if (!loggedInUser || !userId || !trackId || loggedInUser.uid !== userId) {
    return (
      <Layout title='Error 404 | ProgressPath'>
        <div className='flex justify-center items-center text-white bg-[#635985] py-28 min-h-screen'>
          <h1 className='text-2xl'>Error 404</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title='Generate Certificate | ProgressPath'>
      <div className='flex justify-center items-center bg-[#635985] h-screen'>
        <div className='mt-[100px] flex gap-10 justify-center items-center'>
          <div
            className='bg-gray-800 text-white p-10 w-[900px] h-[600px]'
            id='certificate-container'
          >
            <Logo />
            <div className=''>
              <h2 className='font-bold text-3xl mt-10'>PROOF OF COMPLETION</h2>
              <p className='my-3 text-lg italic'>Congratulations to</p>
              <h1 className='text-4xl font-semibold'>{loggedInUser?.name}</h1>
              <p className='mt-3 text-lg italic'>for successfully completing</p>
              <p className='font-bold text-2xl my-1'>{trackDetails?.name}</p>
              <p className='text-lg'>interactive track on ProgressPath.</p>
              <p className='mt-5 italic text-gray-300'>
                This certificate signifies that recipient has an exemplary level
                of {trackDetails?.name} proficiency.
              </p>

              <div className='text-center'>
                {trackDetails?.lead?.name !== 'Sharjeel Yunus' ? (
                  <div className='flex justify-between mt-16'>
                    <div className='flex flex-col'>
                      <span id='signature' className='font-bestermind text-3xl'>
                        Sharjeel Yunus
                      </span>
                      <div className='flex mt-2'>
                        <div className='border-b-2 border-white w-[200px]'></div>
                      </div>
                      <div className='mt-2'>
                        <p>Sharjeel Yunus</p>
                        <p className='font-bold'>Founder ProgressPath</p>
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <span id='signature' className='font-bestermind text-3xl'>
                        {trackDetails?.lead?.name}
                      </span>
                      <div className='flex mt-2'>
                        <div className='border-b-2 border-white w-[200px]'></div>
                      </div>
                      <div className='mt-2'>
                        <p>{trackDetails?.lead?.name}</p>
                        <p className='font-bold'>Track Lead</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='flex justify-end mt-16'>
                    <div className='flex flex-col'>
                      <span id='signature' className='font-bestermind text-3xl'>
                        {trackDetails?.lead?.name}
                      </span>
                      <div className='flex mt-2'>
                        <div className='border-b-2 border-white w-[200px]'></div>
                      </div>
                      <div className='mt-2'>
                        <p>{trackDetails?.lead?.name}</p>
                        <p className='font-bold'>Track Lead</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default GenerateCertificate;
