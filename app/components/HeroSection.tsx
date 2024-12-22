'use client';

import { motion } from 'framer-motion';
import React, { Suspense, useRef, useState } from 'react';
import { FaPlay, FaLeaf } from 'react-icons/fa';

import HeroSectionClient from './HeroSectionClient';
import { logger } from '../utils/logger';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const retryCount = useRef(0);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    const mediaError = target.error;

    // Only log actual errors, not loading state changes
    if (mediaError) {
      logger.error('Video error details:', {
        error: mediaError.message,
        code: mediaError.code,
        networkState: target.networkState,
        readyState: target.readyState
      });

      // Only retry on network errors (code 2) or decode errors (code 3)
      if ((mediaError.code === 2 || mediaError.code === 3) && retryCount.current < 3) {
        retryCount.current += 1;
        logger.info('Retrying video load', { attempt: retryCount.current });
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.load();
          }
        }, 1000);
        return;
      }

      setVideoError(true);
    }
  };

  const handleVideoPlay = () => {
    setIsLoading(false);
    retryCount.current = 0; // Reset retry count on successful play
    logger.info('Hero video started playing');
  };

  const handleLoadStart = () => {
    if (!videoRef.current?.currentTime) {
      setIsLoading(true);
      logger.info('Video load started');
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    logger.info('Video can play');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const videoUrl = "https://res.cloudinary.com/dctjqcupv/video/upload/background2_ucpljz.mp4";

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-darkBlue-900 to-darkBlue-800"
      aria-label="Hero section"
    >
     <div className="absolute inset-0 z-0">
        {!videoError && (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-darkBlue-900 animate-pulse" />
            )}
            <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onError={handleVideoError}
            onPlay={handleVideoPlay}
            onLoadStart={handleLoadStart}
            onCanPlay={handleCanPlay}
            className={`
              w-full h-full object-cover
              transition-opacity duration-1000
              ${isLoading ? 'opacity-0' : 'opacity-55'}
              filter brightness-115 saturate-[1.15] contrast-[1.02]
            `}
            preload="auto"
            aria-hidden="true"
          >
            <source src={videoUrl} type="video/mp4" />
            </video>
          </>
        )}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-800/40 via-indigo-900/35 to-turquoise-900/30 backdrop-blur-[2px]"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(107, 33, 168, 0.4), 
                rgba(67, 56, 202, 0.35),
                rgba(15, 118, 110, 0.3)
              ),
              radial-gradient(
                circle at top right,
                rgba(45, 212, 191, 0.15),
                transparent 60%
              ),
              radial-gradient(
                circle at bottom left,
                rgba(139, 92, 246, 0.1),
                transparent 50%
              )
            `,
            mixBlendMode: 'soft-light',
            animation: 'gradientShift 15s ease infinite',
            backdropFilter: 'blur(2px) brightness(1.05)'
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          variants={item}
        >
          Transform Your
          <motion.span 
            className="bg-clip-text text-transparent bg-gradient-to-r from-turquoise-400 to-turquoise-300 block mt-2"
            animate={{ 
              opacity: [1, 0.8, 1],
              scale: [1, 1.02, 1] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            Mind and Body
          </motion.span>
        </motion.h1>

        <motion.p 
          className="text-lg sm:text-xl md:text-2xl mb-8 text-lightBlue-100 leading-relaxed"
          variants={item}
        >
          Join EcoGym for mindfulness practices, guided meditations, and effective home workouts
        </motion.p>
        
        <motion.div variants={item}>
          <Suspense 
            fallback={
              <div className="h-12 w-full max-w-lg mx-auto bg-darkBlue-700/50 backdrop-blur-sm animate-pulse rounded-xl mb-10" />
            }
          >
            <HeroSectionClient onSearch={onSearch} />
          </Suspense>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          variants={item}
        >
          <motion.a
            href="#featured-programs"
            className={`
              group
              inline-flex items-center justify-center
              bg-gradient-to-r from-turquoise-500 to-turquoise-400
              text-darkBlue-900 font-bold
              px-8 py-4 rounded-xl
              transition-all duration-300
              transform hover:-translate-y-1
              shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900
              w-full sm:w-auto
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay className="mr-2 transform transition-transform duration-300 group-hover:scale-110" />
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">
              Explore Programs
            </span>
          </motion.a>

          <motion.a
            href="#about-us"
            className={`
              group
              inline-flex items-center justify-center
              bg-darkBlue-700/40 backdrop-blur-sm
              text-turquoise-400 font-bold
              px-8 py-4 rounded-xl
              border-2 border-turquoise-400/30
              transition-all duration-300
              hover:bg-darkBlue-700/60
              focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900
              w-full sm:w-auto
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaLeaf className="mr-2 transform transition-transform duration-300 group-hover:rotate-12" />
            <span>Our Approach</span>
          </motion.a>
        </motion.div>
      </motion.div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-darkBlue-800 to-transparent z-20"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
        }}
      />
    </section>
  );
}
