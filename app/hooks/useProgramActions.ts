// app/hooks/useProgramActions.ts

import { useCallback, useState, useEffect } from 'react';
import { usePrograms } from '../context/ProgramContext';

export const useProgramActions = (programId: number) => {
  const { userPrograms, toggleFavorite, toggleWatchLater, refreshUserPrograms } = usePrograms();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  useEffect(() => {
    if (userPrograms) {
      setIsFavorite(userPrograms.favorite_programs.some(p => p.id === programId));
      setIsWatchLater(userPrograms.watch_later_programs.some(p => p.id === programId));
    }
  }, [userPrograms, programId]);

  const handleToggleFavorite = useCallback(async () => {
    if (toggleFavorite) {
      await toggleFavorite(programId);
      setIsFavorite(prev => !prev);
      await refreshUserPrograms();
    }
  }, [programId, toggleFavorite, refreshUserPrograms]);

  const handleToggleWatchLater = useCallback(async () => {
    if (toggleWatchLater) {
      await toggleWatchLater(programId);
      setIsWatchLater(prev => !prev);
      await refreshUserPrograms();
    }
  }, [programId, toggleWatchLater, refreshUserPrograms]);

  return { isFavorite, isWatchLater, handleToggleFavorite, handleToggleWatchLater };
};