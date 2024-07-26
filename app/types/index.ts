// types/index.ts

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  displayName: string;
  metadata: {
    creationTime: string;
    lastLoginTime: string;
  };
  photoURL?: string;
  photo_url?: string;
}

export interface Trainer {
  id: string;
  user: User;
  bio: string;
  profile_picture: string;
}

export interface Session {
  id: number; 
  order: number;
  title: string;
  description: string;
  duration: number;
  video_url: string | null;
  audio_url: string | null;
  home_video_url: string | null;
  gym_video_url: string | null;
  has_gym_mode: boolean;
  is_free_trial: boolean;
}

export interface Program {
  trainer: Trainer;
  title: string;
  tagline: string;
  description: string;
  full_description: string;
  preview_video_url?: string;
  duration?: string;
  difficulty?: string;
  category: string;
  price: number;
  promotional_access: boolean;
  tags: string;
  created_at: string;
  updated_at: string;
  sessions: Session[];
  thumbnailUrl: string | null;
  thumbnail: string | null;
  is_featured: boolean;
  featured_order: number | null;
  review_count: number;
  average_rating: number;
  purchased_by_user?: boolean;
  id: number;
  isFavorite?: boolean;
  isWatchLater?: boolean;
  stripe_price_id: string;
}

export interface ProgramCardProps {
  program: Program;
  isFeatured: boolean;
  onExplore: (program: Program) => void;
  onToggleFavorite?: (programId: number) => void;
  onToggleWatchLater?: (programId: number) => void;
  isFavorite?: boolean;
  isWatchLater?: boolean;
  isPurchased?: boolean;
}

export interface Purchase {
  id: number;
  program: Program;
  amount: number;
  created_at: string;
}


export interface ProgramItem {
  id: number; // Change from string to number
  title: string;
  description: string;
  thumbnailUrl?: string;
  trainer: Trainer;
}

