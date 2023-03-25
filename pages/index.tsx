// index.tsx
import HomePage from '../components/HomePage';
import { useAuth } from '../context/AuthContext';
import TrainingsHomePage from '../components/TrainingsHomePage';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const { loading, loggedInUser } = useAuth();
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    if (loggedInUser) {
      setLoadingStatus(false);
    } else if (!loading) {
      setLoadingStatus(false);
    }
  }, [loggedInUser, loading]);

  return (
    <>
      {loadingStatus ? (
        <div className='flex justify-center items-center text-white text-2xl bg-[#635985] py-28 min-h-screen'>
          Loading...
        </div>
      ) : (
        <>{!loggedInUser ? <HomePage /> : <TrainingsHomePage />}</>
      )}
    </>
  );
};

export default LandingPage;
