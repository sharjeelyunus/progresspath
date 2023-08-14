import { useEffect, useState, useMemo } from 'react';
import {
  getMemoryCache as getCache,
  setMemoryCache as setCache,
} from '../utils/cache';

export function useGetUserCompletedTasks(trackId: string, userId: string) {
  const [userTrackDetails, setUserTrackDetails] = useState(null);

  const cacheKey = useMemo(() => `${trackId}-${userId}`, [trackId, userId]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/userTrackDetails?trackId=${trackId}&userId=${userId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user track details');
      }

      const data = await response.json();
      setUserTrackDetails(data);
      setCache(cacheKey, data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      setUserTrackDetails(cachedData);
    } else {
      fetchData();
    }
  }, [trackId, userId, cacheKey]);

  return { ...userTrackDetails };
}
