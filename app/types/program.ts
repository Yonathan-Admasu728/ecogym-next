import { Program as BaseProgram, Session as BaseSession } from './index';

// Re-export all types from index.ts
export type {
  Program,
  Session,
  Trainer,
  SessionProgress,
  ProgramProgress,
  ProgramCardProps,
  SignInModalProps,
  SessionCardProps,
  ProgramProgressStats,
  SchemaOrg
} from './index';

// Additional types specific to program handling
export interface UserPrograms {
  purchased_programs: BaseProgram[];
  favorite_programs: BaseProgram[];
  watch_later_programs: BaseProgram[];
  in_progress?: BaseProgram[];  // Make in_progress optional
}

export interface ProgramListResponse {
  results: BaseProgram[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProgramsResponse {
  results: BaseProgram[];
}

export interface FeaturedProgramsResponse {
  results: BaseProgram[];
}

export interface ProgramResponse {
  program: BaseProgram;
}

export interface ProgramError {
  message: string;
  code?: string;
}

export interface ProgramFilters {
  category?: string;
  level?: string;
  isFree?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  [key: string]: string | number | boolean | undefined;
}

export const isFreeProgram = (program: BaseProgram): boolean => {
  return program.isFree === true && (program.price === 0 || program.price === undefined);
};

export const getFreeSessionCount = (program: BaseProgram): number => {
  if (program.isFree) return program.sessions.length; // All sessions are free
  return program.freeSessionCount ?? 1; // Default to 1 free session if not specified
};

export const isSessionFree = (program: BaseProgram, session: BaseSession): boolean => {
  if (program.isFree) return true; // All sessions are free
  if (session.is_free) return true; // Explicitly marked as free
  
  // For non-free programs, first N sessions are free (where N is freeSessionCount)
  const freeCount = getFreeSessionCount(program);
  return session.order <= freeCount;
};

export const validateProgram = (program: BaseProgram): void => {
  if (program.isFree && program.price && Number(program.price) > 0) {
    throw new Error('Free program must have price set to 0');
  }
  
  if (program.isFree && program.stripe_price_id) {
    throw new Error('Free program cannot have a Stripe price ID');
  }
  
  if (!program.isFree && !program.stripe_price_id) {
    throw new Error('Paid program must have a Stripe price ID');
  }

  if (program.freeSessionCount && program.freeSessionCount < 0) {
    throw new Error('Free session count cannot be negative');
  }

  if (program.freeSessionCount && program.freeSessionCount > program.sessions.length) {
    throw new Error('Free session count cannot exceed total sessions');
  }
};

export type ProgramStatus = 'free' | 'purchased' | 'partially_free' | 'available';

export const getProgramStatus = (
  program: BaseProgram,
  isPurchased: boolean
): ProgramStatus => {
  if (program.isFree) return 'free';
  if (isPurchased) return 'purchased';
  if (getFreeSessionCount(program) > 0) return 'partially_free';
  return 'available';
};
