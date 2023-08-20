import React from 'react';
import { useAuth } from '../context/AuthContext';
import Error404 from '../src/shared/components/Error404';

const AdminPanel = () => {
  const { loggedInUser } = useAuth();

  if (!loggedInUser?.isAdmin) {
    return <Error404 />;
  }

  return <div>AdminPanel</div>;
};

export default AdminPanel;
