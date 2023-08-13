import React, { useState } from 'react';

const useGetUserReviews = ({ id }) => {
  const [reviewed, setReviewed] = useState(false);
  return reviewed;
};

export default useGetUserReviews;
