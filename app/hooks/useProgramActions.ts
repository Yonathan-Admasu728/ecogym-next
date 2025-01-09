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
  handleToggleWatchLater: (programId: string | number) => Promise<void>;
  handleToggleFavorite: (programId: string | number) => Promise<void>;
  handleSessionProgress: (programId: string | number, sessionId: string, progress: Partial<SessionProgress>) => Promise<void>;
  isProgramPurchased: (programId: string | number) => boolean;
  isProgramFavorited: (programId: string | number) => boolean;
  isProgramInWatchLater: (programId: string | number) => boolean;
  getSessionProgress: (programId: string | number, sessionId: string) => SessionProgress | undefined;
}

export function useProgramActions(): ProgramActions {
  const { user } = useAuth();
  const { 
    userPrograms,
    isLoading,
    refreshUserPrograms,
    updateProgramProgress
  } = usePrograms();

  const isProgramPurchased = useCallback((programId: string | number): boolean => {
    const id = programId.toString();
    return userPrograms.purchased_programs.some((p: Program) => p.id.toString() === id);
  }, [userPrograms.purchased_programs]);

  const isProgramFavorited = useCallback((programId: string | number): boolean => {
    const id = programId.toString();
    return userPrograms.favorite_programs.some((p: Program) => p.id.toString() === id);
  }, [userPrograms.favorite_programs]);

  const isProgramInWatchLater = useCallback((programId: string | number): boolean => {
    const id = programId.toString();
    return userPrograms.watch_later_programs.some((p: Program) => p.id.toString() === id);
  }, [userPrograms.watch_later_programs]);

  const getSessionProgress = useCallback((programId: string | number, sessionId: string): SessionProgress | undefined => {
    const id = programId.toString();
    const program = userPrograms.purchased_programs.find((p: Program) => p.id.toString() === id);
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
        body: JSON.stringify({ programId: program.id.toString() })
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

  const handleToggleWatchLater = useCallback(async (programId: string | number) => {
    if (!user) {
      toast.error('Please sign in to add programs to watch later');
      return;
    }

    try {
      const numericId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
      await apiWatchLater(numericId);
      await refreshUserPrograms();
      toast.success('Watch later list updated');
    } catch (error) {
      logger.error('Watch later error:', error);
      toast.error('Failed to update watch later list');
    }
  }, [user, refreshUserPrograms]);

  const handleToggleFavorite = useCallback(async (programId: string | number) => {
    if (!user) {
      toast.error('Please sign in to favorite programs');
      return;
    }

    try {
      const numericId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
      await apiFavorite(numericId);
      await refreshUserPrograms();
      toast.success('Favorites updated');
    } catch (error) {
      logger.error('Favorite error:', error);
      toast.error('Failed to update favorites');
    }
  }, [user, refreshUserPrograms]);

  const handleSessionProgress = useCallback(async (
    programId: string | number, 
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

      const numericId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
      await apiUpdateSession(numericId, sessionId, updatedProgress);
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
