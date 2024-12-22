import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import { usePrograms } from '../context/ProgramContext';
import { Program, Session, SessionProgress } from '../types';
import { logger } from '../utils/logger';
import { 
  toggleFavorite as apiFavorite, 
  toggleWatchLater as apiWatchLater,
  updateSessionProgress as apiUpdateSession
} from '../utils/api';

export interface ProgramActions {
  isLoading: boolean;
  handlePurchase: (program: Program) => Promise<void>;
  handleToggleWatchLater: (programId: string) => Promise<void>;
  handleToggleFavorite: (programId: string) => Promise<void>;
  handleSessionProgress: (programId: string, sessionId: string, progress: Partial<SessionProgress>) => Promise<void>;
  isProgramPurchased: (programId: string) => boolean;
  isProgramFavorited: (programId: string) => boolean;
  isProgramInWatchLater: (programId: string) => boolean;
  getSessionProgress: (programId: string, sessionId: string) => SessionProgress | undefined;
}

export function useProgramActions(): ProgramActions {
  const { user } = useAuth();
  const { 
    userPrograms,
    isLoading,
    refreshUserPrograms,
    updateProgramProgress
  } = usePrograms();

  const isProgramPurchased = useCallback((programId: string): boolean => {
    return userPrograms.purchased_programs.some((p: Program) => p.id === programId);
  }, [userPrograms.purchased_programs]);

  const isProgramFavorited = useCallback((programId: string): boolean => {
    return userPrograms.favorite_programs.some((p: Program) => p.id === programId);
  }, [userPrograms.favorite_programs]);

  const isProgramInWatchLater = useCallback((programId: string): boolean => {
    return userPrograms.watch_later_programs.some((p: Program) => p.id === programId);
  }, [userPrograms.watch_later_programs]);

  const getSessionProgress = useCallback((programId: string, sessionId: string): SessionProgress | undefined => {
    const program = userPrograms.purchased_programs.find((p: Program) => p.id === programId);
    return program?.sessions.find((s: Session) => s.id === sessionId)?.progress;
  }, [userPrograms.purchased_programs]);

  const handlePurchase = useCallback(async (program: Program) => {
    if (!user) {
      toast.error('Please sign in to purchase programs');
      return;
    }

    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId: program.id })
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      logger.error('Purchase error:', error);
      toast.error('Failed to initiate purchase. Please try again.');
    }
  }, [user]);

  const handleToggleWatchLater = useCallback(async (programId: string) => {
    if (!user) {
      toast.error('Please sign in to add programs to watch later');
      return;
    }

    try {
      await apiWatchLater(Number(programId));
      await refreshUserPrograms();
      toast.success('Watch later list updated');
    } catch (error) {
      logger.error('Watch later error:', error);
      toast.error('Failed to update watch later list');
    }
  }, [user, refreshUserPrograms]);

  const handleToggleFavorite = useCallback(async (programId: string) => {
    if (!user) {
      toast.error('Please sign in to favorite programs');
      return;
    }

    try {
      await apiFavorite(Number(programId));
      await refreshUserPrograms();
      toast.success('Favorites updated');
    } catch (error) {
      logger.error('Favorite error:', error);
      toast.error('Failed to update favorites');
    }
  }, [user, refreshUserPrograms]);

  const handleSessionProgress = useCallback(async (
    programId: string, 
    sessionId: string, 
    progress: Partial<SessionProgress>
  ) => {
    if (!user) {
      toast.error('Please sign in to track progress');
      return;
    }

    try {
      // Get current progress
      const currentProgress = getSessionProgress(programId, sessionId) || {
        completed: false,
        duration_watched: 0,
        last_position: 0,
      };

      // Merge with new progress
      const updatedProgress: SessionProgress = {
        ...currentProgress,
        ...progress,
        completedAt: progress.completed ? new Date() : currentProgress.completedAt,
      };

      await apiUpdateSession(programId, sessionId, updatedProgress);
      await updateProgramProgress(programId, sessionId, updatedProgress);
    } catch (error) {
      logger.error('Session progress error:', error);
      toast.error('Failed to update progress');
    }
  }, [user, updateProgramProgress, getSessionProgress]);

  return {
    isLoading,
    handlePurchase,
    handleToggleWatchLater,
    handleToggleFavorite,
    handleSessionProgress,
    isProgramPurchased,
    isProgramFavorited,
    isProgramInWatchLater,
    getSessionProgress,
  };
}
