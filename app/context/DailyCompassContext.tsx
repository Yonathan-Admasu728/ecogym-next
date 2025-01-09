'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback, FC, useRef, useEffect } from 'react';
import { DailyPrompt, UserStreak, DailyCompassState, LoadingState } from '../types/dailyCompass';
import { DailyCompassService } from '../services/DailyCompassService';
import { logger } from '../utils/logger';

type Action =
  | { type: 'SET_LOADING'; payload: Partial<LoadingState> }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROMPT'; payload: DailyPrompt }
  | { type: 'SET_STREAK'; payload: UserStreak }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'UPDATE_ENGAGEMENT'; payload: { completed: boolean; reflection?: string; rating?: number } }
  | { type: 'RESET_STATE' };

// Global cache keys
const PROMPT_CACHE_KEY = 'dailyCompass_prompt_cache';
const STREAK_CACHE_KEY = 'dailyCompass_streak_cache';
interface PromptCacheData {
  prompt: DailyPrompt;
  timestamp: number;
}

interface StreakCacheData {
  streak: UserStreak;
  timestamp: number;
}

const initialState: DailyCompassState = {
  currentPrompt: null,
  userStreak: null,
  isLoading: {
    prompt: true,
    streak: true
  },
  error: null,
  isInitialized: false
};

// Safe localStorage access
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logger.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('Error removing from localStorage:', error);
    }
  }
};

// Load prompt from cache if available
const getCachedPrompt = (): PromptCacheData | null => {
  const cached = safeLocalStorage.getItem(PROMPT_CACHE_KEY);
  if (!cached) return null;

  try {
    const data = JSON.parse(cached) as PromptCacheData;
    const cacheDate = new Date(data.timestamp).setHours(0, 0, 0, 0);
    const todayDate = new Date().setHours(0, 0, 0, 0);
    
    if (cacheDate !== todayDate) {
      safeLocalStorage.removeItem(PROMPT_CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Error reading prompt cache:', error);
    return null;
  }
};

// Load streak from cache if available
const getCachedStreak = (): StreakCacheData | null => {
  const cached = safeLocalStorage.getItem(STREAK_CACHE_KEY);
  if (!cached) return null;

  try {
    const data = JSON.parse(cached) as StreakCacheData;
    const cacheDate = new Date(data.timestamp).setHours(0, 0, 0, 0);
    const todayDate = new Date().setHours(0, 0, 0, 0);
    
    if (cacheDate !== todayDate) {
      safeLocalStorage.removeItem(STREAK_CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Error reading streak cache:', error);
    return null;
  }
};

const DailyCompassContext = createContext<{
  state: DailyCompassState;
  fetchTodayPrompt: () => Promise<void>;
  fetchUserStreak: () => Promise<void>;
  recordEngagement: (engagement: { promptId: number; completed: boolean; reflection?: string; rating?: number }) => Promise<void>;
  resetState: () => void;
} | null>(null);

function dailyCompassReducer(state: DailyCompassState, action: Action): DailyCompassState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: { ...state.isLoading, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROMPT':
      return { ...state, currentPrompt: action.payload };
    case 'SET_STREAK':
      return { ...state, userStreak: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'UPDATE_ENGAGEMENT':
      if (!state.currentPrompt) return state;
      return {
        ...state,
        currentPrompt: {
          ...state.currentPrompt,
          userEngagement: {
            completed: action.payload.completed,
            completedAt: action.payload.completed ? new Date().toISOString() : undefined,
            reflection: action.payload.reflection,
            rating: action.payload.rating,
            viewedAt: new Date().toISOString(),
            expanded: true
          },
        },
      };
    case 'RESET_STATE':
      return {
        ...initialState,
        isLoading: { prompt: false, streak: false },
        isInitialized: false
      };
    default:
      return state;
  }
}

export const DailyCompassProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dailyCompassReducer, initialState);
  const fetchPromptPromise = useRef<Promise<void> | null>(null);
  const fetchStreakPromise = useRef<Promise<void> | null>(null);
  const isClient = useRef(false);

  // Initialize client-side data
  useEffect(() => {
    isClient.current = true;
    const cachedPromptData = getCachedPrompt();
    const cachedStreakData = getCachedStreak();

    if (cachedPromptData) {
      dispatch({ type: 'SET_PROMPT', payload: cachedPromptData.prompt });
    }
    if (cachedStreakData) {
      dispatch({ type: 'SET_STREAK', payload: cachedStreakData.streak });
    }
  }, []);

  const fetchTodayPrompt = useCallback(async () => {
    try {
      if (fetchPromptPromise.current) {
        await fetchPromptPromise.current;
        return;
      }

      const cached = getCachedPrompt();
      if (!cached) {
        dispatch({ type: 'SET_LOADING', payload: { prompt: true } });
      }
      
      fetchPromptPromise.current = DailyCompassService.getTodayPrompt()
        .then(prompt => {
          // Only initialize userEngagement for authenticated users
          const isAuthenticated = !!window?.localStorage.getItem('user');
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

          if (isClient.current) {
            safeLocalStorage.setItem(PROMPT_CACHE_KEY, JSON.stringify({
              prompt,
              timestamp: Date.now()
            }));
          }

          dispatch({ type: 'SET_PROMPT', payload: prompt });
          dispatch({ type: 'SET_ERROR', payload: null });

          // If authenticated, fetch streak data
          if (isAuthenticated) {
            fetchUserStreak().catch(error => {
              logger.error('Error fetching user streak:', error);
            });
          }
        })
        .catch(error => {
          const cached = getCachedPrompt();
          if (cached) {
            logger.debug('Using cached prompt as fallback');
            dispatch({ type: 'SET_PROMPT', payload: cached.prompt });
            dispatch({ type: 'SET_ERROR', payload: null });
          } else {
            const message = error instanceof Error ? error.message : 'Failed to load today\'s prompt';
            dispatch({ type: 'SET_ERROR', payload: message });
            logger.error('Error fetching daily prompt:', error);
          }
        })
        .finally(() => {
          dispatch({ type: 'SET_LOADING', payload: { prompt: false } });
          if (!state.isInitialized) {
            dispatch({ type: 'SET_INITIALIZED', payload: true });
          }
          fetchPromptPromise.current = null;
        });

      await fetchPromptPromise.current;
    } catch (error) {
      logger.error('Error in fetchTodayPrompt:', error);
      fetchPromptPromise.current = null;
      dispatch({ type: 'SET_LOADING', payload: { prompt: false, streak: false } });
    }
  }, [state.isInitialized]);

  const fetchUserStreak = useCallback(async () => {
    const cached = getCachedStreak();
    if (cached) {
      dispatch({ type: 'SET_STREAK', payload: cached.streak });
      return;
    }

    if (fetchStreakPromise.current) {
      return fetchStreakPromise.current;
    }

    try {
      if (!cached) {
        dispatch({ type: 'SET_LOADING', payload: { streak: true } });
      }
      
      fetchStreakPromise.current = DailyCompassService.getUserStreak()
        .then(streak => {
          if (isClient.current) {
            safeLocalStorage.setItem(STREAK_CACHE_KEY, JSON.stringify({
              streak,
              timestamp: Date.now()
            }));
          }

          dispatch({ type: 'SET_STREAK', payload: streak });
          dispatch({ type: 'SET_ERROR', payload: null });
        })
        .catch(error => {
          const message = error instanceof Error ? error.message : 'Failed to load streak data';
          dispatch({ type: 'SET_ERROR', payload: message });
          logger.error('Error fetching user streak:', error);
        })
        .finally(() => {
          dispatch({ type: 'SET_LOADING', payload: { streak: false } });
          if (!state.isInitialized) {
            dispatch({ type: 'SET_INITIALIZED', payload: true });
          }
          fetchStreakPromise.current = null;
        });

      await fetchStreakPromise.current;
    } catch (error) {
      logger.error('Error in fetchUserStreak:', error);
      fetchStreakPromise.current = null;
      dispatch({ type: 'SET_LOADING', payload: { streak: false } });
    }
  }, [state.isInitialized]);

  const recordEngagement = useCallback(async (engagement: { promptId: number; completed: boolean; reflection?: string; rating?: number }) => {
    // Check authentication before recording engagement
    const isAuthenticated = !!window?.localStorage.getItem('user');
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to record engagement');
    }

    try {
      await DailyCompassService.recordEngagement({
        ...engagement,
        completedAt: engagement.completed ? new Date().toISOString() : undefined
      });
      
      // Update both daily prompt and gallery prompt states
      dispatch({ type: 'UPDATE_ENGAGEMENT', payload: engagement });
      
      // Clear all caches to ensure fresh data
      safeLocalStorage.removeItem(PROMPT_CACHE_KEY);
      safeLocalStorage.removeItem(STREAK_CACHE_KEY);
      
      // Force fetch fresh streak data
      const freshStreak = await DailyCompassService.getUserStreak();
      dispatch({ type: 'SET_STREAK', payload: freshStreak });
      
      logger.debug('Updated streak data after engagement:', freshStreak);
    } catch (error) {
      logger.error('Error recording engagement:', error);
      throw error;
    }
  }, [fetchUserStreak]);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  return (
    <DailyCompassContext.Provider
      value={{
        state,
        fetchTodayPrompt,
        fetchUserStreak,
        recordEngagement,
        resetState
      }}
    >
      {children}
    </DailyCompassContext.Provider>
  );
};

export function useDailyCompass(): {
  state: DailyCompassState;
  fetchTodayPrompt: () => Promise<void>;
  fetchUserStreak: () => Promise<void>;
  recordEngagement: (engagement: { promptId: number; completed: boolean; reflection?: string; rating?: number }) => Promise<void>;
  resetState: () => void;
} {
  const context = useContext(DailyCompassContext);
  if (!context) {
    throw new Error('useDailyCompass must be used within a DailyCompassProvider');
  }
  return context;
}
