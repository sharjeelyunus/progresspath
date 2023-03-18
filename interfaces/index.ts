export interface Details {
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
}
