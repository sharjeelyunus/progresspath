import HomePage from '../components/HomePage';
import { useAuth } from '../context/AuthContext';
import TrainingsHomePage from '../components/TrainingsHomePage';

const LandingPage = () => {
  const { user } = useAuth();

  return <>{user ? <TrainingsHomePage /> : <HomePage />}</>;
};

export default LandingPage;
