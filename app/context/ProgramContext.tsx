// app/context/ProgramContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Program } from '../types';
import { 
  fetchPrograms, 
  fetchFeaturedPrograms, 
  fetchUserPrograms, 
  toggleFavorite, 
  toggleWatchLater,
  UserPrograms
} from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface ProgramContextType {
  allPrograms: Program[];
  featuredPrograms: Program[];
  userPrograms: UserPrograms;
  isLoading: boolean;
  error: string | null;
  fetchAllPrograms: () => Promise<void>;
  fetchFeaturedPrograms: () => Promise<void>;
  fetchUserPrograms: () => Promise<void>;
  toggleFavorite: (programId: number) => Promise<void>;
  toggleWatchLater: (programId: number) => Promise<void>;
  updateUserPrograms: (updatedPrograms: Partial<UserPrograms>) => void;
  refreshUserPrograms: () => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getIdToken } = useAuth();
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [userPrograms, setUserPrograms] = useState<UserPrograms>({
    purchased_programs: [],
    favorite_programs: [],
    watch_later_programs: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPrograms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const programs = await fetchPrograms();
      setAllPrograms(programs);
    } catch (error) {
      console.error('Error fetching all programs:', error);
      setError('Failed to load programs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFeaturedProgramsCallback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const programs = await fetchFeaturedPrograms();
      setFeaturedPrograms(programs);
    } catch (error) {
      console.error('Error fetching featured programs:', error);
      setError('Failed to load featured programs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProgramsCallback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (token) {
        const programs = await fetchUserPrograms(token, getIdToken);
        setUserPrograms(programs);
      } else {
        throw new Error('Authentication token is missing');
      }
    } catch (error) {
      console.error('Error fetching user programs:', error);
      setError('Failed to load user programs. Please try again later.');
    } finally {
      setIsLoading(false);
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
        const programs = await fetchUserPrograms(token, getIdToken);
        setUserPrograms(programs);
      }
    } catch (error) {
      console.error('Error refreshing user programs:', error);
    }
  }, [getIdToken]);


  const toggleFavoriteCallback = useCallback(async (programId: number) => {
    try {
      await toggleFavorite(programId);
      setUserPrograms(prev => {
        const isFavorite = prev.favorite_programs.some(p => p.id === programId);
        let updatedFavorites: Program[];
        if (isFavorite) {
          updatedFavorites = prev.favorite_programs.filter(p => p.id !== programId);
        } else {
          const programToAdd = allPrograms.find(p => p.id === programId);
          updatedFavorites = programToAdd 
            ? [...prev.favorite_programs, programToAdd]
            : prev.favorite_programs;
        }
        return {
          ...prev,
          favorite_programs: updatedFavorites
        };
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [allPrograms]);

  const toggleWatchLaterCallback = useCallback(async (programId: number) => {
    try {
      await toggleWatchLater(programId);
      setUserPrograms(prev => {
        const isWatchLater = prev.watch_later_programs.some(p => p.id === programId);
        let updatedWatchLater: Program[];
        if (isWatchLater) {
          updatedWatchLater = prev.watch_later_programs.filter(p => p.id !== programId);
        } else {
          const programToAdd = allPrograms.find(p => p.id === programId);
          updatedWatchLater = programToAdd 
            ? [...prev.watch_later_programs, programToAdd]
            : prev.watch_later_programs;
        }
        return {
          ...prev,
          watch_later_programs: updatedWatchLater
        };
      });
    } catch (error) {
      console.error('Error toggling watch later:', error);
    }
  }, [allPrograms]);

  return (
    <ProgramContext.Provider 
      value={{ 
        allPrograms, 
        featuredPrograms, 
        userPrograms, 
        isLoading, 
        error, 
        fetchAllPrograms, 
        fetchFeaturedPrograms: fetchFeaturedProgramsCallback, 
        fetchUserPrograms: fetchUserProgramsCallback,
        toggleFavorite: toggleFavoriteCallback,
        toggleWatchLater: toggleWatchLaterCallback,
        updateUserPrograms,
        refreshUserPrograms,
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