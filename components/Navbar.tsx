import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';

const Navbar = () => {
  const { user, logout } = useAuth();
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
    <nav className='fixed w-full'>
      <Disclosure as='nav' className='bg-gray-800'>
        <>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='flex flex-1 items-center'>
                <Link href='/' className='flex flex-shrink-0 items-center'>
                  <svg
                    version='1.0'
                    xmlns='http://www.w3.org/2000/svg'
                    width='20.000000pt'
                    height='20.000000pt'
                    viewBox='0 0 500.000000 500.000000'
                    preserveAspectRatio='xMidYMid meet'
                  >
                    <g
                      transform='translate(0.000000,500.000000) scale(0.100000,-0.100000)'
                      fill='#ffffff'
                      stroke='none'
                    >
                      <path
                        d='M1904 4972 c-84 -40 -84 -117 -2 -302 31 -69 68 -153 83 -187 30 -67
66 -108 106 -118 35 -9 86 34 94 78 9 53 -12 378 -29 432 -9 29 -29 64 -46 80
-27 26 -39 30 -98 33 -50 2 -77 -2 -108 -16z'
                      />
                      <path
                        d='M3452 4808 c-11 -18 -29 -62 -40 -98 -11 -36 -41 -123 -67 -195 -61
-171 -67 -190 -63 -227 4 -41 46 -73 83 -64 72 18 215 201 309 398 l28 57 -22
46 c-30 61 -107 115 -167 115 -36 0 -44 -4 -61 -32z'
                      />
                      <path
                        d='M714 4211 c-20 -12 -43 -43 -63 -82 -33 -66 -39 -105 -18 -132 26
-35 449 -157 543 -157 58 0 74 12 74 54 0 69 -91 153 -277 254 -156 85 -204
97 -259 63z'
                      />
                      <path
                        d='M2420 3833 c-164 -19 -370 -88 -507 -170 -287 -173 -473 -523 -473
-887 0 -271 83 -510 267 -776 20 -29 124 -149 229 -265 187 -208 262 -353 272
-526 5 -108 -7 -152 -50 -170 -17 -7 -43 -30 -59 -52 -36 -50 -36 -74 -9 -391
24 -280 56 -427 104 -480 38 -42 111 -68 261 -91 263 -42 691 -6 785 65 22 17
26 37 57 276 19 143 36 329 39 414 6 151 6 156 -18 190 -13 19 -45 49 -71 65
-37 24 -49 39 -58 70 -31 111 34 358 127 482 13 17 24 34 24 38 0 3 51 74 114
158 181 244 228 322 286 487 93 262 91 557 -6 817 -102 274 -284 478 -541 607
-142 72 -270 111 -438 136 -67 9 -262 11 -335 3z m420 -104 c358 -74 624 -268
772 -564 119 -236 147 -540 73 -800 -29 -106 -117 -285 -179 -370 -25 -33 -55
-75 -68 -93 -13 -18 -39 -54 -59 -80 -127 -167 -197 -289 -245 -427 -21 -62
-28 -104 -32 -190 l-4 -111 -82 13 c-44 6 -95 12 -112 12 -39 1 -42 7 -50 118
-8 107 9 272 41 411 36 149 42 158 112 165 114 10 183 61 183 135 0 41 -49 82
-96 82 -63 0 -136 -45 -178 -111 -15 -25 -19 -26 -63 -18 -25 5 -48 11 -51 14
-3 2 11 22 31 44 55 61 70 97 71 172 0 57 -4 73 -28 109 -27 42 -90 79 -131
80 -11 0 -43 -11 -72 -24 -123 -58 -150 -224 -56 -337 35 -41 22 -51 -70 -57
l-75 -4 -27 60 c-60 135 -179 194 -260 131 -33 -27 -35 -93 -4 -133 31 -40
107 -89 173 -112 l60 -20 23 -70 c37 -109 56 -285 49 -449 -8 -203 -2 -190
-99 -204 -45 -6 -86 -11 -92 -11 -6 0 -10 45 -10 113 -1 125 -7 150 -71 282
-53 109 -95 165 -261 354 -201 226 -259 308 -326 456 -202 449 -109 938 233
1227 150 127 355 205 605 232 84 9 274 -3 375 -25z m-41 -1526 c31 -39 35 -69
17 -116 -19 -50 -72 -117 -92 -117 -23 0 -72 78 -79 125 -11 73 35 135 101
135 23 0 39 -8 53 -27z m-503 -184 c29 -18 74 -74 74 -93 0 -11 -71 33 -104
64 -16 16 -25 33 -22 39 10 15 13 14 52 -10z m814 -78 c0 -15 -28 -33 -65 -41
-44 -10 -45 4 -2 30 33 21 67 26 67 11z m-312 -107 c47 -14 61 -23 56 -34 -22
-57 -57 -197 -64 -260 -12 -91 -17 -261 -11 -350 l5 -65 -110 -3 -109 -3 0
223 c0 197 -3 236 -24 333 -13 61 -24 117 -25 125 -1 10 15 16 54 22 30 4 73
14 95 22 44 17 43 17 133 -10z m287 -821 c130 -36 175 -70 175 -129 0 -26 -1
-27 -47 -20 -265 38 -534 47 -718 25 -75 -9 -233 -45 -322 -74 -22 -7 -23 -5
-23 53 0 50 4 65 22 81 36 34 156 67 308 85 19 2 148 3 285 1 210 -3 261 -6
320 -22z m35 -218 c74 -9 136 -18 138 -19 1 -2 -1 -31 -5 -65 l-6 -63 -56 6
c-31 3 -162 9 -291 12 -262 7 -413 -6 -541 -48 -80 -25 -98 -45 -71 -77 l17
-20 100 24 c55 14 143 30 195 36 144 18 612 1 634 -22 4 -4 -13 -121 -19 -127
-2 -2 -20 2 -42 9 -58 18 -461 23 -547 7 -75 -14 -100 -34 -80 -65 10 -15 23
-17 85 -13 246 17 579 -2 579 -32 0 -6 -5 -50 -12 -99 -10 -80 -14 -89 -37
-98 -72 -28 -188 -43 -382 -48 -228 -6 -323 3 -449 43 -67 21 -78 28 -93 58
-19 40 -50 227 -68 400 -13 134 -18 123 71 157 59 23 161 44 280 58 108 14
443 6 600 -14z'
                      />
                      <path
                        d='M4610 3780 c-45 -14 -324 -149 -352 -170 -41 -30 -47 -66 -15 -97 35
-36 79 -40 236 -25 191 18 288 43 325 83 24 27 27 38 23 70 -7 52 -52 128 -83
140 -30 11 -99 11 -134 -1z'
                      />
                      <path
                        d='M275 3130 c-73 -8 -105 -18 -127 -38 -36 -31 -13 -186 34 -228 18
-17 39 -19 207 -19 195 1 266 11 385 56 63 23 74 43 52 91 -49 103 -306 167
-551 138z'
                      />
                      <path
                        d='M4306 2261 c-9 -10 -19 -35 -23 -55 -11 -71 68 -145 253 -236 205
-101 277 -103 335 -12 25 40 29 55 27 102 -3 52 -5 56 -38 72 -19 9 -91 33
-160 53 -69 21 -166 50 -215 66 -106 34 -155 37 -179 10z'
                      />
                      <path
                        d='M938 1936 c-135 -48 -312 -167 -339 -229 -16 -39 -5 -95 27 -129 23
-24 36 -28 78 -28 76 0 141 42 276 179 122 123 164 187 140 216 -19 23 -104
18 -182 -9z'
                      />
                    </g>
                  </svg>

                  <p className='text-white ml-5'>Progress Path</p>
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
                        src={user.photoURL}
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
                    <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      {/* <Menu.Item>
                      {({ active }) => (
                        <a
                          href={user.username}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href='#'
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Settings
                        </a>
                      )}
                    </Menu.Item> */}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700 w-full text-left'
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
