'use client';

import { motion } from 'framer-motion';
import React, { Suspense, useRef, useState } from 'react';
import { FaPlay, FaLeaf, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import HeroSectionClient from './HeroSectionClient';
import { logger } from '../utils/logger';

export default function HeroSection(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const retryCount = useRef(0);
  const { user } = useAuth();

  const getFirstName = (displayName: string | null) => {
    if (!displayName) return 'Friend';
    return displayName.split(' ')[0];
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    const mediaError = target.error;

    if (mediaError) {
      logger.error('Video error details:', {
        error: mediaError.message,
        code: mediaError.code,
        networkState: target.networkState,
        readyState: target.readyState
      });

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
    retryCount.current = 0;
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
        staggerChildren: 0.1
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
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-darkBlue-900"
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
                ${isLoading ? 'opacity-0' : 'opacity-75'}
                filter brightness-110 saturate-105
              `}
              preload="auto"
              aria-hidden="true"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </>
        )}
        
        {/* Light overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, 
                rgba(15, 23, 42, 0.2) 0%,
                rgba(15, 23, 42, 0.1) 50%,
                rgba(15, 23, 42, 0.2) 100%
              ),
              radial-gradient(
                circle at top right,
                rgba(45, 212, 191, 0.1),
                transparent 70%
              )
            `
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1 
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight text-white drop-shadow-md"
          variants={item}
        >
          Transform Your
          <span className="block mt-1 sm:mt-2 text-teal-200 drop-shadow-lg">
            Mind and Body
          </span>
        </motion.h1>

        <motion.p 
          className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white leading-relaxed max-w-3xl mx-auto drop-shadow-sm px-2"
          variants={item}
        >
          {user ? (
            <>
              <div className="text-teal-200 font-semibold mb-2">
                Welcome back, {getFirstName(user.displayName)}!
              </div>
              <div>
                Ready to elevate your practice? Your personalized path to wellness awaits.
              </div>
            </>
          ) : (
            "Join EcoGym for mindfulness practices, guided meditations, and effective home workouts"
          )}
        </motion.p>
        
        <motion.div 
          variants={item}
          className="w-full max-w-3xl mx-auto mb-8 sm:mb-12 px-2 sm:px-0"
        >
          <Suspense 
            fallback={
              <div className="h-14 w-full max-w-2xl mx-auto animate-pulse" />
            }
          >
            <div className="bg-darkBlue-800/40 backdrop-blur-sm rounded-xl py-4 px-4 sm:px-6 shadow-lg">
              <HeroSectionClient />
            </div>
          </Suspense>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 px-4 sm:px-0"
          variants={item}
        >
          {user ? (
            <motion.a
              href="#continue-watching"
              className="
                inline-flex items-center justify-center
                bg-teal-400 hover:bg-teal-300
                text-darkBlue-900 font-bold
                px-6 sm:px-8 py-4 rounded-lg
                transition-all duration-300
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-teal-300
                w-full sm:w-auto
                min-h-[3.5rem]
                text-base sm:text-lg
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaClock className="mr-2" />
              <span>Continue Your Journey</span>
            </motion.a>
          ) : (
            <motion.a
              href="#featured-programs"
              className="
                inline-flex items-center justify-center
                bg-teal-400 hover:bg-teal-300
                text-darkBlue-900 font-bold
                px-6 sm:px-8 py-4 rounded-lg
                transition-all duration-300
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-teal-300
                w-full sm:w-auto
                min-h-[3.5rem]
                text-base sm:text-lg
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlay className="mr-2" />
              <span>Explore Programs</span>
            </motion.a>
          )}

          <motion.a
            href="#about-us"
            className="
              inline-flex items-center justify-center
              bg-white/30 hover:bg-white/40
              text-white font-bold
              px-6 sm:px-8 py-4 rounded-lg
              transition-all duration-300
              shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-white/30
              w-full sm:w-auto
              backdrop-blur-sm
              min-h-[3.5rem]
              text-base sm:text-lg
            "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaLeaf className="mr-2" />
            <span>Our Approach</span>
          </motion.a>
        </motion.div>
      </motion.div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-darkBlue-900/30 to-transparent z-20"
      />
    </section>
  );
}
