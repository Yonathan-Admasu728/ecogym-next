import useSWR from 'swr';

import {
  getFeaturedPrograms,
  getRecommendedPrograms,
  getPurchasedPrograms,
  getProgramDetails,
  getFavorites,
  getWatchLater,
  addToFavorites as addToFavoritesService,
  removeFromFavorites as removeFromFavoritesService,
  addToWatchLater as addToWatchLaterService,
  removeFromWatchLater as removeFromWatchLaterService,
} from '../services/ProgramService';
import { Program } from '../types';
import { logger } from '../utils/logger';

interface UseProgramsOptions {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
}

const defaultOptions: UseProgramsOptions = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0, // No automatic refresh by default
};

// Helper function to create a placeholder program with all required fields
const createPlaceholderProgram = (id: string): Program => ({
  id,
  title: 'Loading...',
  description: 'Loading program details...',
  detailed_description: '',
  thumbnail: '/images/placeholder-program.svg',
  thumbnailUrl: '/images/placeholder-program.svg',
  duration: '0 min',
  total_sessions: 0,
  level: 'All Levels',
  category: 'Loading...',
  isFree: false,
  sessions: [],
  program_type: 'single_session',
  trainer: {
    id: '0',
    profile_picture: '/images/placeholder-avatar.svg',
    user: {
      first_name: 'Loading',
      last_name: '...'
    }
  },
  progress: {
    started: false,
    completed: false,
    completion_percentage: 0,
    sessions_completed: 0
  },
  community_features: {
    has_community_chat: false,
    has_trainer_qa: false,
    has_progress_sharing: false
  },
  prerequisites: {
    fitness_level: 'Beginner',
    equipment: [],
    prior_experience: []
  },
  features: [],
  learning_outcomes: [],
  estimated_completion_days: 0,
  recommended_schedule: {
    sessions_per_week: 0,
    rest_days: []
  }
});

export function useFeaturedPrograms(options: UseProgramsOptions = defaultOptions) {
  const { data, error, mutate } = useSWR<Program[]>(
    'featured-programs',
    getFeaturedPrograms,
    {
      revalidateOnFocus: options.revalidateOnFocus,
      revalidateOnReconnect: options.revalidateOnReconnect,
      refreshInterval: options.refreshInterval,
      dedupingInterval: 3600000, // 1 hour deduping for featured programs
    }
  );

  return {
    programs: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useRecommendedPrograms(options: UseProgramsOptions = defaultOptions) {
  const { data, error, mutate } = useSWR<Program[], Error>(
    'recommended-programs',
    getRecommendedPrograms,
    {
      revalidateOnFocus: options.revalidateOnFocus,
      revalidateOnReconnect: options.revalidateOnReconnect,
      refreshInterval: options.refreshInterval,
      dedupingInterval: 60000, // 1 minute deduping for recommended programs,
      fallbackData: [] // Provide a default value to avoid null/undefined
    }
  );

  return {
    programs: data ?? [], // Use nullish coalescing instead of logical OR
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function usePurchasedPrograms(options: UseProgramsOptions = defaultOptions) {
  const { data, error, mutate } = useSWR<Program[]>(
    'purchased-programs',
    getPurchasedPrograms,
    {
      revalidateOnFocus: options.revalidateOnFocus,
      revalidateOnReconnect: options.revalidateOnReconnect,
      refreshInterval: options.refreshInterval,
    }
  );

  return {
    programs: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useProgramDetails(programId: string | number, options: UseProgramsOptions = defaultOptions) {
  const stringId = programId.toString();
  
  const { data, error, mutate } = useSWR<Program | null>(
    stringId ? `program-${stringId}` : null,
    () => getProgramDetails(stringId),
    {
      revalidateOnFocus: options.revalidateOnFocus,
      revalidateOnReconnect: options.revalidateOnReconnect,
      refreshInterval: options.refreshInterval,
      dedupingInterval: 3600000, // 1 hour deduping for program details
    }
  );

  return {
    program: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useUserPrograms(options: UseProgramsOptions = defaultOptions) {
  const { data: favorites, error: favoritesError, mutate: mutateFavorites } = useSWR<Program[]>(
    'user-favorites',
    getFavorites,
    {
      revalidateOnFocus: options.revalidateOnFocus,
      revalidateOnReconnect: options.revalidateOnReconnect,
      refreshInterval: options.refreshInterval,
    }
  );

  const { data: watchLater, error: watchLaterError, mutate: mutateWatchLater } = useSWR<Program[]>(
    'user-watch-later',
    getWatchLater,
    {
      revalidateOnFocus: options.revalidateOnFocus,
      revalidateOnReconnect: options.revalidateOnReconnect,
      refreshInterval: options.refreshInterval,
    }
  );

  const addToFavorites = async (programId: string | number) => {
    const numericId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    const program = favorites?.find(p => p.id === programId.toString());
    
    // Optimistic update with existing program data if available
    const optimisticData = [...(favorites || [])];
    if (program) {
      optimisticData.push(program);
    } else {
      optimisticData.push(createPlaceholderProgram(programId.toString()));
    }
    
    try {
      mutateFavorites(optimisticData, false);
      await addToFavoritesService(numericId);
      await mutateFavorites(); // Revalidate to get the actual data
    } catch (error) {
      logger.error('Failed to add to favorites', error);
      await mutateFavorites(favorites, false); // Rollback on error
      throw error;
    }
  };

  const removeFromFavorites = async (programId: string | number) => {
    const numericId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    
    // Optimistic update
    const optimisticData = favorites?.filter(p => p.id !== programId.toString()) || [];
    
    try {
      mutateFavorites(optimisticData, false);
      await removeFromFavoritesService(numericId);
      await mutateFavorites(); // Revalidate to get the actual data
    } catch (error) {
      logger.error('Failed to remove from favorites', error);
      await mutateFavorites(favorites, false); // Rollback on error
      throw error;
    }
  };

  const addToWatchLater = async (programId: string | number) => {
    const numericId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    const program = watchLater?.find(p => p.id === programId.toString());
    
    // Optimistic update with existing program data if available
    const optimisticData = [...(watchLater || [])];
    if (program) {
      optimisticData.push(program);
    } else {
      optimisticData.push(createPlaceholderProgram(programId.toString()));
    }
    
    try {
      mutateWatchLater(optimisticData, false);
      await addToWatchLaterService(numericId);
      await mutateWatchLater(); // Revalidate to get the actual data
    } catch (error) {
      logger.error('Failed to add to watch later', error);
      await mutateWatchLater(watchLater, false); // Rollback on error
      throw error;
    }
  };

  const removeFromWatchLater = async (programId: string | number) => {
    const numericId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    
    // Optimistic update
    const optimisticData = watchLater?.filter(p => p.id !== programId.toString()) || [];
    
    try {
      mutateWatchLater(optimisticData, false);
      await removeFromWatchLaterService(numericId);
      await mutateWatchLater(); // Revalidate to get the actual data
    } catch (error) {
      logger.error('Failed to remove from watch later', error);
      await mutateWatchLater(watchLater, false); // Rollback on error
      throw error;
    }
  };

  return {
    favorites: favorites || [],
    watchLater: watchLater || [],
    isLoading: (!favoritesError && !favorites) || (!watchLaterError && !watchLater),
    isError: favoritesError || watchLaterError,
    addToFavorites,
    removeFromFavorites,
    addToWatchLater,
    removeFromWatchLater,
    mutateFavorites,
    mutateWatchLater,
  };
}