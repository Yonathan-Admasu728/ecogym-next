// components/ProgramPurchase.tsx

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';
import { PaymentService } from '../services/PaymentService';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ProgramPurchaseProps {
  programId: number;
  price: number;
  title: string;
  stripePriceId: string;
}

const ProgramPurchase: React.FC<ProgramPurchaseProps> = ({ programId, price, title, stripePriceId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, getIdToken } = useAuth();

  const handlePurchase = async () => {
    if (!user) {
      setError('Please sign in to make a purchase');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const { sessionId } = await PaymentService.createCheckoutSession(programId);
      if (!sessionId) {
        throw new Error('Failed to create checkout session');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js has not loaded yet.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) {
        throw stripeError;
      }

    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Purchase error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4">Price: ${price.toFixed(2)}</p>
      <button
        onClick={handlePurchase}
        disabled={isLoading || !user}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
      >
        {isLoading ? 'Processing...' : 'Purchase'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {!user && <p className="mt-2 text-gray-600">Please sign in to make a purchase</p>}
    </div>
  );
};

export default ProgramPurchase;
