import { AxiosError } from 'axios';

import { Program } from '../types';
import {
  FeaturedProgramsResponse,
  ProgramError,
  ProgramFilters,
  ProgramListResponse,
  ProgramResponse,
  ProgramsResponse,
} from '../types/program';
import axiosInstance from '../utils/axiosConfig';
import { logger } from '../utils/logger';

export class ProgramServiceError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ProgramServiceError';
  }
}

export async function getAllPrograms(filters?: ProgramFilters): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<ProgramsResponse>('/programs', {
      params: filters,
    });
    return response.data.programs;
  } catch (error) {
    handleProgramError(error, 'get all programs');
    throw error;
  }
}

export async function getProgram(id: string): Promise<Program> {
  try {
    const response = await axiosInstance.get<ProgramResponse>(`/programs/${id}`);
    return response.data.program;
  } catch (error) {
    handleProgramError(error, 'get program');
    throw error;
  }
}

export async function getFeaturedPrograms(): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<FeaturedProgramsResponse>('/programs/featured');
    return response.data.programs;
  } catch (error) {
    handleProgramError(error, 'get featured programs');
    throw error;
  }
}

export async function searchPrograms(query: string): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<ProgramsResponse>('/programs/search', {
      params: { query },
    });
    return response.data.programs;
  } catch (error) {
    handleProgramError(error, 'search programs');
    throw error;
  }
}

export async function getPaginatedPrograms(page: number, limit: number): Promise<ProgramListResponse> {
  try {
    const response = await axiosInstance.get<ProgramListResponse>('/programs', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    handleProgramError(error, 'get paginated programs');
    throw error;
  }
}

export async function getProgramDetails(id: string): Promise<Program> {
  try {
    const response = await axiosInstance.get<ProgramResponse>(`/programs/${id}`);
    return response.data.program;
  } catch (error) {
    handleProgramError(error, 'get program details');
    throw error;
  }
}

export async function getFavorites(): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<ProgramsResponse>('/programs/favorites');
    return response.data.programs;
  } catch (error) {
    handleProgramError(error, 'get favorites');
    throw error;
  }
}

export async function addToFavorites(programId: number): Promise<void> {
  try {
    await axiosInstance.post(`/programs/${programId}/favorites`);
  } catch (error) {
    handleProgramError(error, 'add to favorites');
    throw error;
  }
}

export async function removeFromFavorites(programId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/programs/${programId}/favorites`);
  } catch (error) {
    handleProgramError(error, 'remove from favorites');
    throw error;
  }
}

export async function getWatchLater(): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<ProgramsResponse>('/programs/watch-later');
    return response.data.programs;
  } catch (error) {
    handleProgramError(error, 'get watch later');
    throw error;
  }
}

export async function addToWatchLater(programId: number): Promise<void> {
  try {
    await axiosInstance.post(`/programs/${programId}/watch-later`);
  } catch (error) {
    handleProgramError(error, 'add to watch later');
    throw error;
  }
}

export async function removeFromWatchLater(programId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/programs/${programId}/watch-later`);
  } catch (error) {
    handleProgramError(error, 'remove from watch later');
    throw error;
  }
}

export async function getPurchasedPrograms(): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<ProgramsResponse>('/programs/purchased');
    return response.data.programs;
  } catch (error) {
    handleProgramError(error, 'get purchased programs');
    throw error;
  }
}

function handleProgramError(error: unknown, context: string): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const errorData = error.response?.data as ProgramError | undefined;
    const message = errorData?.message ?? error.message;
    const code = error.code;

    logger.error(`Program Error: ${context}`, {
      status,
      message,
      code,
      url: error.config?.url,
    });

    throw new ProgramServiceError(
      `Failed to ${context}: ${message}`,
      status,
      code
    );
  }

  logger.error(`Unexpected error during ${context}`, error);
  throw new ProgramServiceError(`An unexpected error occurred while ${context}`);
}
