import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../interfaces';
import { getCache, setCache } from '../utils/cache';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  goToPage: (page: number) => void;
}

export default function usePagination(): [LeaderboardEntry[], PaginationData] {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const PAGE_SIZE = 10;

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      if (Array.isArray(data.leaderboard)) {
        const sortedData = [...data.leaderboard].sort(
          (a, b) => b.points - a.points
        );
        setLeaderboardData(sortedData);
        setTotalPages(Math.ceil(sortedData.length / PAGE_SIZE));
        setCache('leaderboardData', sortedData); // cache the fetched data
      } else {
        throw new Error('Leaderboard data is not an array.');
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  useEffect(() => {
    const cachedData = getCache<LeaderboardEntry[]>('leaderboardData'); // check if there is cached data
    if (cachedData) {
      const sortedData = [...cachedData].sort((a, b) => b.points - a.points);
      setLeaderboardData(sortedData); // set the cached data if available
      setTotalPages(Math.ceil(sortedData.length / PAGE_SIZE));
    } else {
      fetchLeaderboardData(); // fetch data if there is no cached data
    }
  }, []);

  const currentData = leaderboardData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginationData = {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasPrevPage,
    hasNextPage,
    goToPage,
  };

  return [currentData, paginationData];
}
