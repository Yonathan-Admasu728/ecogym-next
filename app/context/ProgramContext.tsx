'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { useAuth } from './AuthContext';
import { Program, Session } from '../types';
import { UserPrograms } from '../types/program';
import { 
  fetchPrograms as apiFetchPrograms, 
  fetchFeaturedPrograms as apiFetchFeaturedPrograms,
  fetchUserPrograms as apiFetchUserPrograms,
} from '../utils/api';
import { eventBus } from '../utils/eventBus';
import { logger } from '../utils/logger';

interface ProgramContextType {
  allPrograms: Program[];
  featuredPrograms: Program[];
  userPrograms: UserPrograms;
  isLoading: boolean;
  error: string | null;
  fetchAllPrograms: () => Promise<void>;
  fetchFeaturedPrograms: () => Promise<void>;
  fetchUserPrograms: () => Promise<void>;
  refreshUserPrograms: () => Promise<void>;
  updateProgramProgress: (
    programId: string, 
    sessionId: string, 
    progress: NonNullable<Session['progress']>
  ) => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

const useApiCache = <T,>(fetcher: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    // Cache for 5 minutes
    if (data && lastFetched && Date.now() - lastFetched < 5 * 60 * 1000) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      setLastFetched(Date.now());
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      logger.error('Error fetching data', { error: err });
    } finally {
      setIsLoading(false);
    }
  }, [data, fetcher, lastFetched]);

  return { data, isLoading, error, fetchData };
};

export const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, getToken } = useAuth();
  const [userPrograms, setUserPrograms] = useState<UserPrograms>({
    purchased_programs: [],
    favorite_programs: [],
    watch_later_programs: [],
  });

  const allProgramsCache = useApiCache(apiFetchPrograms);
  const featuredProgramsCache = useApiCache(apiFetchFeaturedPrograms);

  const fetchUserProgramsCallback = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) {
        const programs = await apiFetchUserPrograms();
        setUserPrograms(programs);
      }
    } catch (error) {
      logger.error('Error fetching user programs', { error });
    }
  }, [getToken]);

  // Fetch user programs on auth state change
  useEffect(() => {
    if (user) {
      fetchUserProgramsCallback();
    } else {
      setUserPrograms({
        purchased_programs: [],
        favorite_programs: [],
        watch_later_programs: [],
      });
    }
  }, [user, fetchUserProgramsCallback]);

  const refreshUserPrograms = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) {
        const programs = await apiFetchUserPrograms();
        setUserPrograms(programs);
        eventBus.publish('userProgramsUpdated');
      }
    } catch (error) {
      logger.error('Error refreshing user programs', { error });
    }
  }, [getToken]);

  const updateProgramProgress = useCallback(async (
    programId: string,
    sessionId: string,
    progress: NonNullable<Session['progress']>
  ) => {
    setUserPrograms((prev: UserPrograms) => {
      const updatedPrograms = prev.purchased_programs.map((program: Program) => {
        if (program.id === programId) {
          const updatedSessions = program.sessions.map((session: Session) => {
            if (session.id === sessionId) {
              const currentProgress = session.progress || {
                completed: false,
                duration_watched: 0,
                last_position: 0,
              };

              return {
                ...session,
                progress: {
                  ...currentProgress,
                  completed: progress.completed,
                  completedAt: progress.completedAt,
                  duration_watched: progress.duration_watched,
                  last_position: progress.last_position,
                },
              };
            }
            return session;
          });

          // Calculate new program progress
          const totalSessions = updatedSessions.length;
          const completedSessions = updatedSessions.filter((s: Session) => s.progress?.completed === true).length;
          const completionPercentage = Math.round((completedSessions / totalSessions) * 100);

          return {
            ...program,
            sessions: updatedSessions,
            progress: {
              ...program.progress,
              started: true,
              startedAt: program.progress?.startedAt || new Date(),
              completion_percentage: completionPercentage,
              sessions_completed: completedSessions,
              completed: completionPercentage === 100,
              completedAt: completionPercentage === 100 ? new Date() : undefined,
              last_session_id: sessionId,
            },
          };
        }
        return program;
      });

      return {
        ...prev,
        purchased_programs: updatedPrograms,
      };
    });

    eventBus.publish('programProgressUpdated');
  }, []);

  const isLoading = allProgramsCache.isLoading || featuredProgramsCache.isLoading;
  const error = allProgramsCache.error || featuredProgramsCache.error;

  return (
    <ProgramContext.Provider 
      value={{
        allPrograms: allProgramsCache.data || [],
        featuredPrograms: featuredProgramsCache.data || [],
        userPrograms,
        isLoading,
        error,
        fetchAllPrograms: allProgramsCache.fetchData,
        fetchFeaturedPrograms: featuredProgramsCache.fetchData,
        fetchUserPrograms: fetchUserProgramsCallback,
        refreshUserPrograms,
        updateProgramProgress,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const usePrograms = (): ProgramContextType => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('usePrograms must be used within a ProgramProvider');
  }
  return context;
};
