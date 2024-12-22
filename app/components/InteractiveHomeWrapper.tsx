'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import { Program } from '../types';

import HeroSection from './HeroSection';
import ContinueWatching from './ContinueWatching';
import ComingSoonPrograms from './ComingSoonPrograms';
import ProgramList from './ProgramList';
import CallToAction from './CallToAction';

interface InteractiveHomeWrapperProps {
  featuredPrograms: Program[];
}

const InteractiveHomeWrapper = ({ featuredPrograms }: InteractiveHomeWrapperProps): JSX.Element => {
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
        <section id="continue-watching" className="py-16 bg-darkBlue-800">
          <div className="container mx-auto px-4">
            <ContinueWatching />
          </div>
        </section>
      )}

      <section id="featured-programs" className="py-16 bg-darkBlue-900">
        <div className="container mx-auto px-4">
          <ProgramList 
            title="Featured Programs"
            programs={featuredPrograms}
          />
        </div>
      </section>

      <section id="coming-soon" className="py-16 bg-darkBlue-800">
        <div className="container mx-auto px-4">
          <ComingSoonPrograms />
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default InteractiveHomeWrapper;
