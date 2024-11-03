// app/services/ProgramService.ts

import axios, { AxiosError } from 'axios';
import { Program } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request:', token.substring(0, 10) + '...');
    } else {
      console.warn('No authentication token found');
    }
    return config;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

export const ProgramService = {
  getFeaturedPrograms: async (): Promise<Program[]> => {
    try {
      console.log('Fetching featured programs');
      const response = await axiosInstance.get('/api/programs/featured/');
      console.log('Featured programs response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured programs:', error);
      handleApiError(error);
      throw error;
    }
  },

  getRecommendedPrograms: async (userId: string): Promise<Program[]> => {
    try {
      console.log(`Fetching recommended programs for user ${userId}`);
      const response = await axiosInstance.get('/api/programs/recommended/');
      console.log('Recommended programs response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended programs:', error);
      handleApiError(error);
      throw error;
    }
  },

  getPurchasedPrograms: async (userId: string) => {
    try {
      console.log(`Fetching purchased programs for user ${userId}`);
      const response = await axiosInstance.get(`/api/users/${userId}/purchased-programs/`);
      console.log('Purchased programs response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchased programs:', error);
      handleApiError(error);
      throw error;
    }
  },

  getFavorites: async (userId: string): Promise<Program[]> => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}/favorites/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      handleApiError(error);
      throw error;
    }
  },

  getWatchLater: async (userId: string): Promise<Program[]> => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}/watch-later/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watch later:', error);
      handleApiError(error);
      throw error;
    }
  },

  addToFavorites: async (userId: string, programId: number): Promise<void> => {
    try {
      await axiosInstance.post(`/api/users/${userId}/favorites/`, { program_id: programId });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      handleApiError(error);
      throw error;
    }
  },

  removeFromFavorites: async (userId: string, programId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/users/${userId}/favorites/${programId}/`);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      handleApiError(error);
      throw error;
    }
  },

  addToWatchLater: async (userId: string, programId: number): Promise<void> => {
    try {
      await axiosInstance.post(`/api/users/${userId}/watch-later/`, { program_id: programId });
    } catch (error) {
      console.error('Error adding to watch later:', error);
      handleApiError(error);
      throw error;
    }
  },

  removeFromWatchLater: async (userId: string, programId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/users/${userId}/watch-later/${programId}/`);
    } catch (error) {
      console.error('Error removing from watch later:', error);
      handleApiError(error);
      throw error;
    }
  },
};

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error('API Error:', axiosError.response.status, axiosError.response.data);
      throw new Error(`API Error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
    } else if (axiosError.request) {
      console.error('No response received:', axiosError.request);
      throw new Error('No response received from the server');
    } else {
      console.error('Error setting up request:', axiosError.message);
      throw new Error(`Error setting up request: ${axiosError.message}`);
    }
  } else {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
};
