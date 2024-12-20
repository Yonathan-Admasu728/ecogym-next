'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import { Program } from '../types';
import { 
  fetchPrograms as apiFetchPrograms, 
  fetchFeaturedPrograms as apiFetchFeaturedPrograms, 
  fetchUserPrograms as apiFetchUserPrograms, 
  toggleFavorite, 
  toggleWatchLater,
  UserPrograms
} from '../utils/api';
import { eventBus } from '../utils/eventBus';

interface ProgramContextType {
  allPrograms: Program[];
  featuredPrograms: Program[];
  recommendedPrograms: Program[];
  userPrograms: UserPrograms;
  isLoading: boolean;
  error: string | null;
  fetchAllPrograms: () => Promise<void>;
  fetchFeaturedPrograms: () => Promise<void>;
  fetchRecommendedPrograms: () => Promise<void>;
  fetchUserPrograms: () => Promise<void>;
  toggleFavorite: (programId: number) => Promise<void>;
  toggleWatchLater: (programId: number) => Promise<void>;
  updateUserPrograms: (updatedPrograms: Partial<UserPrograms>) => void;
  refreshUserPrograms: () => Promise<void>;
  isPurchased: (programId: string) => boolean;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

const useApiCache = <T,>(fetcher: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (data) return; // Return if data is already cached
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [data, fetcher]);

  return { data, isLoading, error, fetchData };
};

export const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getIdToken } = useAuth();
  const [userPrograms, setUserPrograms] = useState<UserPrograms>({
    purchased_programs: [],
    favorite_programs: [],
    watch_later_programs: [],
  });

  const allProgramsCache = useApiCache(apiFetchPrograms);
  const featuredProgramsCache = useApiCache(apiFetchFeaturedPrograms);
  const recommendedProgramsCache = useApiCache(apiFetchPrograms); // Replace with actual recommended programs API when available

  const fetchUserProgramsCallback = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (token) {
        const programs = await apiFetchUserPrograms(token, getIdToken);
        setUserPrograms(programs);
      } else {
        throw new Error('Authentication token is missing');
      }
    } catch (error) {
      console.error('Error fetching user programs:', error);
    }
  }, [getIdToken]);

  const updateUserPrograms = useCallback((updatedPrograms: Partial<UserPrograms>) => {
    setUserPrograms(prev => ({
      ...prev,
      ...updatedPrograms
    }));
  }, []);

  const refreshUserPrograms = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (token) {
        const programs = await apiFetchUserPrograms(token, getIdToken);
        setUserPrograms(programs);
      }
    } catch (error) {
      console.error('Error refreshing user programs:', error);
    }
  }, [getIdToken]);

  const toggleFavoriteCallback = useCallback(async (programId: number) => {
    try {
      await toggleFavorite(programId);
      await refreshUserPrograms();
      eventBus.publish('userProgramsUpdated');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [refreshUserPrograms]);
  
  const toggleWatchLaterCallback = useCallback(async (programId: number) => {
    try {
      await toggleWatchLater(programId);
      await refreshUserPrograms();
      eventBus.publish('userProgramsUpdated');
    } catch (error) {
      console.error('Error toggling watch later:', error);
    }
  }, [refreshUserPrograms]);

  const isPurchased = useCallback((programId: string) => {
    return userPrograms.purchased_programs.some(program => program.id === programId);
  }, [userPrograms.purchased_programs]);

  const isLoading = allProgramsCache.isLoading || featuredProgramsCache.isLoading || recommendedProgramsCache.isLoading;
  const error = allProgramsCache.error || featuredProgramsCache.error || recommendedProgramsCache.error;

  return (
    <ProgramContext.Provider 
      value={{ 
        allPrograms: allProgramsCache.data || [],
        featuredPrograms: featuredProgramsCache.data || [],
        recommendedPrograms: recommendedProgramsCache.data || [],
        userPrograms, 
        isLoading, 
        error, 
        fetchAllPrograms: allProgramsCache.fetchData,
        fetchFeaturedPrograms: featuredProgramsCache.fetchData,
        fetchRecommendedPrograms: recommendedProgramsCache.fetchData,
        fetchUserPrograms: fetchUserProgramsCallback,
        toggleFavorite: toggleFavoriteCallback,
        toggleWatchLater: toggleWatchLaterCallback,
        updateUserPrograms,
        refreshUserPrograms,
        isPurchased,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const usePrograms = () => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('usePrograms must be used within a ProgramProvider');
  }
  return context;
};
