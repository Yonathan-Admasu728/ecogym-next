// app/components/ProgramList.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePrograms } from '../context/ProgramContext';
import { useAuth } from '../context/AuthContext';
import ProgramCard from './ProgramCard';
import ProgramDetail from './ProgramDetail';
import SignInModal from './SignInModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { AnimatePresence } from 'framer-motion';
import { Program } from '../types';
import { fetchPrograms, fetchProgramsByCategory } from '../utils/api';
import { PaymentService } from '../services/PaymentService';
import 'swiper/css';
import 'swiper/css/pagination';

interface ProgramListProps {
  category?: string;
  title: string;
}

const ProgramList: React.FC<ProgramListProps> = ({ category, title }) => {
  const { isLoading: contextLoading, error: contextError } = usePrograms();
  const { user, loading: authLoading } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [purchasedPrograms, setPurchasedPrograms] = useState<string[]>([]);

  useEffect(() => {
    const loadPrograms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPrograms = category
          ? await fetchProgramsByCategory(category)
          : await fetchPrograms();
        setPrograms(fetchedPrograms);
      } catch (err) {
        setError('Failed to load programs. Please try again.');
        console.error('Error loading programs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, [category]);

  useEffect(() => {
    const fetchPurchasedPrograms = async () => {
      if (user) {
        try {
          const purchased = await PaymentService.fetchPurchasedPrograms();
          setPurchasedPrograms(purchased);
        } catch (error) {
          console.error('Error fetching purchased programs:', error);
        }
      }
    };

    fetchPurchasedPrograms();
  }, [user]);

  const handleExplore = useCallback((program: Program) => {
    setSelectedProgram(program);
  }, []);

  const handleEnroll = useCallback(async () => {
    if (!user) {
      setShowSignInModal(true);
    } else if (selectedProgram) {
      try {
        await PaymentService.createCheckoutSession(selectedProgram.id);
        // Redirect to checkout or handle the enrollment process
      } catch (error) {
        console.error('Error creating checkout session:', error);
        setError('Failed to initiate enrollment. Please try again.');
      }
    }
  }, [user, selectedProgram]);

  const handleSignInSuccess = useCallback(() => {
    setShowSignInModal(false);
    if (selectedProgram) {
      handleEnroll();
    }
  }, [selectedProgram, handleEnroll]);

  const isProgramPurchased = useCallback((programId: string) => {
    return purchasedPrograms.includes(programId);
  }, [purchasedPrograms]);

  if (isLoading || contextLoading || authLoading) return <div>Loading...</div>;
  if (error || contextError) return <div>Error: {error || contextError}</div>;
  if (programs.length === 0) return <div>No programs available.</div>;

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
        onEnroll={handleEnroll}
        isAuthenticated={!!user}
      />
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">{title}</h1>
        
        <AnimatePresence>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <ProgramCard 
                key={program.id}
                program={program}
                isFeatured={index === 0}
                isAuthenticated={!!user}
                isPurchased={isProgramPurchased(program.id)}
                onExplore={() => handleExplore(program)}
                onQuickAddToFavorites={() => {}} // Implement this functionality
                onSignIn={() => setShowSignInModal(true)}
              />
            ))}
          </div>
        </AnimatePresence>

        <div className="md:hidden">
          <Swiper
            spaceBetween={30}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
          >
            {programs.map((program) => (
              <SwiperSlide key={program.id}>
                <ProgramCard 
                  program={program}
                  isFeatured={false}
                  isAuthenticated={!!user}
                  isPurchased={isProgramPurchased(program.id)}
                  onExplore={() => handleExplore(program)}
                  onQuickAddToFavorites={() => {}} // Implement this functionality
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
};

export default ProgramList;
