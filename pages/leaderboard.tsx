import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LeaderboardCard from '../components/LeaderboardCard';
import usePagination from '../hooks/usePagination';

const Leaderboard = () => {
  const [leaderboardData, paginationData] = usePagination();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leaderboardData.length > 0) {
      setLoading(false);
    }
  }, [leaderboardData]);

  if (loading) {
    return (
      <Layout title='Loading... | ProgressPath'>
        <div className='flex justify-center items-center text-white bg-[#635985] py-28 min-h-screen'>
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title='Leaderboard | ProgressPath'>
      <div className='pt-24 flex flex-col items-center bg-[#635985] text-white min-h-screen'>
        <h1 className='font-bold text-2xl'>Leaderboard</h1>
        <div className='py-3'>
          {leaderboardData.map((entry, index) => (
            <LeaderboardCard
              key={entry.author.uid}
              rank={index + 1}
              author={entry.author}
              points={entry.points}
              completedTasks={entry.completedTasks.length}
            />
          ))}
        </div>
        {/* {leaderboardData.length > 0 && (
          <ul className='flex justify-center items-center mt-8 fixed bottom-8 w-full'>
            {paginationData.hasPrevPage && (
              <li className='relative block py-2 px-3 leading-tight bg-[#393053] border border-gray-300 text-white rounded-l hover:bg-[#18122B] cursor-pointer'>
                <a onClick={() => paginationData.prevPage()}>Previous</a>
              </li>
            )}
            {[...Array(paginationData.totalPages)].map((_, index) => (
              <li
                key={index}
                className={`${
                  index + 1 === paginationData.currentPage
                    ? 'bg-[#18122B] text-white'
                    : 'bg-[#443C68] text-white hover:bg-[#18122B]'
                } relative block py-2 px-3 leading-tight border border-gray-300 cursor-pointer`}
              >
                <a onClick={() => paginationData.goToPage(index + 1)}>
                  {index + 1}
                </a>
              </li>
            ))}
            {paginationData.hasNextPage && (
              <li className='relative block py-2 px-3 leading-tight bg-[#393053] border border-gray-300 text-white rounded-r hover:bg-[#18122B] cursor-pointer'>
                <a onClick={() => paginationData.nextPage()}>Next</a>
              </li>
            )}
          </ul>
        )} */}
      </div>
    </Layout>
  );
};

export default Leaderboard;
