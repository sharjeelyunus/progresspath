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

interface QueryParams {
  page: number;
  limit: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const queryParams = req.query as QueryParams;
    const page = Number(queryParams.page || 1);
    const limit = Number(queryParams.limit || 10);
    const offset = (page - 1) * limit;

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

    const paginatedLeaderboard = leaderboard.slice(offset, offset + limit);
    res.status(200).json({
      leaderboard: paginatedLeaderboard,
      totalCount: leaderboard.length,
      page,
      totalPages: Math.ceil(leaderboard.length / limit),
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
  tasks: CompletedTasks[],
  req: NextApiRequest
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
    const authorRef = doc(db, 'users', userTask.authorId);
    const authorSnapshot = await getDoc(authorRef);
    const authorData = authorSnapshot.data() as UserType;
    leaderboard.push({
      points,
      completedTasks: userTask.tasks,
      author: {
        uid: userTask.authorId,
        ...authorData,
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

  setCache('leaderboardData', leaderboard);

  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedLeaderboard = leaderboard.slice(startIndex, endIndex);

  return paginatedLeaderboard;
}

function isValidUrl(url: string): boolean {
  const urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return urlPattern.test(url);
}
