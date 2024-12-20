import { Metadata } from 'next';
import React, { Suspense } from 'react';

import InteractiveHomeWrapper from './components/InteractiveHomeWrapper';
import { mockPrograms } from './utils/mockData';

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

async function getFeaturedPrograms() {
  // In a real app, this would be a database call or API request
  // For now, we'll filter the mock data
  const featured = mockPrograms.filter(program => program.average_rating && program.average_rating >= 4.5);
  return featured;
}

export default async function HomePage() {
  const featuredPrograms = await getFeaturedPrograms();

  return (
    <div className="flex flex-col min-h-screen bg-darkBlue-900 text-white">
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise-400" />
          </div>
        }>
          <InteractiveHomeWrapper featuredPrograms={featuredPrograms} />
        </Suspense>
      </main>
    </div>
  );
}