import { AxiosError } from 'axios';

import { Program } from '../types';
import axiosInstance from './axiosConfig';
import { logger } from './logger';

export interface UserPrograms {
  purchased_programs: Program[];
  favorite_programs: Program[];
  watch_later_programs: Program[];
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: unknown, context: string): never => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const code = error.code;

    logger.error(`API Error: ${context}`, {
      status,
      message,
      code,
      url: error.config?.url
    });

    throw new ApiError(
      `Failed to ${context}: ${message}`,
      status,
      code
    );
  }

  logger.error(`Unexpected error during ${context}`, error);
  throw new ApiError(`An unexpected error occurred while ${context}`);
};

export const getProgram = async (programId: string): Promise<Program> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Program>>(`/programs/${programId}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error, `fetch program ${programId}`);
  }
};

export const fetchUserPrograms = async (): Promise<UserPrograms> => {
  try {
    const response = await axiosInstance.get<ApiResponse<UserPrograms>>('/user/programs');
    return response.data.data;
  } catch (error) {
    return handleApiError(error, 'fetch user programs');
  }
};

export const fetchFeaturedPrograms = async (): Promise<Program[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Program[]>>('/programs/featured');
    return response.data.data;
  } catch (error) {
    return handleApiError(error, 'fetch featured programs');
  }
};

export const fetchRecommendedPrograms = async (): Promise<Program[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Program[]>>('/programs/recommended');
    return response.data.data;
  } catch (error) {
    return handleApiError(error, 'fetch recommended programs');
  }
};

export const fetchPrograms = async (): Promise<Program[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Program[]>>('/programs');
    return response.data.data;
  } catch (error) {
    return handleApiError(error, 'fetch programs');
  }
};

export const fetchProgramsByCategory = async (category: string): Promise<Program[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Program[]>>(`/programs?category=${encodeURIComponent(category)}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error, `fetch ${category} programs`);
  }
};

export const toggleFavorite = async (programId: number): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse<void>>(`/user/favorites/toggle/${programId}`);
    if (response.status !== 200) {
      throw new ApiError('Failed to toggle favorite', response.status);
    }
    logger.info('Successfully toggled favorite', { programId });
  } catch (error) {
    handleApiError(error, `toggle favorite for program ${programId}`);
  }
};

export const toggleWatchLater = async (programId: number): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse<void>>(`/user/watch-later/toggle/${programId}`);
    if (response.status !== 200) {
      throw new ApiError('Failed to toggle watch later', response.status);
    }
    logger.info('Successfully toggled watch later', { programId });
  } catch (error) {
    handleApiError(error, `toggle watch later for program ${programId}`);
  }
};

// Search programs
export const searchPrograms = async (query: string): Promise<Program[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Program[]>>(`/programs/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    return handleApiError(error, `search programs with query: ${query}`);
  }
};

// Update program progress
export const updateProgramProgress = async (programId: number, progress: number): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse<void>>(`/user/programs/${programId}/progress`, { progress });
    if (response.status !== 200) {
      throw new ApiError('Failed to update program progress', response.status);
    }
    logger.info('Successfully updated program progress', { programId, progress });
  } catch (error) {
    handleApiError(error, `update progress for program ${programId}`);
  }
};

// Rate program
export const rateProgram = async (programId: number, rating: number): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse<void>>(`/programs/${programId}/rate`, { rating });
    if (response.status !== 200) {
      throw new ApiError('Failed to rate program', response.status);
    }
    logger.info('Successfully rated program', { programId, rating });
  } catch (error) {
    handleApiError(error, `rate program ${programId}`);
  }
};
