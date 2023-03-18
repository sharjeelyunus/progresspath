import Link from 'next/link';
import HomePage from '../components/HomePage';
import { useAuth } from '../context/AuthContext';
import Training from './training';

const LandingPage = () => {
  const { user } = useAuth();

  return <>{user ? <Training /> : <HomePage />}</>;
};

export default LandingPage;
