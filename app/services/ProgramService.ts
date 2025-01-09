import { AxiosError } from 'axios';
import { logger } from '../utils/logger';
import { Program } from '../types';
import {
  ProgramFilters,
  ProgramListResponse,
} from '../types/program';
import axiosInstance from '../utils/axiosConfig';
import { programCache, CACHE_KEYS, CACHE_TTL, generateCacheKey, toCacheKeyParams } from '../utils/cache';

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

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = BASE_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0 || !(error instanceof AxiosError) || error.response?.status === 404) {
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
}

export async function getAllPrograms(filters?: ProgramFilters & { category?: string }): Promise<Program[]> {
  try {
    // Only use cache on the client side
    if (typeof window !== 'undefined') {
      const cacheKey = generateCacheKey('all_programs', filters ? toCacheKeyParams(filters) : undefined);
      const cachedData = programCache.get<Program[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const response = await retryWithBackoff(() => 
      axiosInstance.get<ProgramListResponse>('/api/programs/', { params: filters })
    );
    
    const programs = response.data.results;

    // Only cache on the client side
    if (typeof window !== 'undefined') {
      const cacheKey = generateCacheKey('all_programs', filters ? toCacheKeyParams(filters) : undefined);
      programCache.set(cacheKey, programs, CACHE_TTL.PROGRAM_DETAILS);
    }

    return programs;
  } catch (error) {
    logger.error('Error fetching all programs', { error });
    return []; // Return empty array instead of throwing
  }
}

export async function getProgram(id: string): Promise<Program | null> {
  try {
    const response = await axiosInstance.get<Program>(`${id}/`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching program', { error });
    return null;
  }
}

export async function getFeaturedPrograms(): Promise<Program[]> {
  try {
    // Only use cache on the client side
    if (typeof window !== 'undefined') {
      const cachedData = programCache.get<Program[]>(CACHE_KEYS.FEATURED_PROGRAMS);
      if (cachedData) {
        return cachedData;
      }
    }

    const response = await retryWithBackoff(() => 
      axiosInstance.get<Program[]>('programs/featured/')
    );
    
    const programs = response.data || [];

    // Only cache on the client side
    if (typeof window !== 'undefined') {
      programCache.set(CACHE_KEYS.FEATURED_PROGRAMS, programs, CACHE_TTL.FEATURED_PROGRAMS);
    }

    return programs;
  } catch (error) {
    logger.error('Error fetching featured programs', { error });
    return []; // Return empty array instead of throwing
  }
}

export async function getProgramsByCategory(category: string): Promise<Program[]> {
  try {
    logger.debug('Getting programs by category', { category });
    // Only use cache on the client side
    if (typeof window !== 'undefined') {
      const cacheKey = generateCacheKey('category_programs', toCacheKeyParams({ category }));
      const cachedData = programCache.get<Program[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    logger.debug('Making API request', { category: category.toLowerCase() });
    const response = await retryWithBackoff(() => 
      axiosInstance.get<ProgramListResponse>('programs/', {
        params: { category: category.toLowerCase() },
      })
    );
    
    const programs = response.data.results;
    logger.debug('Received programs', { programs });

    // Only cache on the client side
    if (typeof window !== 'undefined') {
      const cacheKey = generateCacheKey('category_programs', toCacheKeyParams({ category }));
      programCache.set(cacheKey, programs, CACHE_TTL.PROGRAM_DETAILS);
    }

    return programs;
  } catch (error) {
    logger.error('Error fetching programs by category', { error });
    return []; // Return empty array instead of throwing
  }
}

export async function searchPrograms(query: string): Promise<Program[]> {
  try {
    // Only use cache on the client side
    if (typeof window !== 'undefined') {
      const cacheKey = generateCacheKey('search_programs', toCacheKeyParams({ query }));
      const cachedData = programCache.get<Program[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const response = await retryWithBackoff(() => 
      axiosInstance.get<ProgramListResponse>('programs/', {
        params: { search: query },
      })
    );
    
    const programs = response.data.results;

    // Only cache on the client side
    if (typeof window !== 'undefined') {
      const cacheKey = generateCacheKey('search_programs', toCacheKeyParams({ query }));
      programCache.set(cacheKey, programs, 60); // 1 minute cache for search results
    }

    return programs;
  } catch (error) {
    logger.error('Error searching programs', { error });
    return []; // Return empty array instead of throwing
  }
}

export async function getPaginatedPrograms(page: number, limit: number): Promise<ProgramListResponse> {
  try {
    const response = await axiosInstance.get<ProgramListResponse>('programs/', {
      params: { page, page_size: limit },
    });
    return response.data;
  } catch (error) {
    logger.error('Error fetching paginated programs', { error });
    // Return empty response that matches ProgramListResponse type
    return {
      results: [],
      total: 0,
      page: 1,
      page_size: limit,
      total_pages: 0
    };
  }
}

export async function getProgramDetails(id: string): Promise<Program | null> {
  try {
    // Only use cache on the client side
    if (typeof window !== 'undefined') {
      const cacheKey = CACHE_KEYS.PROGRAM_DETAILS(id);
      const cachedData = programCache.get<Program>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const response = await retryWithBackoff(() => 
      axiosInstance.get<Program>(`programs/${id}/`)
    );
    
    const program = response.data;

    // Only cache on the client side
    if (typeof window !== 'undefined') {
      const cacheKey = CACHE_KEYS.PROGRAM_DETAILS(id);
      programCache.set(cacheKey, program, CACHE_TTL.PROGRAM_DETAILS);
    }

    return program;
  } catch (error) {
    logger.error('Error fetching program details', { error });
    return null;
  }
}

export async function getFavorites(): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<ProgramListResponse>('programs/favorites/');
    return response.data.results;
  } catch (error) {
    logger.error('Error fetching favorites', { error });
    return []; // Return empty array instead of throwing
  }
}

export async function addToFavorites(programId: number): Promise<void> {
  try {
    await axiosInstance.post(`programs/${programId}/favorites`);
  } catch (error) {
    logger.error('Error adding to favorites', { error });
    // Don't throw, just log the error
  }
}

export async function removeFromFavorites(programId: number): Promise<void> {
  try {
    await axiosInstance.delete(`programs/${programId}/favorites`);
  } catch (error) {
    logger.error('Error removing from favorites', { error });
    // Don't throw, just log the error
  }
}

export async function getWatchLater(): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<ProgramListResponse>('programs/watch-later/');
    return response.data.results;
  } catch (error) {
    logger.error('Error fetching watch later', { error });
    return []; // Return empty array instead of throwing
  }
}

export async function addToWatchLater(programId: number): Promise<void> {
  try {
    await axiosInstance.post(`programs/${programId}/watch-later`);
  } catch (error) {
    logger.error('Error adding to watch later', { error });
    // Don't throw, just log the error
  }
}

export async function removeFromWatchLater(programId: number): Promise<void> {
  try {
    await axiosInstance.delete(`programs/${programId}/watch-later`);
  } catch (error) {
    logger.error('Error removing from watch later', { error });
    // Don't throw, just log the error
  }
}

export async function getPurchasedPrograms(): Promise<Program[]> {
  try {
    const response = await axiosInstance.get<ProgramListResponse>('programs/purchased/');
    return response.data.results;
  } catch (error) {
    logger.error('Error fetching purchased programs', { error });
    return []; // Return empty array instead of throwing
  }
}
