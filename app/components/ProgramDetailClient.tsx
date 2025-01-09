'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import ProgramDetail from './ProgramDetail';
import { useAuth } from '../context/AuthContext';
import { PaymentService, PaymentServiceError } from '../services/PaymentService';
import type { Program } from '../types';
import { toString } from '../types';
import { getFreeSessionCount } from '../types/program';
import { logger } from '../utils/logger';

interface Props {
  program: Program;
}

const STORAGE_KEYS = {
  PROGRAM_ID: 'purchasingProgramId',
  REFERRER: 'programReferrer'
} as const;

export default function ProgramDetailClient({ program }: Props): JSX.Element {
  const router = useRouter();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleEnroll = async (): Promise<void> => {
    if (!user) {
      toast.error('Please sign in to access this program', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    if (program.isFree) {
      // Log free program access
      logger.info('Free program accessed', { 
        programId: program.id,
        userId: user.uid 
      });
      router.push(`/programs/${toString(program.id)}/sessions`);
      return;
    }

    // For non-free programs, check if they have free sessions
    const freeCount = getFreeSessionCount(program);
    if (freeCount > 0) {
      // If it's a single session program and the session is free
      if (program.program_type === 'single_session' && freeCount >= 1) {
        logger.info('Free single session accessed', {
          programId: program.id,
          userId: user.uid
        });
        router.push(`/programs/${toString(program.id)}/sessions`);
        return;
      }

      // For multi-session programs, allow access to free sessions
      if (program.program_type?.startsWith('multi_session')) {
        logger.info('Free sessions available', {
          programId: program.id,
          userId: user.uid,
          freeCount
        });
        router.push(`/programs/${toString(program.id)}/sessions`);
        return;
      }
    }

    // Handle paid program enrollment
    try {
      setIsProcessing(true);
      const checkoutSession = await PaymentService.createCheckoutSession(toString(program.id));
      
      if (!checkoutSession?.url) {
        throw new PaymentServiceError('Failed to create checkout session');
      }

      // Log successful checkout session creation
      logger.info('Checkout session created', { 
        programId: program.id,
        sessionId: checkoutSession.sessionId 
      });

      // Store program ID in session storage for post-purchase redirect
      try {
        sessionStorage.setItem(STORAGE_KEYS.PROGRAM_ID, toString(program.id));
        sessionStorage.setItem(STORAGE_KEYS.REFERRER, window.location.pathname);
      } catch (storageError) {
        logger.warn('Failed to store program data in session storage', {
          error: storageError,
          programId: program.id
        });
        // Continue with checkout even if storage fails
      }

      // Redirect to Stripe checkout
      window.location.href = checkoutSession.url;
    } catch (error) {
      const errorMessage = error instanceof PaymentServiceError 
        ? error.message 
        : 'Failed to initiate purchase';

      logger.error('Failed to initiate purchase', {
        error,
        programId: program.id,
        userId: user.uid
      });
      
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = (): void => {
    try {
      // Check if we have a stored referrer
      const referrer = sessionStorage.getItem(STORAGE_KEYS.REFERRER);
      if (referrer) {
        try {
          sessionStorage.removeItem(STORAGE_KEYS.REFERRER);
        } catch (storageError) {
          logger.warn('Failed to remove referrer from session storage', {
            error: storageError
          });
          // Continue with navigation even if storage cleanup fails
        }
        router.push(referrer);
      } else {
        router.back();
      }
    } catch (error) {
      logger.error('Error handling back navigation', {
        error,
        programId: program.id
      });
      // Fallback to home page if navigation fails
      router.push('/');
    }
  };

  return (
    <ProgramDetail
      program={program}
      onBack={handleBack}
      onEnroll={() => void handleEnroll()}
      isAuthenticated={!!user}
      isProcessing={isProcessing}
    />
  );
}
