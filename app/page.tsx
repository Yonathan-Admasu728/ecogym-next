import { Metadata } from 'next';
import React, { Suspense } from 'react';

import InteractiveHomeWrapper from './components/InteractiveHomeWrapper';
import { Program } from './types';
import { getFeaturedPrograms as getFeaturedProgramsService } from './services/ProgramService';
import { logger } from './utils/logger';

export const metadata: Metadata = {
  title: 'EcoGym - Transform Your Mind and Body',
  description: 'Join EcoGym for expert-led meditation, mindfulness practices, and effective home workouts. Transform your mind and body, anytime, anywhere.',
  openGraph: {
    title: 'EcoGym - Transform Your Mind and Body',
    description: 'Expert-led meditation, mindfulness practices, and effective home workouts.',
    images: ['/images/about-hero.jpg'],
    type: 'website',
  },
};

// Enable ISR with revalidation every hour
export const revalidate = 3600;

async function getFeaturedPrograms(): Promise<Program[]> {
  try {
    const programs = await getFeaturedProgramsService();
    if (!Array.isArray(programs)) {
      logger.error('Featured programs is not an array', { programs });
      return [];
    }
    logger.debug('Featured programs fetched', { programCount: programs.length });
    return programs;
  } catch (error) {
    logger.error('Failed to fetch featured programs', { error });
    return [];
  }
}

export default async function HomePage(): Promise<JSX.Element> {
  const featuredPrograms = await getFeaturedPrograms();

  return (
    <div className="flex flex-col min-h-screen bg-darkBlue-900 text-white">
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise-400" />
          </div>
        }>
          <InteractiveHomeWrapper 
            featuredPrograms={featuredPrograms}
          />
        </Suspense>
      </main>
    </div>
  );
}
