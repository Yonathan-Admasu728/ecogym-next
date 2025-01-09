import { useState, useCallback } from 'react';
import { PromptCollection, PromptFilters } from '../types/dailyCompass';
import { DailyCompassService } from '../services/DailyCompassService';
import { logger } from '../utils/logger';

interface UsePromptGalleryReturn {
  collection: PromptCollection | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  filters: PromptFilters;
  categories: string[];
  fetchPrompts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  handleFilterChange: (newFilters: Partial<PromptFilters>) => void;
  handlePageChange: (newPage: number) => void;
  completePrompt: (promptId: number) => Promise<void>;
}

export function usePromptGallery(): UsePromptGalleryReturn {
  const [collection, setCollection] = useState<PromptCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PromptFilters>({});
  const [categories, setCategories] = useState<string[]>([]);

  const fetchPrompts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await DailyCompassService.getPromptCollection(currentPage, filters);
      setCollection(data);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load prompts';
      setError(message);
      logger.error('Error fetching prompt collection:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await DailyCompassService.getPromptCategories();
      setCategories(categories);
    } catch (error) {
      logger.error('Error fetching categories:', error);
    }
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<PromptFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const completePrompt = useCallback(async (promptId: number) => {
    try {
      await DailyCompassService.recordEngagement({
        promptId,
        completed: true
      });
      // Refresh the collection to update completion status
      fetchPrompts();
    } catch (error) {
      logger.error('Error completing prompt:', error);
    }
  }, [fetchPrompts]);

  return {
    collection,
    isLoading,
    error,
    currentPage,
    filters,
    categories,
    fetchPrompts,
    fetchCategories,
    handleFilterChange,
    handlePageChange,
    completePrompt
  };
}
