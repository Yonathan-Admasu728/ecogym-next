// app/components/Banner.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';

const Banner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({ threshold: 0 });
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const textOptions = [
    "Transform Your Body",
    "Calm Your Mind",
    "Elevate Your Spirit"
  ];

  const rotateText = useCallback(() => {
    setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textOptions.length);
  }, [textOptions.length]);

  useEffect(() => {
    let videoElement = videoRef.current;
    if (inView && videoElement) {
      videoElement.play().catch(error => console.error("Error playing video:", error));
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
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        poster="/images/fallback2.png"
      >
        <source src="https://res.cloudinary.com/dctjqcupv/video/upload/v1/banner2_nhffpp" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4 md:p-8 lg:p-16">
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6 }}
        >
          Welcome to Ecogym
        </motion.h1>
        <div className="bg-black bg-opacity-30 p-4 rounded-lg mb-8">
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
          className="max-w-2xl text-xl md:text-2xl lg:text-3xl mb-10 bg-black bg-opacity-30 p-4 rounded-lg"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Join our community of wellness seekers and experience 
          <span className="text-turquoise font-semibold"> personalized fitness journeys </span> 
          guided by expert coaches.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link 
            href="/dashboard" 
            className="bg-turquoise text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-turquoise transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Your Journey Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;