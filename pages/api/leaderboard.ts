// @ts-nocheck

import { NextApiRequest, NextApiResponse } from 'next';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CompletedTasks, LeaderboardEntry, UserTasks } from '../../interfaces';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const q = collectionGroup(db, 'completedTasks');
    const querySnapshot = await getDocs(q);
    const completedTasks: CompletedTasks[] = [];
    querySnapshot.forEach((doc) => {
      completedTasks.push({ ...doc.data(), id: doc.id } as CompletedTasks);
    });

    const leaderboard: LeaderboardEntry[] = mergeTasksByUser(completedTasks);
    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
        if (task.points) {
          points += task.points;
        } else {
          points += 5; // Add 5 points for each completed task
          if (task.codeLink && isValidUrl(task.codeLink)) {
            points += 5; // Add 5 points for valid codeLink
          }
          if (task.liveLink && isValidUrl(task.liveLink)) {
            points += 5; // Add 5 points for valid liveLink
          }
          if (task.postLink && isValidUrl(task.postLink)) {
            points += 5; // Add 5 points for valid postLink
          }
        }
      });
      return {
        authorId,
        points,
        completedTasks: tasks,
      };
    }
  );

  leaderboard.sort((a, b) => {
    if (a.points === b.points) {
      // Sort by number of completed tasks if points are equal
      if (a.completedTasks.length !== b.completedTasks.length) {
        return b.completedTasks.length - a.completedTasks.length;
      }
      // Sort by timestamp if number of completed tasks are equal
      return b.completedTasks[0].timestamp - a.completedTasks[0].timestamp;
    }
    return b.points - a.points;
  });

  return leaderboard;
}

function isValidUrl(url: string): boolean {
  const urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return urlPattern.test(url);
}
