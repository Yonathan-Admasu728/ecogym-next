'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import ProgramCard from './ProgramCard';
import { Program, toString } from '../types';

interface CarouselProps {
  programs: Program[];
  onExplore: (programId: string) => void;
  onQuickAddToFavorites: (programId: string) => void;
  isAuthenticated: boolean;
  isPurchased: (programId: string) => boolean;
  onSignIn: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ 
  programs = [], // Provide default empty array
  onExplore, 
  onQuickAddToFavorites, 
  isAuthenticated, 
  isPurchased, 
  onSignIn 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  // Ensure programs is always an array
  const safePrograms = Array.isArray(programs) ? programs : [];

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + visibleItems >= safePrograms.length ? 0 : prevIndex + 1
    );
  }, [visibleItems, safePrograms.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, safePrograms.length - visibleItems) : prevIndex - 1
    );
  }, [visibleItems, safePrograms.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [handleResize]);

  useEffect(() => {
    if (safePrograms.length === 0) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, nextSlide, safePrograms.length]);

  // If no programs, return null or a placeholder
  if (!Array.isArray(programs) || safePrograms.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="relative p-4 sm:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-darkBlue-900/95 to-darkBlue-800/95 backdrop-blur-sm border border-white/10"
      style={{
        backgroundImage: "url('/images/pattern.svg')",
        backgroundBlendMode: 'soft-light',
        backgroundSize: '150px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-xl">
        <motion.div
          className="flex gap-4 sm:gap-6 lg:gap-8"
          animate={{
            x: `-${currentIndex * (100 / visibleItems)}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {safePrograms.map((program) => (
            <div
              key={program.id}
              className="flex-shrink-0 w-full"
              style={{ 
                width: `calc(${100 / visibleItems}% - ${visibleItems > 1 ? '1rem' : '0rem'})`,
                marginRight: visibleItems > 1 ? '1rem' : '0'
              }}
            >
              <motion.div 
                className="transform hover:scale-105 transition duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ProgramCard
                  program={{
                    ...program,
                    thumbnail: program.thumbnail || '/images/placeholder-program.svg'
                  }}
                  isFeatured={true}
                  onExplore={onExplore}
                  onQuickAddToFavorites={onQuickAddToFavorites}
                  isAuthenticated={isAuthenticated}
                  isPurchased={isPurchased(toString(program.id))}
                  onSignIn={onSignIn}
                />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
      {safePrograms.length > visibleItems && (
        <>
            <motion.button
              onClick={prevSlide}
              className="absolute top-1/2 -left-3 sm:left-0 transform -translate-y-1/2 bg-darkBlue-700/90 hover:bg-darkBlue-600/90 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-turquoise-400/50 backdrop-blur-sm border border-white/10 z-10"
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Previous slide"
            >
              <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className="absolute top-1/2 -right-3 sm:right-0 transform -translate-y-1/2 bg-darkBlue-700/90 hover:bg-darkBlue-600/90 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-turquoise-400/50 backdrop-blur-sm border border-white/10 z-10"
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Next slide"
            >
              <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          <motion.div 
            className="absolute -bottom-2 sm:bottom-0 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-darkBlue-900/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {safePrograms.slice(0, safePrograms.length - visibleItems + 1).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-turquoise-400/50 ${
                  currentIndex === index 
                    ? 'bg-turquoise-400 w-6 sm:w-8' 
                    : 'bg-darkBlue-400/50 w-2 sm:w-3 hover:bg-darkBlue-300/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Carousel;
