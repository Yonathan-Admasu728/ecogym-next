import { DailyPrompt, PromptCollection, UserStreak, PromptFilters } from '../types/dailyCompass';
import { AxiosError } from 'axios';
import axiosInstance from '../utils/axiosConfig';
import { logger } from '../utils/logger';

const API_BASE = '/daily-compass';  // Remove /api prefix since it's already in baseURL

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache: {
  todayPrompt?: CacheEntry<DailyPrompt>;
  userStreak?: CacheEntry<UserStreak>;
} = {};

// Helper function to check if cache is valid
const isCacheValid = <T>(entry?: CacheEntry<T>): boolean => {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_DURATION;
};
interface PromptEngagement {
  promptId: number;
  completed: boolean;
  reflection?: string;
  rating?: number;
  completedAt?: string;
}

export class DailyCompassService {
  static async getTodayPrompt(): Promise<DailyPrompt> {
    // Check cache first
    if (isCacheValid(cache.todayPrompt)) {
      logger.debug('Returning cached daily prompt');
      return cache.todayPrompt!.data;
    }

    try {
      logger.debug('Fetching daily prompt...');
      
      const isAuthenticated = !!window?.localStorage.getItem('user');
      const response = await axiosInstance.get(`${API_BASE}/today/`, {
        params: {
          includeEngagement: isAuthenticated
        }
      });
      
      logger.debug('Daily prompt raw response:', {
        status: response.status,
        data: response.data
      });
      
      if (!response.data || !response.data.id || !response.data.body) {
        throw new Error('Invalid prompt data received from server');
      }
      
      const prompt = response.data as DailyPrompt;
      
      // Update cache only if authenticated or no engagement data
      if (isAuthenticated || !prompt.userEngagement) {
        cache.todayPrompt = {
          data: prompt,
          timestamp: Date.now()
        };
      }
      
      logger.debug('Validated and cached daily prompt:', prompt);
      
      return prompt;
    } catch (error) {
      logger.error('Error fetching daily prompt:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw this.handleError(error);
    }
  }

  static async getPromptCollection(
    page: number = 1,
    filters: PromptFilters = {}
  ): Promise<PromptCollection> {
    try {
      const isAuthenticated = !!window?.localStorage.getItem('user');
      const response = await axiosInstance.get(`${API_BASE}/collection/`, {
        params: {
          page,
          includeEngagement: isAuthenticated,
          ...filters
        }
      });

      const collection = response.data as PromptCollection;
      
      // Ensure consistent engagement data structure
      collection.prompts = collection.prompts.map(prompt => {
        if (isAuthenticated && !prompt.userEngagement) {
          prompt.userEngagement = {
            completed: false,
            completedAt: undefined,
            reflection: undefined,
            rating: undefined,
            viewedAt: new Date().toISOString(),
            expanded: false
          };
        }
        return prompt;
      });

      return collection;
    } catch (error) {
      logger.error('Error fetching prompt collection:', error);
      throw this.handleError(error);
    }
  }

  static async getUserStreak(): Promise<UserStreak> {
    // Check cache first
    if (isCacheValid(cache.userStreak)) {
      logger.debug('Returning cached user streak');
      return cache.userStreak!.data;
    }

    try {
      const response = await axiosInstance.get(`${API_BASE}/streak/`);
      const streak = response.data as UserStreak;

      // Update cache
      cache.userStreak = {
        data: streak,
        timestamp: Date.now()
      };

      return streak;
    } catch (error) {
      logger.error('Error fetching user streak:', error);
      throw this.handleError(error);
    }
  }

  static async recordEngagement(engagement: PromptEngagement): Promise<void> {
    const isAuthenticated = !!window?.localStorage.getItem('user');
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to record engagement');
    }

    try {
      await axiosInstance.post(`${API_BASE}/${engagement.promptId}/engage/`, {
        ...engagement,
        completedAt: engagement.completed ? new Date().toISOString() : undefined
      });
      logger.debug('Engagement recorded successfully');
      
      // Invalidate all caches since engagement affects multiple views
      delete cache.todayPrompt;
      delete cache.userStreak;

      // Immediately fetch updated streak data to ensure UI reflects changes
      await this.getUserStreak().catch(error => {
        logger.error('Error fetching updated streak:', error);
      });
    } catch (error) {
      logger.error('Error recording engagement:', error);
      throw error;
    }
  }

  static async getFeaturedPrompts(): Promise<DailyPrompt[]> {
    try {
      const response = await axiosInstance.get(`${API_BASE}/featured/`);

      return response.data as DailyPrompt[];
    } catch (error) {
      logger.error('Error fetching featured prompts:', error);
      throw this.handleError(error);
    }
  }

  static async getPromptCategories(): Promise<string[]> {
    try {
      const response = await axiosInstance.get(`${API_BASE}/categories/`);

      return response.data as string[];
    } catch (error) {
      logger.error('Error fetching prompt categories:', error);
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): Error {
    if (error instanceof AxiosError) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.detail || error.response.statusText;
        
        if (status === 404) {
          return new Error('Daily prompt not found. Please try again later.');
        } else if (status === 401) {
          return new Error('Please sign in to access this feature.');
        } else if (status === 403) {
          return new Error('You do not have permission to access this feature.');
        } else if (status === 429) {
          return new Error('Too many requests. Please try again in a few minutes.');
        } else if (status >= 500) {
          return new Error('Server error. Please try again later.');
        }
        
        return new Error(`Server error: ${message}`);
      } else if (error.code === 'ECONNREFUSED') {
        return new Error('Unable to connect to the server. Please check if the backend is running.');
      }
    }
    return new Error('An unexpected error occurred. Please try again later.');
  }
}
