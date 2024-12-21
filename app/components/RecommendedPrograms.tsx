'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaStar, FaArrowRight } from 'react-icons/fa';

import Carousel from './Carousel';
import { useAuth } from '../context/AuthContext';
import { useProgramActions } from '../hooks/useProgramActions';
import { useRecommendedPrograms } from '../hooks/usePrograms';

const RecommendedPrograms: React.FC = () => {
  const router = useRouter();
  const { handleToggleFavorite, isProgramPurchased } = useProgramActions();
  const { user } = useAuth();
  const { programs, isLoading, isError } = useRecommendedPrograms();

  const handleExplore = (programId: string) => {
    router.push(`/programs/${programId}`);
  };

  const handleQuickAddToFavorites = (programId: string) => {
    handleToggleFavorite(programId);
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise-400" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-lightBlue-100">Failed to load recommended programs. Please try again later.</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-lightBlue-100">Sign in to see personalized recommendations.</p>
        </div>
      );
    }

    if (!programs || programs.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-lightBlue-100">No recommended programs available at the moment.</p>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
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
    );
  };

  return (
    <section 
      className="py-24 bg-gradient-to-b from-darkBlue-900 to-darkBlue-800 relative overflow-hidden" 
      id="recommended-programs"
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
            Recommended for You
          </h2>
          <div className="flex items-center justify-center text-turquoise-400 mb-8">
            <FaStar className="w-8 h-8 mr-3" />
            <span className="text-xl">Personalized Wellness Journey</span>
          </div>
          <p className="text-lightBlue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover programs tailored to your interests and goals, helping you achieve optimal health and well-being.
          </p>
        </motion.div>

        {renderContent()}

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
            Explore More Programs
            <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default RecommendedPrograms;
