import { useEffect, useMemo } from 'react';
import { useDailyCompass } from '../context/DailyCompassContext';

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
  streakHistory: Array<{ date: string; promptId: number; completed: boolean }>;
  streakPercentage: number;
  totalCompletions: number;
  achievements: Achievement[];
}

interface UseStreakReturn {
  isLoading: boolean;
  error: string | null;
  streakStats: StreakStats | null;
}

export function useStreak(): UseStreakReturn {
  const { state, fetchUserStreak } = useDailyCompass();

  useEffect(() => {
    fetchUserStreak();
  }, [fetchUserStreak]);

  const streakStats = useMemo(() => {
    if (!state.userStreak) return null;

    const maxStreak = Math.max(30, state.userStreak.longestStreak || 0);
    const streakPercentage = ((state.userStreak.currentStreak || 0) / maxStreak) * 100;
    const totalCompletions = state.userStreak.streakHistory?.filter(day => day.completed)?.length || 0;

    const achievements: Achievement[] = [
      state.userStreak.currentStreak >= 7 ? {
        icon: '🌟',
        title: 'Week Warrior',
        description: 'Completed 7 days in a row'
      } : null,
      state.userStreak.currentStreak >= 30 ? {
        icon: '🏆',
        title: 'Monthly Master',
        description: 'Completed 30 days in a row'
      } : null,
      state.userStreak.currentStreak >= state.userStreak.longestStreak && 
      state.userStreak.longestStreak > 0 ? {
        icon: '🎯',
        title: 'Personal Best',
        description: 'Reached your longest streak yet!'
      } : null
    ].filter((achievement): achievement is Achievement => achievement !== null);

    return {
      currentStreak: state.userStreak.currentStreak || 0,
      longestStreak: state.userStreak.longestStreak || 0,
      lastCompletedDate: state.userStreak.lastCompletedDate || null,
      streakHistory: state.userStreak.streakHistory || [],
      streakPercentage,
      totalCompletions,
      achievements
    };
  }, [state.userStreak]);

  return {
    isLoading: state.isLoading.streak,
    error: state.error,
    streakStats: streakStats as StreakStats | null
  };
}
