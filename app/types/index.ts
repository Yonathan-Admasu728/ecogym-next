import { User as FirebaseUser } from 'firebase/auth';

export interface Trainer {
  profile_picture?: string;
  user?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface Session {
  id: string;
  title: string;
  duration: string;
  video_url?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailUrl?: string;
  duration: string;
  level: string;
  category: string;
  trainer?: Trainer;
  average_rating?: number;
  review_count?: number;
  ecoImpact?: string;
  price?: number;
  stripe_price_id?: string;
  isFree: boolean;
  sessions?: Session[];
}

export type User = FirebaseUser;

export interface ProgramCardProps {
  program: Program;
  isFeatured: boolean;
  isAuthenticated: boolean;
  isPurchased: boolean;
  onExplore: (programId: string) => void;
  onQuickAddToFavorites: (programId: string) => void;
  onSignIn: () => void;
}

export interface SignInModalProps {
  onClose: () => void;
  onSignIn: () => void;
}

// Add any other types or interfaces you need here
