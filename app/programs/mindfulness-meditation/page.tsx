import { Metadata } from 'next';
import MindfulnessMeditationContent from './MindfulnessMeditationContent';
import { fetchProgramsByCategory } from '../../utils/api';
import { PROGRAM_CATEGORIES } from '../../utils/programTransform';

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

export const dynamic = 'force-dynamic';

export default async function MindfulnessMeditationPage(): Promise<JSX.Element> {
  const programs = await fetchProgramsByCategory(PROGRAM_CATEGORIES.MEDITATION);
  
  return <MindfulnessMeditationContent programs={programs} />;
}
