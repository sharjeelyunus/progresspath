import { Timestamp } from 'firebase/firestore';

export interface Details {
  id: string;
  title: string;
  link: string;
}

export interface UserType {
  email: string | null;
  uid: string | null;
  name: string | null;
  photoURL: string | null;
  username?: string;
  onboarding?: boolean;
  organization?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  metadata?: {
    creationTime: string;
    lastSignInTime: string;
  };
}

export interface TrainingsInterface {
  id: string;
  index: number;
  name: string;
  leadName: string;
  leadImage: string;
  slug: string;
  author: string;
  image?: string;
  completedTasksByUser?: number;
  userPoints?: number;
}

export interface TaskDetailsInterface {
  id: string;
  index: number;
  link: string;
  title: string;
}

export interface TaskInterface {
  id: string;
  day: number;
  taskName: string;
  details: TaskDetailsInterface[];
  trackId: string;
}

export interface UserTracks {
  id: string;
  trackId: string;
  timestamp: Timestamp;
}

export interface CompletedTasks {
  id: string;
  taskId: string;
  timestamp: Timestamp;
  codeLink?: string;
  liveLink?: string;
  postLink?: string;
  authorId?: string;
  points?: number;
}

export interface LeaderboardEntry {
  authorId: string;
  points: number;
  completedTasks: number;
}

export interface UserTasks {
  [authorId: string]: string[];
}

export interface TargetUser {
  email: string | null;
  uid: string | null;
  name: string | null;
  photoURL: string | null;
  username?: string;
  onboarding?: boolean;
  organization?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  metadata?: {
    creationTime: string;
    lastSignInTime: string;
  };
  tracks?: UserTracks[];
}
