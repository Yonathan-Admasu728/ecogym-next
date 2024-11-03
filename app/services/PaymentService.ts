// PaymentService.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class PaymentService {
  static async createCheckoutSession(programId: string): Promise<{ sessionId: string } | null> {
    try {
      const response = await axios.post(`${API_URL}/api/payments/create-checkout-session`, { program_id: programId });
      return { sessionId: response.data.session_id };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  }

  static async checkPurchaseStatus(programId: string): Promise<{ purchased: boolean }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
      const response = await axios.get(`${API_URL}/api/payments/check-purchase-status`, {
        params: { program_id: programId },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return { purchased: response.data.purchased };
    } catch (error) {
      console.error('Error checking purchase status:', error);
      throw error;
    }
  }

  static async verifyPurchase(programId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
      const response = await axios.get(`${API_URL}/api/payments/verify-purchase`, {
        params: { program_id: programId },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.verified;
    } catch (error) {
      console.error('Error verifying purchase:', error);
      return false;
    }
  }

  static async fetchPurchasedPrograms(): Promise<string[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
      const response = await axios.get(`${API_URL}/api/payments/purchased-programs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.purchased_programs;
    } catch (error) {
      console.error('Error fetching purchased programs:', error);
      return [];
    }
  }
}
