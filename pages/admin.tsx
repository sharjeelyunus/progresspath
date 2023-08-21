import React from 'react';
import { useAuth } from '../context/AuthContext';
import Error404 from '../src/shared/components/Error404';
import Layout from '../components/Layout';
import useGetMentorRequests from '../hooks/useGetMentorRequests';
import MentorRequestCard from '../src/cards/MentorRequestCard';

const AdminPanel = () => {
  const { loggedInUser } = useAuth();

  if (!loggedInUser?.isAdmin) {
    return <Error404 />;
  }

  const mentorRequests = useGetMentorRequests();

  return (
    <Layout title='Admin Panel | ProgressPath'>
      <div className='text-white bg-[#272829] py-28 min-h-screen px-10'>
        {mentorRequests.map((request, index) => (
          <MentorRequestCard key={index} request={request} />
        ))}
      </div>
    </Layout>
  );
};

export default AdminPanel;
