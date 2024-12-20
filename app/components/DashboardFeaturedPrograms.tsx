'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useAuth } from '../context/AuthContext';
import { useProgramActions } from '../hooks/useProgramActions';
import { Program } from '../types';
import Carousel from './Carousel';

interface DashboardFeaturedProgramsProps {
  programs: Program[];
}

const DashboardFeaturedPrograms: React.FC<DashboardFeaturedProgramsProps> = ({ programs }) => {
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
  if (!programs) {
    return (
      <div className="p-6 bg-darkBlue-800 rounded-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-darkBlue-700 rounded w-1/4 mb-6" />
          <div className="h-64 bg-darkBlue-700 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-darkBlue-800 rounded-lg">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white">Featured Programs</h2>
        <p className="text-lightBlue-100 mt-2">
          Discover our most popular and highly-rated programs
        </p>
      </motion.div>

      {programs.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Carousel
            programs={programs}
            onExplore={handleExplore}
            onQuickAddToFavorites={handleQuickAddToFavorites}
            isAuthenticated={!!user}
            isPurchased={(programId) => isProgramPurchased(programId)}
            onSignIn={handleSignIn}
          />
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-darkBlue-700 rounded-lg">
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
      )}
    </div>
  );
};

export default DashboardFeaturedPrograms;
