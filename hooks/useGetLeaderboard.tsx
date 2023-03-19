// @ts-nocheck

import { collectionGroup, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { CompletedTasks, LeaderboardEntry, UserTasks } from '../interfaces';

export default function useGetLeaderboardData(): LeaderboardEntry[] {
  const [completedTasks, setCompletedTasks] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const syncData = async () => {
      const q = query(collectionGroup(db, 'completedTasks'));
      const unsub = onSnapshot(q, (docs) => {
        const docsArr = docs.docs;
        const allUserTracksData = docsArr.map((doc) => {
          return { ...doc.data(), id: doc.id } as CompletedTasks;
        });
        setCompletedTasks(mergeTasksByUser(allUserTracksData));
      });

      return unsub;
    };
    syncData();
  }, []);

  return completedTasks;
}

function mergeTasksByUser(tasks: CompletedTasks[]): LeaderboardEntry[] {
  const userTasks: UserTasks = {};
  tasks.forEach((task) => {
    const authorId = task.authorId;
    if (authorId in userTasks) {
      userTasks[authorId].push(task);
    } else {
      userTasks[authorId] = [task];
    }
  });

  const leaderboard: LeaderboardEntry[] = Object.entries(userTasks).map(
    ([authorId, tasks]) => {
      let points = 0;
      tasks.forEach((task) => {
        points += task.points ?? 10;
      });
      return { authorId, points, completedTasks: tasks.length };
    }
  );

  leaderboard.sort((a, b) => b.points - a.points);

  return leaderboard;
}
