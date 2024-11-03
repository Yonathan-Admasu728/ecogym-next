import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PaymentService } from '../services/PaymentService';

interface PurchaseStatusProps {
  programId: string;
  onPurchaseStatusChange?: (purchased: boolean) => void;
}

const PurchaseStatus: React.FC<PurchaseStatusProps> = ({ programId, onPurchaseStatusChange }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkPurchaseStatus = async (retryCount = 0) => {
      if (loading || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await PaymentService.checkPurchaseStatus(programId);
        setIsPurchased(result.purchased);
        setError(null);
        if (onPurchaseStatusChange) {
          onPurchaseStatusChange(result.purchased);
        }
      } catch (err) {
        console.error('Failed to check purchase status:', err);
        if (retryCount < 3) {
          // Retry up to 3 times with exponential backoff
          setTimeout(() => checkPurchaseStatus(retryCount + 1), 1000 * Math.pow(2, retryCount));
        } else {
          setError('Failed to check purchase status. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkPurchaseStatus();
  }, [programId, user, loading, onPurchaseStatusChange]);

  if (loading) return <div className="text-gray-600">Loading auth state...</div>;
  if (isLoading) return <div className="text-gray-600">Checking purchase status...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="mt-4 mb-4">
      {isPurchased ? (
        <p className="text-green-500 font-semibold">You have access to this program.</p>
      ) : (
        <p className="text-yellow-500">You don't have access to this program yet.</p>
      )}
    </div>
  );
};

export default PurchaseStatus;
