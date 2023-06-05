import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../interfaces';
// import { getCache, setCache } from '../utils/cache';

export default function useGetLeaderboardData(
  initialPage: number = 1,
  itemsPerPage: number = 10
): [LeaderboardEntry[]] {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  // const [paginationData, setPaginationData] = useState<PaginationData>({
  //   currentPage: initialPage,
  //   itemsPerPage,
  // });

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(`/api/leaderboard`);
      const data = await response.json();
      setLeaderboardData(data.leaderboard);
      // setCache('leaderboardData', data.leaderboard); // cache the fetched data
    } catch (error) {
      throw new Error('Failed to fetch leaderboard data');
    }
  };

  // const changePage = (pageNumber: number) => {
  //   setPaginationData((prevPaginationData) => ({
  //     ...prevPaginationData,
  //     currentPage: pageNumber,
  //   }));
  // };

  useEffect(() => {
    // const cachedData = getCache<LeaderboardEntry[]>('leaderboardData'); // check if there is cached data
    // if (cachedData) {
    //   setLeaderboardData(cachedData); // set the cached data if available
    // } else {
    fetchLeaderboardData().catch((error) => console.error(error.message)); // fetch data if there is no cached data
    // }
  }, []);

  // Calculate the start and end index of the items to display based on the current page and items per page
  // const startIndex =
  //   (paginationData.currentPage - 1) * paginationData.itemsPerPage;
  // const endIndex = startIndex + paginationData.itemsPerPage;

  return [
    leaderboardData,
    // paginationData,
    // changePage,
  ];
}
