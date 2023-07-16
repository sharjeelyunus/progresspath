// @ts-nocheck

import { NextApiRequest, NextApiResponse } from 'next';
import { collectionGroup, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
  CompletedTasks,
  LeaderboardEntry,
  UserTasks,
  UserType,
} from '../../interfaces';
import { setCache } from '../../utils/cache';

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

    const leaderboard: LeaderboardEntry[] = await mergeTasksByUser(
      completedTasks,
      req
    );

    res.status(200).json({
      leaderboard: leaderboard,
      totalCount: leaderboard.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function usersWithCompletedTasks(
  tasks: CompletedTasks[]
): Promise<UserTasks[]> {
  const UsersWithCompletedTasks: UserTasks[] = [];
  tasks.forEach((task) => {
    const authorId = task.authorId;
    if (!authorId) {
      return;
    }
    const existingUserTasks = UsersWithCompletedTasks.find(
      (ut) => ut.authorId === authorId
    );
    if (existingUserTasks) {
      existingUserTasks.tasks.push(task);
    } else {
      UsersWithCompletedTasks.push({
        authorId: authorId,
        tasks: [task],
      });
    }
  });
  return UsersWithCompletedTasks;
}

async function mergeTasksByUser(
  tasks: CompletedTasks[]
): Promise<LeaderboardEntry[]> {
  const userTasks = await usersWithCompletedTasks(tasks);

  const leaderboard: LeaderboardEntry[] = [];
  for (const userTask of userTasks) {
    let points = 0;
    for (const task of userTask.tasks) {
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
    }

    leaderboard.push({
      points,
      completedTasks: userTask.tasks,
      author: {
        uid: userTask.authorId,
      },
    });
  }

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

  const top10 = leaderboard.slice(0, 10);
  const top10AuthorIds = top10.map((entry) => entry.author.uid);
  const top10AuthorDocs = await Promise.all(
    top10AuthorIds.map((id) => getDoc(doc(db, 'users', id)))
  );
  const top10Authors = top10AuthorDocs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
    } as UserType;
  });

  top10.forEach((entry) => {
    const author = top10Authors.find(
      (author) => author.uid === entry.author.uid
    );
    if (author) {
      entry.author = author;
    }
  });

  const top10WithRank = top10.map((entry, index) => {
    return {
      ...entry,
      rank: index + 1,
    };
  });

  setCache('leaderboardData', top10WithRank);
  return top10;
}

function isValidUrl(url: string): boolean {
  const urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return urlPattern.test(url);
}
