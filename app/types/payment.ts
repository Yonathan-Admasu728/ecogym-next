export interface PurchaseDetails {
  programId: string;
  status: 'pending' | 'completed' | 'failed';
  purchaseDate: string;
  expiryDate?: string;
}

export interface PaymentSession {
  sessionId: string;
  url: string;
  programId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PaymentError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaymentResponse<T> {
  data: T;
  error?: PaymentError;
}

export interface PurchaseStatusResponse {
  isPurchased: boolean;
  accessType: 'purchase' | 'subscription' | 'trial' | null;
}

export interface BulkPurchaseStatusResponse {
  [programId: string]: PurchaseStatusResponse;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PurchasedProgramsResponse {
  programs: string[];
}
