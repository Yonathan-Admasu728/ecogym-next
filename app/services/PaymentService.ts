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

export async function createCheckoutSession(programId: string): Promise<CheckoutSessionResponse> {
  try {
    const response = await axiosInstance.post<CheckoutSessionResponse>('/payments/create-checkout-session', {
      programId,
    });
    return response.data;
  } catch (error) {
    handlePaymentError(error, 'create checkout session');
    throw error; // TypeScript knows this is unreachable but it's good practice
  }
}

export async function getPurchasedPrograms(): Promise<string[]> {
  try {
    const response = await axiosInstance.get<PurchasedProgramsResponse>('/payments/purchased-programs');
    return response.data.programs;
  } catch (error) {
    handlePaymentError(error, 'get purchased programs');
    throw error;
  }
}

export async function checkSubscriptionStatus(programId: string): Promise<boolean> {
  try {
    const response = await axiosInstance.get<PurchaseStatusResponse>(`/payments/subscription-status/${programId}`);
    return response.data.isPurchased;
  } catch (error) {
    handlePaymentError(error, 'check subscription status');
    throw error;
  }
}

export async function checkPurchaseStatus(sessionId: string): Promise<PurchaseStatusResponse> {
  try {
    const response = await axiosInstance.get<PurchaseStatusResponse>(`/payments/check-purchase-status/${sessionId}`);
    return response.data;
  } catch (error) {
    handlePaymentError(error, 'check purchase status');
    throw error;
  }
}

export async function verifyPurchase(sessionId: string): Promise<boolean> {
  try {
    const response = await axiosInstance.post<PurchaseStatusResponse>('/payments/verify-purchase', {
      sessionId,
    });
    return response.data.isPurchased;
  } catch (error) {
    handlePaymentError(error, 'verify purchase');
    throw error;
  }
}

function handlePaymentError(error: unknown, context: string): never {
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

export async function getPurchaseDetails(sessionId: string): Promise<PurchaseDetails> {
  try {
    const response = await axiosInstance.get<PurchaseDetails>(`/payments/purchase-details/${sessionId}`);
    return {
      programId: response.data.programId,
      status: response.data.status,
      purchaseDate: response.data.purchaseDate,
      expiryDate: response.data.expiryDate,
    };
  } catch (error) {
    handlePaymentError(error, 'get purchase details');
    throw error;
  }
}
