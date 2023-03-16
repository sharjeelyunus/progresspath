import Link from 'next/link';
import Layout from '../components/Layout';

const IndexPage = () => (
  <Layout title='Home | ProgressPath'>
    <div className='flex items-center justify-center h-screen'>
      <h1 className='font-bold text-5xl'>Welcome to ProgressPath 👋</h1>
    </div>
  </Layout>
);

export default IndexPage;
