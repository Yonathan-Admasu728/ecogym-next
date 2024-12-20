import { User as FirebaseUser } from 'firebase/auth';

// Program Types
export interface Trainer {
  id: string;
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
  description: string;
  duration: string;
  duration_seconds: number;
  video_url?: string;
  thumbnail?: string;
  order: number;
  difficulty_level: number;
  prerequisites?: string[];
  equipment_needed?: string[];
  key_learnings?: string[];
  progress?: SessionProgress;
  is_preview?: boolean;
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
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  thumbnail: string;
  thumbnailUrl?: string;
  duration: string;
  total_sessions: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  category: string;
  subcategories?: string[];
  trainer?: Trainer;
  average_rating?: number;
  review_count?: number;
  ecoImpact?: string;
  price?: number;
  stripe_price_id?: string;
  isFree: boolean;
  sessions: Session[];
  progress?: ProgramProgress;
  program_type: 'single_session' | 'multi_session_linear' | 'multi_session_flexible';
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
}

// Component Props Types
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
