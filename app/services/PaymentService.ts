import { AxiosError } from 'axios';

import {
  CheckoutSessionResponse,
  PaymentError,
  PurchaseDetails,
  PurchaseStatusResponse,
  PurchasedProgramsResponse,
} from '../types/payment';
import axiosInstance from '../utils/axiosConfig';
import { logger } from '../utils/logger';

export class PaymentServiceError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'PaymentServiceError';
  }
}

export function handleApiError(error: unknown, context: string): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const errorData = error.response?.data as PaymentError | undefined;
    const message = errorData?.message ?? error.message;
    const code = error.code;

    logger.error(`Payment Error: ${context}`, {
      status,
      message,
      code,
      url: error.config?.url,
    });

    throw new PaymentServiceError(
      `Failed to ${context}: ${message}`,
      status,
      code
    );
  }

  logger.error(`Unexpected error during ${context}`, error);
  throw new PaymentServiceError(`An unexpected error occurred while ${context}`);
}

export const PaymentService = {
  async createCheckoutSession(programId: string): Promise<CheckoutSessionResponse> {
    try {
      const response = await axiosInstance.post<CheckoutSessionResponse>('/payments/create-checkout-session', {
        programId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'create checkout session');
      throw error;
    }
  },

  async getPurchasedPrograms(): Promise<string[]> {
    try {
      const response = await axiosInstance.get<PurchasedProgramsResponse>('/payments/purchased-programs');
      return response.data.programs;
    } catch (error) {
      handleApiError(error, 'get purchased programs');
      throw error;
    }
  },

  async checkSubscriptionStatus(programId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get<PurchaseStatusResponse>(`/payments/subscription-status/${programId}`);
      return response.data.isPurchased;
    } catch (error) {
      handleApiError(error, 'check subscription status');
      throw error;
    }
  },

  async checkPurchaseStatus(sessionId: string): Promise<PurchaseStatusResponse> {
    try {
      const response = await axiosInstance.get<PurchaseStatusResponse>(`/payments/check-purchase-status/${sessionId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'check purchase status');
      throw error;
    }
  },

  async verifyPurchase(sessionId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.post<PurchaseStatusResponse>('/payments/verify-purchase', {
        sessionId,
      });
      return response.data.isPurchased;
    } catch (error) {
      handleApiError(error, 'verify purchase');
      throw error;
    }
  },

  async getPurchaseDetails(sessionId: string): Promise<PurchaseDetails> {
    try {
      const response = await axiosInstance.get<PurchaseDetails>(`/payments/purchase-details/${sessionId}`);
      return {
        programId: response.data.programId,
        status: response.data.status,
        purchaseDate: response.data.purchaseDate,
        expiryDate: response.data.expiryDate,
      };
    } catch (error) {
      handleApiError(error, 'get purchase details');
      throw error;
    }
  }
};
