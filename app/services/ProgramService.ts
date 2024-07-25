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
  getPurchasedPrograms: async (userId: string) => {
    try {
      console.log(`Fetching purchased programs for user ${userId}`);
      const response = await axiosInstance.get(`/api/users/${userId}/purchased-programs/`);
      console.log('Purchased programs response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchased programs:', error);
      handleApiError(error);
    }
  },

  getFavorites: async (userId: string): Promise<Program[]> => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}/favorites/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return []; // Return an empty array in case of error
    }
  },

  getWatchLater: async (userId: string): Promise<Program[]> => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}/watch-later/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watch later:', error);
      return []; // Return an empty array in case of error
    }
  },

  addToFavorites: async (userId: string, programId: number): Promise<void> => {
    try {
      await axiosInstance.post(`/api/users/${userId}/favorites/`, { program_id: programId });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },

  removeFromFavorites: async (userId: string, programId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/users/${userId}/favorites/${programId}/`);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },

  addToWatchLater: async (userId: string, programId: number): Promise<void> => {
    try {
      await axiosInstance.post(`/api/users/${userId}/watch-later/`, { program_id: programId });
    } catch (error) {
      console.error('Error adding to watch later:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },

  removeFromWatchLater: async (userId: string, programId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/users/${userId}/watch-later/${programId}/`);
    } catch (error) {
      console.error('Error removing from watch later:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },
};

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error('API Error:', axiosError.response.status, axiosError.response.data);
    } else if (axiosError.request) {
      console.error('No response received:', axiosError.request);
    } else {
      console.error('Error setting up request:', axiosError.message);
    }
    throw new Error(axiosError.message || 'An error occurred with the API request');
  } else {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
};
