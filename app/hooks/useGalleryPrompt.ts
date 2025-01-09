'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDailyCompass } from '../context/DailyCompassContext';
import { DailyCompassService } from '../services/DailyCompassService';
import { logger } from '../utils/logger';

interface UseGalleryPromptReturn {
  isExpanded: boolean;
  reflection: string;
  rating: number | null;
  isSaving: boolean;
  showCompletionSuccess: boolean;
  handleExpand: () => void;
  handleComplete: (promptId: number) => Promise<void>;
  setReflection: (reflection: string) => void;
  setRating: (rating: number | null) => void;
}

export function useGalleryPrompt(initialPrompt?: { id: number; userEngagement?: any }): UseGalleryPromptReturn {
  const { user } = useAuth();
  const { fetchUserStreak } = useDailyCompass();
  const [isExpanded, setIsExpanded] = useState(false);
  const [reflection, setReflectionState] = useState(initialPrompt?.userEngagement?.reflection || '');
  const [rating, setRatingState] = useState<number | null>(initialPrompt?.userEngagement?.rating || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const setReflection = useCallback((text: string) => {
    setReflectionState(text);
  }, []);

  const setRating = useCallback((value: number | null) => {
    setRatingState(value);
  }, []);

  const [showCompletionSuccess, setShowCompletionSuccess] = useState(false);

  // Update state when prompt engagement changes
  useEffect(() => {
    if (initialPrompt?.userEngagement) {
      setReflectionState(initialPrompt.userEngagement.reflection || '');
      setRatingState(initialPrompt.userEngagement.rating || null);
    }
  }, [initialPrompt?.userEngagement]);

  const handleComplete = useCallback(async (promptId: number) => {
    if (!user || !rating) return;

    try {
      setIsSaving(true);
      await DailyCompassService.recordEngagement({
        promptId,
        completed: true,
        reflection: reflection || undefined,
        rating: rating || undefined,
      });

      setShowCompletionSuccess(true);
      setTimeout(() => {
        setShowCompletionSuccess(false);
        setIsExpanded(false);
      }, 2000);

      await fetchUserStreak();
      logger.debug('Gallery prompt completion recorded successfully');
    } catch (error) {
      logger.error('Error completing gallery prompt:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [user, reflection, rating, fetchUserStreak]);

  return {
    isExpanded,
    reflection,
    rating,
    isSaving,
    showCompletionSuccess,
    handleExpand,
    handleComplete,
    setReflection,
    setRating,
  };
}
