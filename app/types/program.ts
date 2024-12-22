import { Program } from './index';

export interface ProgramResponse {
  program: Program;
}

export interface ProgramsResponse {
  programs: Program[];
}

export interface ProgramError {
  message: string;
  code?: string;
  status?: number;
}

export interface ProgramListResponse {
  programs: Program[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FeaturedProgramsResponse {
  programs: Program[];
}

export interface ProgramFilters {
  category?: string;
  level?: string;
  duration?: string;
  trainer?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProgramStats {
  totalViews: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
}

export interface UserPrograms {
  purchased_programs: Program[];
  favorite_programs: Program[];
  watch_later_programs: Program[];
}
