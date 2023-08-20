import { Timestamp } from 'firebase/firestore';

export interface Details {
  id: string;
  title: string;
  link: string;
  type: string;
  index: number;
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
  mentorTracks?: string[];
  isAdmin?: boolean;
}

export interface MentorRequests {
  id: string;
  name: string;
  email: string;
  areaOfExpertise: string;
  motivation: string;
  status: string;
  trackName: string;
  trackShortDescription: string;
  userId: string;
  yearsOfExperience: string;
  trackType: string;
  timestamp: Timestamp;
  photoURL: string;
}

export interface TrainingsInterface {
  id: string;
  index: number;
  name: string;
  lead: UserType;
  slug: string;
  author: string;
  image?: string;
  completedTasksByUser?: CompletedTasks[];
  userPoints?: number;
}

export interface TaskDetailsInterface {
  id: string;
  index: number;
  link: string;
  title: string;
  type: string;
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
  review?: {
    reviewer: string;
    text: string;
  };
}

export interface LeaderboardEntry {
  author: UserType;
  points: number;
  completedTasks: CompletedTasks[];
  rank?: number;
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

export interface Review {
  TrackExperence: {
    rating: string;
    feedback: string;
  };
  PlatformExperience: {
    rating: string;
    feedback: string;
  };
  userId: string;
  trackId: string;
  timestamp: Timestamp;
}
