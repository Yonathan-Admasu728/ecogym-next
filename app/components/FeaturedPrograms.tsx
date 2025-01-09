'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaLeaf, FaArrowRight } from 'react-icons/fa';

import { Program } from '../types';
import Carousel from './Carousel';
import { useAuth } from '../context/AuthContext';
import { useProgramActions } from '../hooks/useProgramActions';

interface FeaturedProgramsProps {
  programs?: Program[];
}

const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ programs = [] }) => {
  const router = useRouter();
  const { handleToggleFavorite, isProgramPurchased } = useProgramActions();
  const { user } = useAuth();

  const handleExplore = (programId: string) => {
    router.push(`/programs/${programId}`);
  };

  const handleQuickAddToFavorites = (programId: string) => {
    handleToggleFavorite(programId);
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  // Loading state
  const renderLoadingState = () => (
    <div className="animate-pulse">
      <div className="h-64 bg-darkBlue-700 rounded-lg mb-4" />
      <div className="h-4 bg-darkBlue-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-darkBlue-700 rounded w-1/2" />
    </div>
  );

  // Error state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-darkBlue-800 rounded-lg">
      <p className="text-lightBlue-100 text-lg mb-4">
        No featured programs available at the moment.
      </p>
      <button
        onClick={() => router.push('/programs')}
        className="btn-secondary px-6 py-2 rounded-full bg-turquoise-500 text-darkBlue-900 hover:bg-turquoise-400 transition-all duration-300"
      >
        View All Programs
      </button>
    </div>
  );

  return (
    <section 
      className="py-16 sm:py-20 lg:py-24 bg-[#0B1120] relative overflow-hidden" 
      id="featured-programs"
    >
      {/* Enhanced ambient background with more dynamic gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-[30rem] h-[30rem] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/4 -right-40 w-[35rem] h-[35rem] bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-[40rem] h-[40rem] bg-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
          <div className="absolute bg-gradient-to-br from-darkBlue-900/50 to-transparent w-full h-full backdrop-blur-[2px]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-6 font-heading tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Featured Programs
          </motion.h2>
          <motion.div 
            className="flex items-center justify-center text-turquoise-400 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaLeaf className="w-6 h-6 sm:w-8 sm:h-8 mr-3 animate-pulse" />
            <span className="text-lg sm:text-xl bg-gradient-to-r from-turquoise-400 to-turquoise-300 bg-clip-text text-transparent font-medium">
              Discover Your Path to Wellness
            </span>
          </motion.div>
          <motion.p 
            className="text-lightBlue-100/90 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore our curated selection of mindfulness practices, guided meditations, and effective home workouts designed to transform your mind and body.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {programs === undefined ? (
            renderLoadingState()
          ) : programs.length === 0 ? (
            renderEmptyState()
          ) : (
            <Carousel 
              programs={programs} 
              onExplore={handleExplore}
              onQuickAddToFavorites={handleQuickAddToFavorites}
              isAuthenticated={!!user}
              isPurchased={(programId) => isProgramPurchased(programId)}
              onSignIn={handleSignIn}
            />
          )}
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            onClick={() => router.push('/programs')}
            className="btn-secondary text-lg px-10 py-4 flex items-center justify-center mx-auto group rounded-full bg-turquoise-500 text-darkBlue-900 hover:bg-turquoise-400 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Programs
            <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
