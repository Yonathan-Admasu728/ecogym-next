import { User as FirebaseUser } from 'firebase/auth';

// Program Types
export interface Trainer {
  id: number | string;
  profile_picture?: string;
  user?: {
    first_name?: string;
    last_name?: string;
  };
  specialties?: string[];
  bio?: string;
}

export interface SessionProgress {
  completed: boolean;
  completedAt?: Date;
  duration_watched?: number;
  last_position?: number;
}

export interface Session {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  duration: string;
  duration_seconds: number;
  video_url?: string | null;
  thumbnail?: string | null;
  order: number;
  difficulty_level: number;
  prerequisites?: string[];
  equipment_needed?: string[];
  key_learnings?: string[];
  progress?: SessionProgress;
  is_preview?: boolean;
  is_free?: boolean; // Indicates if this session is free
}

export interface ProgramProgress {
  started: boolean;
  startedAt?: Date;
  completed: boolean;
  completedAt?: Date;
  last_session_id?: string;
  completion_percentage: number;
  sessions_completed: number;
}

export interface Program {
  id: number | string;
  title: string;
  tagline?: string;
  description: string;
  full_description?: string;
  detailed_description?: string;
  thumbnail: string;
  thumbnailUrl?: string;
  duration: string;
  sessions: Session[];
  total_sessions?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  category: 'workout' | 'meditation' | 'Loading...';
  category_display?: string;
  subcategories?: string[];
  trainer?: Trainer;
  average_rating?: number;
  review_count?: number;
  price?: number | string;
  stripe_price_id?: string;
  is_free: boolean;
  isFree?: boolean; // Alias for is_free for backward compatibility
  progress?: ProgramProgress;
  program_type?: 'single_session' | 'multi_session_linear' | 'multi_session_flexible';
  freeSessionCount?: number;
  estimated_completion_days?: number;
  recommended_schedule?: {
    sessions_per_week: number;
    rest_days: number[];
  };
  features?: string[];
  learning_outcomes?: string[];
  prerequisites?: {
    fitness_level?: string;
    equipment?: string[];
    prior_experience?: string[];
  };
  community_features?: {
    has_community_chat?: boolean;
    has_trainer_qa?: boolean;
    has_progress_sharing?: boolean;
  };
  is_featured?: boolean;
  featured_order?: number;
  is_recommended?: boolean;
  purchased_by_user?: boolean;
  promotional_access?: boolean;
  tags?: string;
  created_at?: string;
  updated_at?: string;
  preview_video_url?: string | null;
}

// Component Props Types
export interface ProgramCardProps {
  program: Program;
  isFeatured: boolean;
  isAuthenticated: boolean;
  isPurchased: boolean;
  onExplore: (programId: string | number) => void;
  onQuickAddToFavorites: (programId: string | number) => void;
  onSignIn: () => void;
}

export interface SignInModalProps {
  onClose: () => void;
  onSignIn: () => void;
}

export interface SessionCardProps {
  session: Session;
  isLocked: boolean;
  isCompleted: boolean;
  onStart: (sessionId: string) => void;
  onContinue: (sessionId: string, lastPosition: number) => void;
}

export interface ProgramProgressStats {
  totalSessions: number;
  completedSessions: number;
  currentStreak: number;
  totalMinutesCompleted: number;
  averageSessionsPerWeek: number;
}

// Auth Types
export type User = FirebaseUser;

export interface AuthError {
  code?: string;
  message: string;
  name?: string;
}

// Payment Types
export interface PurchasedProgram extends Program {
  purchaseDate: string;
  accessType: 'purchase' | 'subscription' | 'trial';
}

export interface PaymentError {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
  message: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface PurchaseStatus {
  isPurchased: boolean;
  accessType: 'purchase' | 'subscription' | 'trial' | null;
}

export interface BulkPurchaseStatus {
  [programId: string]: {
    isPurchased: boolean;
    accessType: 'purchase' | 'subscription' | 'trial' | null;
  };
}

// Schema Types
export interface SchemaOrg {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

// Helper functions
export const toString = (id: string | number): string => id.toString();
export const toNumber = (id: string | number): number => typeof id === 'string' ? parseInt(id, 10) : id;
