'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import ProgramCard from './ProgramCard';
import { Program } from '../types';

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
      className="relative p-4 sm:p-6 md:p-8 rounded-lg bg-gradient-to-br from-darkBlue-900 to-darkBlue-800"
      style={{
        backgroundImage: "url('/images/pattern.svg')",
        backgroundBlendMode: 'overlay',
        backgroundSize: '200px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{
            x: `-${currentIndex * (100 / visibleItems)}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {safePrograms.map((program) => (
            <div
              key={program.id}
              className="flex-shrink-0 w-full px-2 sm:px-3 md:px-4"
              style={{ width: `${100 / visibleItems}%` }}
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
                  isPurchased={isPurchased(program.id)}
                  onSignIn={onSignIn}
                />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
      {safePrograms.length > visibleItems && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-darkBlue-700 bg-opacity-50 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full shadow-lg transition duration-300 focus:outline-none"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-darkBlue-700 bg-opacity-50 hover:bg-opacity-75 text-white p-2 sm:p-3 rounded-full shadow-lg transition duration-300 focus:outline-none"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {safePrograms.slice(0, safePrograms.length - visibleItems + 1).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 focus:outline-none ${
                  currentIndex === index ? 'bg-turquoise-400 w-4 sm:w-6' : 'bg-darkBlue-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Carousel;
