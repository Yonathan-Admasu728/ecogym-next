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
      className="py-24 bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 relative overflow-hidden" 
      id="featured-programs"
      style={{
        backgroundImage: "url('/images/pattern.svg')",
        backgroundBlendMode: 'soft-light',
        backgroundSize: '200px',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-white mb-6 font-heading">
            Featured Programs
          </h2>
          <div className="flex items-center justify-center text-turquoise-400 mb-8">
            <FaLeaf className="w-8 h-8 mr-3" />
            <span className="text-xl">Discover Your Path to Wellness</span>
          </div>
          <p className="text-lightBlue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore our curated selection of mindfulness practices, guided meditations, and effective home workouts designed to transform your mind and body.
          </p>
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
