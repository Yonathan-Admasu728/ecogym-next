import { Metadata } from 'next';
import { Suspense } from 'react';

import ProgramListClient from '../../components/ProgramListClient';
import { mockPrograms } from '../../utils/mockData';

export const metadata: Metadata = {
  title: 'Mindfulness & Meditation Programs | EcoGym',
  description: 'Discover expert-led mindfulness and meditation programs designed to reduce stress, increase focus, and enhance your mental well-being.',
  openGraph: {
    title: 'Mindfulness & Meditation Programs | EcoGym',
    description: 'Expert-led mindfulness and meditation programs for mental well-being.',
    images: ['/images/med1.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mindfulness & Meditation Programs | EcoGym',
    description: 'Expert-led mindfulness and meditation programs for mental well-being.',
    images: ['/images/med1.png'],
  },
  // Add structured data for rich results
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Mindfulness & Meditation Programs',
      description: 'Expert-led mindfulness and meditation programs for mental well-being.',
      provider: {
        '@type': 'Organization',
        name: 'EcoGym',
        sameAs: 'https://ecogym.com',
      },
      about: {
        '@type': 'Thing',
        name: 'Mindfulness and Meditation',
      },
    }),
  },
};

// Enable ISR with revalidation every day since content changes infrequently
export const revalidate = 86400;

// Loading component
function ProgramListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 rounded w-3/4 mb-8" />
        <div className="h-24 bg-gray-300 rounded mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-300 h-64 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function MindfulnessMeditationPage(): Promise<JSX.Element> {
  // Filter programs at build time
  const programs = mockPrograms.filter(p => p.category === 'mindfulness');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            Mindfulness & Meditation Programs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our collection of mindfulness and meditation programs designed to help you find peace,
            reduce stress, and enhance your mental well-being. From guided meditations to mindfulness
            exercises, our expert instructors will help you develop a stronger mind-body connection.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Featured Programs
          </h2>
          <Suspense fallback={<ProgramListSkeleton />}>
            <ProgramListClient 
              programs={programs}
              title="Mindfulness & Meditation"
            />
          </Suspense>
        </section>

        <section className="bg-gray-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Benefits of Mindfulness & Meditation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Stress Reduction',
                description: 'Learn techniques to manage stress and anxiety effectively.'
              },
              {
                title: 'Improved Focus',
                description: 'Enhance your concentration and mental clarity.'
              },
              {
                title: 'Better Sleep',
                description: 'Develop practices for better sleep quality.'
              },
              {
                title: 'Emotional Balance',
                description: 'Gain tools for better emotional regulation.'
              },
              {
                title: 'Mind-Body Connection',
                description: 'Strengthen the connection between mind and body.'
              },
              {
                title: 'Daily Mindfulness',
                description: 'Integrate mindfulness into your daily routine.'
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Start Your Mindfulness Journey Today
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you&apos;re new to meditation or looking to deepen your practice,
            our programs cater to all experience levels. Begin your journey to
            inner peace and mental clarity today.
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Explore All Programs
          </button>
        </section>
      </div>
    </div>
  );
}
