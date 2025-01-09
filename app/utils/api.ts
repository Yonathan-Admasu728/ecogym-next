import { Program } from '../types';
import { UserPrograms } from '../types/program';
import { Session } from '../types';
import { logger } from './logger';
import * as ProgramService from '../services/ProgramService';
import axiosInstance from './axiosConfig';

export async function getProgram(id: string): Promise<Program> {
  try {
    const program = await ProgramService.getProgram(id);
    if (!program) {
      throw new Error('Program not found');
    }
    return program;
  } catch (error) {
    logger.error('Error fetching program:', error);
    throw error;
  }
}

export async function fetchProgramsByCategory(category: string): Promise<Program[]> {
  try {
    return await ProgramService.getProgramsByCategory(category);
  } catch (error) {
    logger.error('Error fetching programs by category:', error);
    throw error;
  }
}

export async function fetchPrograms(): Promise<Program[]> {
  try {
    return await ProgramService.getAllPrograms();
  } catch (error) {
    logger.error('Error fetching programs:', error);
    throw error;
  }
}

export async function fetchFeaturedPrograms(): Promise<Program[]> {
  try {
    return await ProgramService.getFeaturedPrograms();
  } catch (error) {
    logger.error('Error fetching featured programs:', error);
    throw error;
  }
}

export async function fetchUserPrograms(): Promise<UserPrograms> {
  try {
    const [favorites, watchLater, purchased] = await Promise.all([
      ProgramService.getFavorites(),
      ProgramService.getWatchLater(),
      ProgramService.getPurchasedPrograms()
    ]);
    
    return {
      favorite_programs: favorites,
      watch_later_programs: watchLater,
      purchased_programs: purchased
    };
  } catch (error) {
    logger.error('Error fetching user programs:', error);
    throw error;
  }
}

export async function toggleFavorite(programId: number): Promise<void> {
  try {
    await ProgramService.addToFavorites(programId);
  } catch (error) {
    logger.error('Error toggling favorite:', error);
    throw error;
  }
}

export async function toggleWatchLater(programId: number): Promise<void> {
  try {
    await ProgramService.addToWatchLater(programId);
  } catch (error) {
    logger.error('Error toggling watch later:', error);
    throw error;
  }
}

export async function updateSessionProgress(
  programId: string | number,
  sessionId: string,
  progress: Partial<Session['progress']>
): Promise<void> {
  try {
    const url = `/api/user/programs/${programId.toString()}/sessions/${sessionId}/progress`;
    await axiosInstance.post(url, progress);
  } catch (error) {
    logger.error('Error updating session progress:', error);
    throw error;
  }
}
