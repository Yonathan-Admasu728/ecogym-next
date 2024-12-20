import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

import { PaymentService } from '../services/PaymentService';
import { Program } from '../types';
import { logger } from '../utils/logger';

export interface ProgramActions {
  isLoading: boolean;
  watchLaterIds: Set<string>;
  favoriteIds: Set<string>;
  completedIds: Set<string>;
  purchasedProgramIds: Set<string>;
  handlePurchase: (program: Program) => Promise<void>;
  handleToggleWatchLater: (programId: string) => void;
  handleToggleFavorite: (programId: string) => void;
  handleToggleCompleted: (programId: string) => void;
  isProgramPurchased: (programId: string) => boolean;
}

export function useProgramActions(): ProgramActions {
  const [isLoading, setIsLoading] = useState(false);
  const [watchLaterIds, setWatchLaterIds] = useState<Set<string>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [purchasedProgramIds] = useState<Set<string>>(new Set());

  const handlePurchase = useCallback(async (program: Program) => {
    setIsLoading(true);
    try {
      const session = await PaymentService.createCheckoutSession(program.id);
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      logger.error('Purchase error:', error);
      toast.error('Failed to initiate purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleWatchLater = useCallback((programId: string) => {
    setWatchLaterIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  }, []);

  const handleToggleFavorite = useCallback((programId: string) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  }, []);

  const handleToggleCompleted = useCallback((programId: string) => {
    setCompletedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  }, []);

  const isProgramPurchased = useCallback((programId: string) => {
    return purchasedProgramIds.has(programId);
  }, [purchasedProgramIds]);

  return {
    isLoading,
    watchLaterIds,
    favoriteIds,
    completedIds,
    purchasedProgramIds,
    handlePurchase,
    handleToggleWatchLater,
    handleToggleFavorite,
    handleToggleCompleted,
    isProgramPurchased,
  };
}
