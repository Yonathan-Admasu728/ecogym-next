'use client';

import { motion } from 'framer-motion';
import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProgramCard from './ProgramCard';
import ProgramDetail from './ProgramDetail';
import SignInModal from './SignInModal';
import VirtualizedProgramList from './VirtualizedProgramList';
import { useAuth } from '../context/AuthContext';
import { PaymentService, PaymentServiceError } from '../services/PaymentService';
import type { Program } from '../types';
import { toString } from '../types';
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

// Default number of items to display per page
const DEFAULT_PAGE_SIZE = 12;

export default function ProgramListClient({ programs, title }: ProgramListClientProps): JSX.Element {
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const [purchasedPrograms] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleExplore = useCallback((programId: string): void => {
    const program = programs.find(p => p.id === programId);
    if (!program) return;

    logger.info('Program explored', {
      programId: program.id,
      userId: user?.uid
    });
    setSelectedProgram(program);
  }, [programs, user]);

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
      const checkoutSession = await PaymentService.createCheckoutSession(toString(selectedProgram.id));
      
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
        sessionStorage.setItem(STORAGE_KEYS.PROGRAM_ID, toString(selectedProgram.id));
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

  const handleLoadMore = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setPage(prev => prev + 1);
      setIsLoading(false);
    }, 500);
  }, [isLoading]);

  const handleQuickAddToFavorites = useCallback((programId: string) => {
    // TODO: Implement favorites functionality
    logger.info('Quick add to favorites', { programId });
  }, []);

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
    <>
      {/* Desktop View with Virtualization */}
      <div className="hidden md:block">
        <VirtualizedProgramList
          programs={programs}
          title={title}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={page * DEFAULT_PAGE_SIZE < programs.length}
          onExplore={handleExplore}
          onQuickAddToFavorites={handleQuickAddToFavorites}
          onSignIn={() => setShowSignInModal(true)}
          purchasedProgramIds={purchasedPrograms}
        />
      </div>

      {/* Mobile View with Swiper */}
      <section className="md:hidden py-16 bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 text-white w-full">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-turquoise-400 to-turquoise-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>

          <Swiper {...swiperProps}>
            {programs.map((program) => (
              <SwiperSlide key={program.id}>
                <ProgramCard 
                  program={program}
                  isFeatured={false}
                  isAuthenticated={!!user}
                  isPurchased={purchasedPrograms.includes(toString(program.id))}
                  onExplore={() => handleExplore(toString(program.id))}
                  onQuickAddToFavorites={() => handleQuickAddToFavorites(toString(program.id))}
                  onSignIn={() => setShowSignInModal(true)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {showSignInModal && (
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSignInSuccess={handleSignInSuccess}
        />
      )}
    </>
  );
}
