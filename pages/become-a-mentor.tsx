import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const BecomeMentor = () => {
  const { loggedInUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [areaOfExpertise, setAreaOfExpertise] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [trackName, setTrackName] = useState('');
  const [trackShortDescription, setTrackShortDescription] = useState('');
  const [motivation, setMotivation] = useState('');
  const [trackType, setTrackType] = useState('new');
  const [trackSubType, setTrackSubType] = useState('public'); // ['public', 'invite-only', 'private'
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [portfolio, setPortfolio] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (!loggedInUser) {
      router.push('/');
    }

    setName(loggedInUser?.name);
    setEmail(loggedInUser?.email);
  }, []);

  const submitRequestBecomeMentor = async (e: any) => {
    e?.preventDefault();
    const mentorRequestsRef = collection(db, 'mentorRequests');
    const data = {
      userId: loggedInUser?.uid,
      name: name,
      email: email,
      areaOfExpertise: areaOfExpertise,
      yearsOfExperience: yearsOfExperience,
      trackName: trackName,
      trackShortDescription: trackShortDescription,
      motivation: motivation,
      status: 'pending',
      trackType: trackType,
      timestamp: Timestamp.now(),
      photoURL: loggedInUser?.photoURL,
      linkedin: linkedin,
      github: github,
      twitter: twitter,
      portfolio: portfolio,
      username: loggedInUser?.username,
      trackSubType: trackSubType,
    };

    try {
      await addDoc(mentorRequestsRef, data);
      toast.success('Request submitted successfully');
      router.push('/');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleBecomeMentor = async (e: any) => {
    e?.preventDefault();
    if (
      !name ||
      !email ||
      !areaOfExpertise ||
      !yearsOfExperience ||
      !trackName ||
      !trackShortDescription ||
      !motivation ||
      !trackType ||
      !linkedin
    ) {
      toast.error('Please fill all the fields');
      return;
    } else {
      await submitRequestBecomeMentor(e);
    }
  };

  return (
    <Layout title='Become a Mentor | ProgressPath'>
      <div className='py-24 flex flex-col items-center bg-[#272829] text-white min-h-screen px-10'>
        <h1 className='text-3xl font-semibold mb-6 mt-10 text-center'>
          Become a Mentor at <span className='underline'>ProgressPath</span> 🚀
        </h1>

        <form className='max-w-md w-full' onSubmit={handleBecomeMentor}>
          {/* Mentor Information */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Full Name
            </label>
            <input
              type='text'
              value={name}
              disabled
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#313233] border text-white cursor-not-allowed'
              placeholder='Your full name'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Email
            </label>
            <input
              type='email'
              disabled
              value={email}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#313233] border text-white cursor-not-allowed'
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
              value={areaOfExpertise}
              onChange={(e) => setAreaOfExpertise(e.target.value)}
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
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(+e.target.value)}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Number of years'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Do you want to mentor already existing track or create a new one?
            </label>
            <select
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              value={trackType}
              onChange={(e) => setTrackType(e.target.value)}
            >
              <option value='new'>New</option>
              <option value='existing'>Existing</option>
            </select>
          </div>

          {trackType === 'new' ? (
            <>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-300'>
                  Is this track public, invite only or private?
                </label>
                <select
                  className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
                  value={trackSubType}
                  onChange={(e) => setTrackSubType(e.target.value)}
                >
                  <option value='public'>Public</option>
                  <option value='invite-only'>Invite only</option>
                  <option value='private'>Private</option>
                </select>
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-300'>
                  Track you want to mentor?
                </label>
                <input
                  type='text'
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
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
                  value={trackShortDescription}
                  onChange={(e) => setTrackShortDescription(e.target.value)}
                  className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
                  placeholder='Write short description of what will be in this track?'
                />
              </div>
            </>
          ) : (
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-300'>
                Track you want to mentor?
              </label>
              <input
                type='text'
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
                placeholder='Track name you want to mentor'
              />
            </div>
          )}

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Why do you want to be a mentor?
            </label>
            <textarea
              rows={4}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Tell us your motivation...'
            />
          </div>

          {/* Social Links */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              LinkedIn
            </label>
            <input
              type='text'
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='LinkedIn profile link'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Github (Optional)
            </label>
            <input
              type='text'
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Github profile link'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Twitter (Optional)
            </label>
            <input
              type='text'
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Twitter profile link'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300'>
              Portfolio (Optional)
            </label>
            <input
              type='text'
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className='mt-1 p-2 w-full border-gray-300 rounded-md bg-[#272829] border text-white'
              placeholder='Portfolio link'
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
