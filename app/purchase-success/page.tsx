// app/purchase-success/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { PaymentService, handleApiError } from '../services/PaymentService';

interface PurchaseDetails {
  program_name: string;
  amount: number;
}

const PurchaseSuccessPage = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verifyPurchase = async () => {
      const sessionId = searchParams.get('session_id');
      const programId = searchParams.get('program');

      console.log('Session ID:', sessionId);
      console.log('Program ID:', programId);

      if (!sessionId && !programId) {
        setError('Invalid session ID or program ID');
        setIsVerifying(false);
        return;
      }

      if (!user) {
        console.log('Waiting for user authentication...');
        return;
      }

      try {
        let response;
        if (sessionId) {
          console.log('Verifying purchase for session:', sessionId);
          response = await PaymentService.verifyPurchase(sessionId);
        } else if (programId) {
          console.log('Checking purchase status for program:', programId);
          response = await PaymentService.checkPurchaseStatus(Number(programId));
        }

        if (!response) {
          throw new Error('Failed to verify purchase');
        }

        console.log('Purchase verification result:', response);
        setPurchaseDetails(response);
      } catch (err) {
        console.error('Error verifying purchase:', err);
        setError('Failed to verify purchase. Please contact support.');
        handleApiError(err);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPurchase();
  }, [searchParams, user]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Link href="/" className="mt-4 bg-turquoise text-white px-4 py-2 rounded hover:bg-turquoise-dark transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Purchase Successful!</strong>
        <span className="block sm:inline"> Thank you for your purchase. You now have access to the program.</span>
      </div>
      {purchaseDetails && (
        <div className="mt-4">
          <p>Program: {purchaseDetails.program_name}</p>
          <p>Amount: ${purchaseDetails.amount}</p>
        </div>
      )}
      <div className="mt-6 space-x-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-turquoise text-white px-4 py-2 rounded hover:bg-turquoise-dark transition-colors"
        >
          Go to Dashboard
        </button>
        <Link href="/" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

const WrappedPurchaseSuccessPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PurchaseSuccessPage />
    </Suspense>
  );
};

export default WrappedPurchaseSuccessPage;
