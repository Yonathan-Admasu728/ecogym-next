// app/context/ProgramContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Program } from '../types';
import { fetchPrograms, fetchFeaturedPrograms, fetchUserPrograms } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface ProgramContextType {
  allPrograms: Program[];
  featuredPrograms: Program[];
  userPrograms: {
    purchased_programs: Program[];
    favorite_programs: Program[];
    watch_later_programs: Program[];
  };
  isLoading: boolean;
  error: string | null;
  fetchAllPrograms: () => Promise<void>;
  fetchFeaturedPrograms: () => Promise<void>;
  fetchUserPrograms: () => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getIdToken } = useAuth();
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [userPrograms, setUserPrograms] = useState<{
    purchased_programs: Program[];
    favorite_programs: Program[];
    watch_later_programs: Program[];
  }>({
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
        fetchUserPrograms: fetchUserProgramsCallback 
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
