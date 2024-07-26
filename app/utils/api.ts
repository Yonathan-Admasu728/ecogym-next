// app/utils/api.ts
import axios from 'axios';
import { Program } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserPrograms {
  purchased_programs: Program[];
  favorite_programs: Program[];
  watch_later_programs: Program[];
}

export const fetchUserPrograms = async (token: string, getIdToken: () => Promise<string | null>): Promise<{
  purchased_programs: Program[];
  favorite_programs: Program[];
  watch_later_programs: Program[];
}> => {
  console.log("fetchUserPrograms called with token:", token.substring(0, 10) + "...");
  try {
    const response = await axios.get(`${API_URL}/api/user/programs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("User programs response status:", response.status);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = response.data;
    console.log("User programs data:", data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching user programs:', error.message);

      // If the error is due to an invalid token, try to refresh the token
      if (error.response && error.response.status === 401) {
        console.log('Token is invalid or expired. Attempting to refresh token...');
        const newToken = await getIdToken();
        if (newToken) {
          return await fetchUserPrograms(newToken, getIdToken); // Retry with the new token
        } else {
          throw new Error('Failed to refresh token');
        }
      }
    } else {
      console.error('Unexpected error fetching user programs:', error);
    }

    throw error;
  }
};

export const fetchFeaturedPrograms = async (): Promise<Program[]> => {
  console.log("fetchFeaturedPrograms called");
  try {
    const response = await axios.get(`${API_URL}/api/programs/featured/`);
    console.log("Featured programs response status:", response.status);
    if (response.status !== 200) {
      console.error('Error response:', response.statusText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
    }
    const data = response.data;
    console.log("Featured programs data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching featured programs:', error);
    throw error;
  }
};

export const fetchPrograms = async (): Promise<Program[]> => {
  try {
    const response = await fetch(`${API_URL}/api/programs/`);
    if (!response.ok) {
      throw new Error('Failed to fetch programs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
};

export const fetchProgramsByCategory = async (category: string): Promise<Program[]> => {
  try {
    const response = await fetch(`${API_URL}/api/programs/?category=${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} programs`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${category} programs:`, error);
    throw error;
  }
};

export const toggleFavorite = async (programId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    const response = await fetch(`${API_URL}/api/user/favorites/toggle/${programId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to toggle favorite');
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const toggleWatchLater = async (programId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    const response = await fetch(`${API_URL}/api/user/watch-later/toggle/${programId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to toggle watch later');
    }
  } catch (error) {
    console.error('Error toggling watch later:', error);
    throw error;
  }
};
