import Link from 'next/link';
import Layout from '../components/Layout';

const HomePage = () => (
  <Layout title='Home | ProgressPath'>
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='font-bold text-5xl'>Welcome to ProgressPath 👋</h1>
      <Link href='/training' className='font-bold mt-5'>
        /training
      </Link>
    </div>
  </Layout>
);

export default HomePage;
