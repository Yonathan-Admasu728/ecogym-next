// services/PaymentService.ts

import axios, { AxiosError } from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLIC_KEY) {
  throw new Error('Stripe public key not found in environment variables');
}

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

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

export const PaymentService = {
  createCheckoutSession: async (programId: number) => {
    try {
      console.log(`Creating checkout session for program ${programId}`);
      const response = await axiosInstance.post('/api/payments/create-checkout-session/', {
        program_id: programId,
      });
      console.log('Create checkout session response:', response.data);
      const { sessionId } = response.data;
      return { sessionId };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      handleApiError(error);
      return undefined;
    }
  },

  checkPurchaseStatus: async (programId: number) => {
    try {
      console.log(`Checking purchase status for program ${programId}`);
      const response = await axiosInstance.get(`/api/payments/check-purchase/${programId}/`);
      console.log('Purchase status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking purchase status:', error);
      handleApiError(error);
    }
  },

  verifyPurchase: async (sessionId: string) => {
    try {
      console.log(`Verifying purchase for session ${sessionId}`);
      const response = await axiosInstance.post('/api/payments/verify-purchase/', {
        session_id: sessionId,
      });
      console.log('Verify purchase response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error verifying purchase:', error);
      handleApiError(error);
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
