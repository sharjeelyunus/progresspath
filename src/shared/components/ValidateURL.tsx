import React from 'react';
import { isValidUrl } from '../../utils';

type Props = {
  url: string;
};

const ValidateURL = ({ url }: Props) => {
  return (
    <div className='flex justify-end'>
      <p
        className={`${
          url === '' || isValidUrl(url) ? 'text-white' : 'text-orange-600'
        }`}
      >
        {url === '' ? '' : isValidUrl(url) ? '' : 'Invalid URL'}
      </p>
    </div>
  );
};

export default ValidateURL;
