import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Logo from '../src/shared/components/Logo';

const Navbar = () => {
  const { loggedInUser, logout } = useAuth();
  const router = useRouter();

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <nav className='fixed w-full shadow-2xl'>
      <Disclosure as='nav' className='bg-gray-800'>
        <>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='flex flex-1 items-center'>
                <Link href='/'>
                  <Logo />
                </Link>
              </div>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-3'>
                  <div>
                    <Menu.Button className='flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                      <span className='sr-only'>Open user menu</span>
                      <img
                        className='h-8 w-8 rounded-full'
                        src={
                          loggedInUser.photoURL
                            ? loggedInUser.photoURL
                            : '/blank-profile-picture.svg'
                        }
                        alt=''
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      {loggedInUser.username && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={`/user/${loggedInUser.username}`}
                              className={classNames(
                                active ? 'bg-gray-900' : '',
                                'block px-4 py-2 text-sm text-white'
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href='/leaderboard'
                            className={classNames(
                              active ? 'bg-gray-900' : '',
                              'block px-4 py-2 text-sm text-white'
                            )}
                          >
                            Leaderboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href='/become-a-mentor'
                            className={classNames(
                              active ? 'bg-gray-900' : '',
                              'block px-4 py-2 text-sm text-white'
                            )}
                          >
                            Become a mentor
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? 'bg-gray-900' : '',
                              'block px-4 py-2 text-sm text-white w-full text-left'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      </Disclosure>
    </nav>
  );
};

export default Navbar;
