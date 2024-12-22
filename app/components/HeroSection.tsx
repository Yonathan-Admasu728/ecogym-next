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
                transition-all duration-1000
                ${isLoading ? 'opacity-0' : 'opacity-70'}
                filter brightness-110 saturate-[1.15] contrast-[1.05] hue-rotate-[-2deg]
              `}
              preload="auto"
              aria-hidden="true"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </>
        )}
        <div 
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(88, 28, 135, 0.45),
                rgba(55, 48, 163, 0.40),
                rgba(13, 148, 136, 0.35)
              ),
              radial-gradient(
                circle at top right,
                rgba(45, 212, 191, 0.25),
                transparent 70%
              ),
              radial-gradient(
                circle at bottom left,
                rgba(167, 139, 250, 0.2),
                transparent 60%
              ),
              radial-gradient(
                circle at center,
                rgba(56, 189, 248, 0.1),
                transparent 50%
              )
            `,
            mixBlendMode: 'soft-light',
            animation: 'gradientShift 20s ease infinite',
            backdropFilter: 'blur(2px) brightness(1.1) saturate(1.1)'
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
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-10 leading-tight tracking-tighter"
          variants={item}
        >
          Transform Your
          <motion.span 
            className="bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-cyan-200 to-sky-200 block mt-4 drop-shadow-[0_0_20px_rgba(45,212,191,0.15)]"
            animate={{ 
              opacity: [1, 0.85, 1],
              scale: [1, 1.02, 1],
              filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
          >
            Mind and Body
          </motion.span>
        </motion.h1>

        <motion.p 
          className="text-lg sm:text-xl md:text-2xl mb-12 text-lightBlue-100 leading-relaxed glass-effect px-8 py-4 rounded-2xl inline-block shadow-lg"
          variants={item}
        >
          {user ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-teal-200/90 font-semibold mb-2 tracking-wide"
              >
                Welcome back, {user.displayName || 'Friend'}!
              </motion.div>
              <div className="text-lightBlue-100">
                Continue your wellness journey with personalized programs and guided sessions
              </div>
            </>
          ) : (
            "Join EcoGym for mindfulness practices, guided meditations, and effective home workouts"
          )}
        </motion.p>
        
        <motion.div 
          variants={item}
          className="w-full max-w-2xl mx-auto mb-12"
        >
          <Suspense 
            fallback={
              <div className="h-14 w-full max-w-2xl mx-auto bg-darkBlue-700/50 backdrop-blur-sm animate-pulse rounded-xl mb-10" />
            }
          >
            <div className="glass-effect rounded-2xl py-3 px-4 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-darkBlue-900/30">
              <HeroSectionClient />
            </div>
          </Suspense>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8"
          variants={item}
        >
          {user ? (
            <motion.a
              href="#continue-watching"
              className={`
                group
                inline-flex items-center justify-center
                bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400
                text-white font-bold
                px-10 py-5 rounded-xl
                transition-all duration-300
                hover-lift hover-scale
                shadow-lg hover:shadow-xl hover:shadow-teal-500/10
                focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-darkBlue-900
                w-full sm:w-auto
                border border-teal-200/20
                backdrop-blur-sm
                gradient-animate
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaClock className="mr-2 transform transition-transform duration-300 group-hover:scale-110" />
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                Continue Your Journey
              </span>
            </motion.a>
          ) : (
            <motion.a
              href="#featured-programs"
              className={`
                group
                inline-flex items-center justify-center
                bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400
                text-white font-bold
                px-10 py-5 rounded-xl
                transition-all duration-300
                hover-lift hover-scale
                shadow-lg hover:shadow-xl hover:shadow-teal-500/10
                focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-darkBlue-900
                w-full sm:w-auto
                border border-teal-200/20
                backdrop-blur-sm
                gradient-animate
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay className="mr-2 transform transition-transform duration-300 group-hover:scale-110" />
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                Explore Programs
              </span>
            </motion.a>
          )}

          <motion.a
            href="#about-us"
            className={`
              group
              inline-flex items-center justify-center
              bg-darkBlue-700/30 backdrop-blur-sm
              text-teal-200/90 font-bold
              px-10 py-5 rounded-xl
              border border-teal-200/20
              transition-all duration-300
              hover:bg-darkBlue-700/50
              hover:border-teal-200/30
              hover:text-teal-100
              hover-lift hover-scale
              shadow-lg hover:shadow-xl hover:shadow-teal-900/20
              focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-darkBlue-900
              w-full sm:w-auto
              glass-effect
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
