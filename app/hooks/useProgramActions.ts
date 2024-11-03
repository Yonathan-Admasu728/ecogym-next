import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useProgramActions = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [watchLater, setWatchLater] = useState<Set<string>>(new Set());

  const handleToggleFavorite = useCallback((programId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(programId)) {
        newFavorites.delete(programId);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(programId);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
    // Here you would typically make an API call to update the user's favorites
  }, []);

  const handleToggleWatchLater = useCallback((programId: string) => {
    setWatchLater((prev) => {
      const newWatchLater = new Set(prev);
      if (newWatchLater.has(programId)) {
        newWatchLater.delete(programId);
        toast.success('Removed from watch later');
      } else {
        newWatchLater.add(programId);
        toast.success('Added to watch later');
      }
      return newWatchLater;
    });
    // Here you would typically make an API call to update the user's watch later list
  }, []);

  const isFavorite = useCallback((programId: string) => favorites.has(programId), [favorites]);
  const isWatchLater = useCallback((programId: string) => watchLater.has(programId), [watchLater]);

  return {
    isFavorite,
    isWatchLater,
    handleToggleFavorite,
    handleToggleWatchLater,
  };
};
