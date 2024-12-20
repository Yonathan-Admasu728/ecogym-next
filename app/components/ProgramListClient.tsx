'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProgramCard from './ProgramCard';
import ProgramDetail from './ProgramDetail';
import SignInModal from './SignInModal';
import { useAuth } from '../context/AuthContext';
import { PaymentService, PaymentServiceError } from '../services/PaymentService';
import type { Program } from '../types';
import { logger } from '../utils/logger';

import 'swiper/css';
import 'swiper/css/pagination';

interface ProgramListClientProps {
  programs: Program[];
  title: string;
}

const STORAGE_KEYS = {
  PROGRAM_ID: 'purchasingProgramId'
} as const;

const swiperProps = {
  spaceBetween: 30,
  modules: [Pagination, Autoplay],
  pagination: true,
  autoplay: true
};

export default function ProgramListClient({ programs, title }: ProgramListClientProps): JSX.Element {
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const [purchasedPrograms] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleExplore = useCallback((program: Program): void => {
    logger.info('Program explored', {
      programId: program.id,
      userId: user?.uid
    });
    setSelectedProgram(program);
  }, [user]);

  const handleEnroll = useCallback(async (): Promise<void> => {
    if (!user) {
      setShowSignInModal(true);
      return;
    }

    if (!selectedProgram) {
      logger.error('Attempted to enroll without selected program');
      return;
    }

    setIsProcessing(true);
    try {
      const checkoutSession = await PaymentService.createCheckoutSession(selectedProgram.id);
      
      if (!checkoutSession?.url) {
        throw new PaymentServiceError('Failed to create checkout session');
      }

      logger.info('Checkout session created', {
        programId: selectedProgram.id,
        userId: user.uid,
        sessionId: checkoutSession.sessionId
      });

      // Store program ID in session storage for post-purchase redirect
      try {
        sessionStorage.setItem(STORAGE_KEYS.PROGRAM_ID, selectedProgram.id);
      } catch (storageError) {
        logger.warn('Failed to store program ID in session storage', {
          error: storageError,
          programId: selectedProgram.id
        });
        // Continue with checkout even if storage fails
      }

      // Redirect to Stripe checkout
      window.location.href = checkoutSession.url;
    } catch (error) {
      const errorMessage = error instanceof PaymentServiceError 
        ? error.message 
        : 'Failed to initiate purchase';

      logger.error('Failed to create checkout session', {
        error,
        programId: selectedProgram.id,
        userId: user.uid
      });
      
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user, selectedProgram]);

  const handleSignInSuccess = useCallback((): void => {
    setShowSignInModal(false);
    if (selectedProgram) {
      void handleEnroll();
    }
  }, [selectedProgram, handleEnroll]);

  const isProgramPurchased = useCallback((programId: string): boolean => {
    return purchasedPrograms.includes(programId);
  }, [purchasedPrograms]);

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
        onEnroll={() => void handleEnroll()}
        isAuthenticated={!!user}
        isProcessing={isProcessing}
      />
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 text-white">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-turquoise-400 to-turquoise-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        
        <AnimatePresence>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProgramCard 
                  program={program}
                  isFeatured={index === 0}
                  isAuthenticated={!!user}
                  isPurchased={isProgramPurchased(program.id)}
                  onExplore={() => handleExplore(program)}
                  onQuickAddToFavorites={() => {}} // TODO: Implement favorites functionality
                  onSignIn={() => setShowSignInModal(true)}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <div className="md:hidden">
          <Swiper {...swiperProps}>
            {programs.map((program) => (
              <SwiperSlide key={program.id}>
                <ProgramCard 
                  program={program}
                  isFeatured={false}
                  isAuthenticated={!!user}
                  isPurchased={isProgramPurchased(program.id)}
                  onExplore={() => handleExplore(program)}
                  onQuickAddToFavorites={() => {}} // TODO: Implement favorites functionality
                  onSignIn={() => setShowSignInModal(true)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {showSignInModal && (
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSignInSuccess={handleSignInSuccess}
        />
      )}
    </section>
  );
}
