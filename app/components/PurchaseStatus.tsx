// components/PurchaseStatus.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PaymentService, handleApiError } from '../services/PaymentService';

interface PurchaseStatusProps {
  programId: number;
}

const PurchaseStatus: React.FC<PurchaseStatusProps> = ({ programId }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, getIdToken } = useAuth();

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (loading) return;

      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const token = await getIdToken();
        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        const result = await PaymentService.checkPurchaseStatus(programId);
        setIsPurchased(result.purchased);
      } catch (err) {
        console.error('Failed to check purchase status:', err);
        setError('Failed to check purchase status');
        handleApiError(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkPurchaseStatus();
  }, [programId, user, loading, getIdToken]);

  if (loading) return <div>Loading auth state...</div>;
  if (isLoading) return <div>Checking purchase status...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isPurchased ? (
        <p>You have purchased this program.</p>
      ) : (
        <p>You have not purchased this program yet.</p>
      )}
    </div>
  );
};

export default PurchaseStatus;
