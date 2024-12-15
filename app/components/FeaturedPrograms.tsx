'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaLeaf, FaArrowRight } from 'react-icons/fa';
import { Program } from '../types';
import Carousel from './Carousel';
import { motion } from 'framer-motion';
import { useProgramActions } from '../hooks/useProgramActions';
import { useAuth } from '../context/AuthContext';
import { usePrograms } from '../context/ProgramContext';

interface FeaturedProgramsProps {
  programs: Program[] | undefined;
}

const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ programs }) => {
  const router = useRouter();
  const { handleToggleFavorite } = useProgramActions();
  const { user } = useAuth();
  const { isPurchased } = usePrograms();

  const handleExplore = (programId: string) => {
    router.push(`/programs/${programId}`);
  };

  const handleQuickAddToFavorites = (programId: string) => {
    handleToggleFavorite(programId);
  };

  const handleSignIn = () => {
    router.push('/login');
  };

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
        {!programs || programs.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lightBlue-100">No featured programs available at the moment.</p>
          </div>
        ) : (
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
              isPurchased={isPurchased}
              onSignIn={handleSignIn}
            />
          </motion.div>
        )}
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
