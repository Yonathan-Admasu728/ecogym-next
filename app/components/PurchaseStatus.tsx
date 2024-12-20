// PurchaseStatus.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaCrown, FaHourglassHalf } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import { PaymentService, PaymentServiceError } from '../services/PaymentService';
import type { PurchaseStatusResponse } from '../types/payment';
import { logger } from '../utils/logger';

interface PurchaseStatusProps {
  programId: string;
  onStatusChange?: (status: boolean) => void;
}

const initialStatus: PurchaseStatusResponse = { isPurchased: false, accessType: null };

export default function PurchaseStatus({ programId, onStatusChange }: PurchaseStatusProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatusResponse>(initialStatus);
  const { user } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setPurchaseStatus(initialStatus);
        setLoading(false);
        return;
      }

      try {
        const status = await PaymentService.checkPurchaseStatus(programId);
        setPurchaseStatus(status);
        onStatusChange?.(status.isPurchased);
        
        logger.debug('Purchase status checked', {
          programId,
          userId: user.uid,
          status
        });
      } catch (err) {
        const errorMessage = err instanceof PaymentServiceError 
          ? err.message 
          : 'Failed to verify purchase status';
        
        logger.error('Failed to check purchase status', {
          error: err,
          programId,
          userId: user.uid
        });
        setError(errorMessage);
        setPurchaseStatus(initialStatus);
      } finally {
        setLoading(false);
      }
    };

    void checkStatus();

    // Set up polling for purchase status (useful during checkout process)
    const pollInterval = setInterval(() => void checkStatus(), 5000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [programId, user, onStatusChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-turquoise-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">
        {error}
      </div>
    );
  }

  if (!purchaseStatus.isPurchased) {
    return <div />;
  }

  const getStatusIcon = () => {
    switch (purchaseStatus.accessType) {
      case 'subscription':
        return <FaCrown className="h-5 w-5 text-yellow-400" />;
      case 'trial':
        return <FaHourglassHalf className="h-5 w-5 text-blue-400" />;
      default:
        return <FaCheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  const getStatusText = () => {
    switch (purchaseStatus.accessType) {
      case 'subscription':
        return 'Included in your subscription';
      case 'trial':
        return 'Free trial access';
      default:
        return 'Purchased';
    }
  };

  return (
    <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-turquoise-400/20 px-4 py-3 rounded-xl flex items-center space-x-2 shadow-lg">
      {getStatusIcon()}
      <span className="text-turquoise-400 font-medium">
        {getStatusText()}
      </span>
    </div>
  );
}
