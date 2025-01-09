'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import { Program } from '../types';

import HeroSection from './HeroSection';
import DailyCompass from './DailyCompass';
import ContinueWatching from './ContinueWatching';
import ComingSoonPrograms from './ComingSoonPrograms';
import ProgramList from './ProgramList';
import CallToAction from './CallToAction';
import Testimonials from './Testimonials';

interface InteractiveHomeWrapperProps {
  featuredPrograms: Program[];
}

const InteractiveHomeWrapper = ({ 
  featuredPrograms 
}: InteractiveHomeWrapperProps): JSX.Element => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        logger.error('Error initializing InteractiveHomeWrapper:', error);
        setIsLoading(false);
      }
    };

    initializeComponent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-darkBlue-700/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      {user && (
        <section id="daily-compass" className="py-8 bg-darkBlue-900 scroll-mt-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Daily Compass</h2>
              <DailyCompass />
            </motion.div>
          </div>
        </section>
      )}

      <section id="journey" className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-darkBlue-900 to-darkBlue-800">
          <Image
            src="/images/pattern.svg"
            alt=""
            fill
            style={{ objectFit: "cover" }}
            className="opacity-5 mix-blend-overlay"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-white">Your Wellness Journey</h2>
              <p className="text-base md:text-lg text-lightBlue-100 mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto">
                Experience a transformative approach combining ancient wisdom with modern science for better health and well-being.
              </p>
            </motion.div>

            <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 gap-4 md:gap-8 snap-x snap-mandatory md:snap-none">
              <motion.div 
                className="relative flex-shrink-0 w-[280px] md:w-auto snap-center p-6 bg-gradient-to-b from-darkBlue-800/50 to-darkBlue-900/50 backdrop-blur-sm rounded-xl border border-turquoise-400/20 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-turquoise-400 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">1</div>
                <h3 className="text-xl font-semibold mb-3 text-teal-200 group-hover:text-turquoise-400 transition-colors duration-300">Choose Your Path</h3>
                <p className="text-lightBlue-100 mb-4">Explore our curated collection of mindfulness and fitness programs.</p>
                <div className="text-sm text-lightBlue-200 bg-darkBlue-800/30 rounded-lg p-3">
                  <span className="block text-turquoise-400 font-medium mb-1">Mind-Body Connection</span>
                  Integrating mindfulness with physical wellness
                </div>
              </motion.div>

              <motion.div 
                className="relative flex-shrink-0 w-[280px] md:w-auto snap-center p-6 bg-gradient-to-b from-darkBlue-800/50 to-darkBlue-900/50 backdrop-blur-sm rounded-xl border border-turquoise-400/20 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-turquoise-400 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">2</div>
                <h3 className="text-xl font-semibold mb-3 text-teal-200 group-hover:text-turquoise-400 transition-colors duration-300">Expert Guidance</h3>
                <p className="text-lightBlue-100 mb-4">Learn from certified instructors using proven techniques.</p>
                <div className="text-sm text-lightBlue-200 bg-darkBlue-800/30 rounded-lg p-3">
                  <span className="block text-turquoise-400 font-medium mb-1">Flexible Learning</span>
                  Access sessions anywhere, anytime that fits you
                </div>
              </motion.div>

              <motion.div 
                className="relative flex-shrink-0 w-[280px] md:w-auto snap-center p-6 bg-gradient-to-b from-darkBlue-800/50 to-darkBlue-900/50 backdrop-blur-sm rounded-xl border border-turquoise-400/20 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-turquoise-400 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">3</div>
                <h3 className="text-xl font-semibold mb-3 text-teal-200 group-hover:text-turquoise-400 transition-colors duration-300">Practice & Progress</h3>
                <p className="text-lightBlue-100 mb-4">Build lasting habits at your own sustainable pace.</p>
                <div className="text-sm text-lightBlue-200 bg-darkBlue-800/30 rounded-lg p-3">
                  <span className="block text-turquoise-400 font-medium mb-1">Continuous Growth</span>
                  Track progress and celebrate your milestones
                </div>
              </motion.div>
            </div>

            <motion.div
              className="hidden md:block mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a href="#featured-programs" className="inline-flex items-center text-turquoise-400 hover:text-turquoise-300 transition-colors duration-300">
                <span className="mr-2">Explore Programs</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {user && (
        <section id="continue-watching" className="py-16 bg-darkBlue-800">
          <div className="container mx-auto px-4">
            <ContinueWatching />
          </div>
        </section>
      )}

      <section id="featured-programs" className="py-24 bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 font-heading tracking-tight">
              Featured Programs
            </h2>
            <p className="text-lightBlue-100 max-w-2xl mx-auto text-lg leading-relaxed">
              Discover our carefully curated selection of transformative programs designed to enhance your mind-body wellness journey.
            </p>
          </motion.div>
          <ProgramList 
            title=""
            programs={featuredPrograms}
          />
        </div>
      </section>

      <Testimonials />

      <section id="coming-soon" className="py-16 bg-darkBlue-900">
        <div className="container mx-auto px-4">
          <ComingSoonPrograms />
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default InteractiveHomeWrapper;
