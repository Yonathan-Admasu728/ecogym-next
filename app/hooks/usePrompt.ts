'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { DailyPrompt } from '../types/dailyCompass';
import { useDailyCompass } from '../context/DailyCompassContext';
import { logger } from '../utils/logger';
import debounce from 'lodash/debounce';
import { AxiosError } from 'axios';

interface UsePromptReturn {
  isExpanded: boolean;
  reflection: string;
  rating: number | null;
  hasCompleted: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  handleExpand: () => void;
  handleComplete: () => Promise<void>;
  setReflection: (reflection: string) => void;
  setRating: (rating: number | null) => void;
  discardDraft: () => void;
}

interface DraftData {
  promptId: number;
  text: string;
  timestamp: string;
}

const STORAGE_KEY = 'dailyCompass_draft';
const FETCH_INTERVAL = 3600000; // 1 hour
const CACHE_KEY = 'dailyCompass_cache';
const CACHE_EXPIRY = 86400000; // 24 hours - since prompt changes daily

interface CacheData {
  prompt: DailyPrompt;
  timestamp: number;
}

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

export function usePrompt(): UsePromptReturn {
  const { state, fetchTodayPrompt, recordEngagement } = useDailyCompass();
  const [isExpanded, setIsExpanded] = useState(false);
  const [reflection, setReflectionState] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const promptIdRef = useRef<number | null>(null);
  const lastFetchRef = useRef<number>(0);
  const isClient = useRef(false);

  // Create save function
  const savePrompt = useCallback(async (promptId: number, text: string) => {
    try {
      setIsSaving(true);
      // Save to localStorage as draft
      const draft: DraftData = {
        promptId,
        text,
        timestamp: new Date().toISOString()
      };
      if (isClient.current) {
        safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      }
      
      // Also save to backend
      await recordEngagement({
        promptId,
        completed: false, // Not marking as completed during auto-save
        reflection: text,
        rating: rating || undefined
      });
      
      setLastSaved(new Date());
      logger.debug('Auto-saved reflection');
    } catch (error) {
      logger.error('Error auto-saving reflection:', error);
    } finally {
      setIsSaving(false);
    }
  }, [rating, recordEngagement, isClient]);

  // Create debounced save function with cleanup
  const debouncedSaveRef = useRef<ReturnType<typeof debounce> | null>(null);
  const debouncedSave = useCallback((promptId: number, text: string) => {
    if (debouncedSaveRef.current) {
      debouncedSaveRef.current.cancel();
    }
    
    debouncedSaveRef.current = debounce((id: number, content: string) => {
      void savePrompt(id, content);
    }, 2000);
    
    debouncedSaveRef.current(promptId, text);
  }, [savePrompt]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      if (debouncedSaveRef.current) {
        debouncedSaveRef.current.cancel();
      }
    };
  }, []);

  const getCachedPrompt = useCallback((): CacheData | null => {
    const cached = safeLocalStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    try {
      const data = JSON.parse(cached) as CacheData;
      const now = Date.now();

      // Check if cache is expired
      if (now - data.timestamp > CACHE_EXPIRY) {
        safeLocalStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error reading cache:', error);
      return null;
    }
  }, []);

  const setCachedPrompt = useCallback((prompt: DailyPrompt) => {
    if (!isClient.current) return;
    
    try {
      const cacheData: CacheData = {
        prompt,
        timestamp: Date.now()
      };
      safeLocalStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      logger.error('Error setting cache:', error);
    }
  }, []);

  // Initialize client-side
  useEffect(() => {
    isClient.current = true;
  }, []);

  // Load initial data and handle drafts with retry logic
  useEffect(() => {
    if (!isClient.current) return;

    const loadPromptAndDraft = async () => {
      const now = Date.now();
      
      // Try to fetch with exponential backoff retry
      const maxRetries = 3;
      let retryCount = 0;
      let lastError = null;

      while (retryCount < maxRetries) {
        try {
          await fetchTodayPrompt();
          lastFetchRef.current = now;

          // Cache the new prompt
          if (state.currentPrompt) {
            setCachedPrompt(state.currentPrompt);
          }
          break; // Success, exit retry loop
        } catch (error) {
          lastError = error;
          
          let retryAfter = 0;
          
          // Check if it's an Axios error with response
          if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError;
            // If it's not a rate limit error, don't retry
            if (axiosError.response?.status !== 429) {
              break;
            }

            // Get retry delay from response header
            retryAfter = parseInt(axiosError.response?.headers?.['retry-after'] || '0');
          } else {
            // Not an Axios error, don't retry
            break;
          }

          // Calculate delay using either retry-after header or exponential backoff
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          const delay = retryAfter > 0 ? retryAfter * 1000 : backoffDelay;

          logger.debug(`Retrying prompt fetch after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
        }
      }

      // If all fetch attempts failed, try to use cached data
      if (lastError) {
        logger.error('Error fetching prompt after retries:', lastError);
        const cachedData = getCachedPrompt();
        if (cachedData) {
          logger.debug('Using cached prompt as fallback');
        }
      }
      
      // Check for saved draft
      const savedDraft = safeLocalStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft) as DraftData;
          // Only restore if draft is from today's prompt
          if (state.currentPrompt && draft.promptId === state.currentPrompt.id) {
            setReflectionState(draft.text);
            setLastSaved(new Date(draft.timestamp));
          } else {
            // Clear old draft
            safeLocalStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          logger.error('Error parsing saved draft:', error);
        }
      }
    };
    
    loadPromptAndDraft();

    // Set up interval to periodically check for new prompts
    const intervalId = setInterval(() => {
      loadPromptAndDraft();
    }, FETCH_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (debouncedSaveRef.current) {
        debouncedSaveRef.current.cancel();
      }
    };
  }, [fetchTodayPrompt, state.currentPrompt, getCachedPrompt, setCachedPrompt, debouncedSave]);

  // Update promptIdRef when prompt changes
  useEffect(() => {
    if (state.currentPrompt?.id) {
      promptIdRef.current = state.currentPrompt.id;
    }
  }, [state.currentPrompt]);

  // Load existing engagement
  useEffect(() => {
    if (state.currentPrompt?.userEngagement) {
      setReflectionState(state.currentPrompt.userEngagement.reflection || '');
      setRating(state.currentPrompt.userEngagement.rating || null);
    }
  }, [state.currentPrompt]);

  // Handle reflection changes with auto-save
  const setReflection = useCallback((text: string) => {
    setReflectionState(text);
    if (promptIdRef.current !== null) {
      debouncedSave(promptIdRef.current, text);
    }
  }, [debouncedSave]);

  const handleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleComplete = useCallback(async () => {
    if (!state.currentPrompt) return;

    try {
      setIsSaving(true);
      await recordEngagement({
        promptId: state.currentPrompt.id,
        completed: true,
        reflection: reflection || undefined,
        rating: rating || undefined
      });
      // Clear draft after successful completion
      if (isClient.current) {
        safeLocalStorage.removeItem(STORAGE_KEY);
      }
      logger.debug('Prompt completion recorded successfully');
    } catch (error) {
      logger.error('Error completing prompt:', error);
    } finally {
      setIsSaving(false);
    }
  }, [state.currentPrompt, reflection, rating, recordEngagement]);

  const discardDraft = useCallback(() => {
    if (promptIdRef.current !== null && isClient.current) {
      safeLocalStorage.removeItem(STORAGE_KEY);
      setReflectionState('');
      setLastSaved(null);
    }
  }, []);

  return {
    isExpanded,
    reflection,
    rating,
    hasCompleted: state.currentPrompt?.userEngagement?.completed || false,
    isSaving,
    lastSaved,
    handleExpand,
    handleComplete,
    setReflection,
    setRating,
    discardDraft
  };
}
