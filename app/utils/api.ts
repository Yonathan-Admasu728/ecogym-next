import axios from './axiosConfig';
import { Program } from '../types';
import { ProgramListResponse, UserPrograms, ProgramResponse } from '../types/program';
import { Session } from '../types';
import { logger } from './logger';

export async function getProgram(id: string): Promise<Program> {
  try {
    const response = await axios.get<ProgramResponse>(`/api/programs/${id}`);
    return response.data.program;
  } catch (error) {
    logger.error('Error fetching program:', error);
    throw error;
  }
}

export async function fetchProgramsByCategory(category: string): Promise<Program[]> {
  try {
    const response = await axios.get<ProgramListResponse>(`/api/programs?category=${category}`);
    return response.data.programs;
  } catch (error) {
    logger.error('Error fetching programs by category:', error);
    throw error;
  }
}

export async function fetchPrograms(): Promise<Program[]> {
  try {
    const response = await axios.get<ProgramListResponse>('/api/programs');
    return response.data.programs;
  } catch (error) {
    logger.error('Error fetching programs:', error);
    throw error;
  }
}

export async function fetchFeaturedPrograms(): Promise<Program[]> {
  try {
    const response = await axios.get<ProgramListResponse>('/api/programs/featured');
    return response.data.programs;
  } catch (error) {
    logger.error('Error fetching featured programs:', error);
    throw error;
  }
}

export async function fetchUserPrograms(): Promise<UserPrograms> {
  try {
    const response = await axios.get<UserPrograms>('/api/user/programs');
    return response.data;
  } catch (error) {
    logger.error('Error fetching user programs:', error);
    throw error;
  }
}

export async function toggleFavorite(programId: number): Promise<void> {
  try {
    await axios.post(`/api/user/programs/${programId}/favorite`);
  } catch (error) {
    logger.error('Error toggling favorite:', error);
    throw error;
  }
}

export async function toggleWatchLater(programId: number): Promise<void> {
  try {
    await axios.post(`/api/user/programs/${programId}/watch-later`);
  } catch (error) {
    logger.error('Error toggling watch later:', error);
    throw error;
  }
}

export async function updateSessionProgress(
  programId: string,
  sessionId: string,
  progress: Partial<Session['progress']>
): Promise<void> {
  try {
    await axios.post(`/api/user/programs/${programId}/sessions/${sessionId}/progress`, progress);
  } catch (error) {
    logger.error('Error updating session progress:', error);
    throw error;
  }
}
