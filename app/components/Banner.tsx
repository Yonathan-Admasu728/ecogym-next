// app/components/Banner.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

import { logger } from '../utils/logger';

const Banner = (): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({ threshold: 0 });
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const textOptions = [
    "Mindful Meditation",
    "Energizing Workouts",
    "Holistic Wellness"
  ];

  const rotateText = useCallback(() => {
    setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textOptions.length);
  }, [textOptions.length]);

  const handleVideoError = (error: unknown) => {
    logger.error('Error playing banner video', error);
    setVideoError(true);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (inView && videoElement) {
      videoElement.play().catch(handleVideoError);
    }

    const textInterval = setInterval(rotateText, 5000); // Change text every 5 seconds

    return () => {
      clearInterval(textInterval);
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [inView, rotateText]);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden" ref={ref}>
      {!videoError && (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          poster="/images/fallback2.png"
          onError={handleVideoError}
        >
          <source src="/videos/banner2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4 md:p-8 lg:p-16">
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6 }}
        >
          Elevate Your Wellbeing
        </motion.h1>
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl mb-8 shadow-xl border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentTextIndex}
              className="text-3xl md:text-4xl lg:text-5xl font-semibold h-16 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {textOptions[currentTextIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.p 
          className="max-w-2xl text-xl md:text-2xl lg:text-3xl mb-10 bg-black/30 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/10"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Unlock your potential with our 
          <span className="text-turquoise-400 font-semibold"> expert-led guided meditations and invigorating fitness programs</span>. 
          Transform your mind and body from the comfort of your home.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link 
            href="/#featured-programs" 
            className="bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900 px-8 py-4 rounded-xl text-xl font-semibold hover:from-turquoise-400 hover:to-turquoise-300 transition-all duration-300 transform hover:-translate-y-1 shadow-xl focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900"
          >
            Discover Your Path to Wellness
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
