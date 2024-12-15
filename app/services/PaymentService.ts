// PaymentService.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '',  // Empty since we're using relative paths
  headers: {
    'Content-Type': 'application/json',
  },
});

export class PaymentService {
  static async createCheckoutSession(programId: string): Promise<{ sessionId: string } | null> {
    try {
      const response = await axiosInstance.post('/api/payments/create-checkout-session', { program_id: programId });
      return { sessionId: response.data.session_id };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  }

  static async checkPurchaseStatus(programId: string): Promise<{ purchased: boolean }> {
    try {
      const response = await axiosInstance.get('/api/payments/check-purchase-status', {
        params: { program_id: programId }
      });
      return { purchased: response.data.isPurchased };
    } catch (error) {
      console.error('Error checking purchase status:', error);
      // For demo purposes, if there's an error, assume not purchased
      return { purchased: false };
    }
  }

  static async verifyPurchase(programId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get('/api/payments/check-purchase-status', {
        params: { program_id: programId }
      });
      return response.data.isPurchased;
    } catch (error) {
      console.error('Error verifying purchase:', error);
      return false;
    }
  }

  static async fetchPurchasedPrograms(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/api/payments/purchased-programs');
      return response.data;
    } catch (error) {
      console.error('Error fetching purchased programs:', error);
      return [];
    }
  }
}
