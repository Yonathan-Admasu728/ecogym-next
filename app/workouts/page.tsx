import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchProgramsByCategory } from '../utils/api';
import { PROGRAM_CATEGORIES } from '../utils/programTransform';
import WorkoutsContent from './WorkoutsContent';
import { logger } from '../utils/logger';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Workout Programs | Ecogym',
  description: 'Explore our diverse workout programs at Ecogym. Transform your body and improve your fitness.',
  openGraph: {
    title: 'Workout Programs | Ecogym',
    description: 'Explore our diverse workout programs at Ecogym. Transform your body and improve your fitness.',
    url: 'https://ecogym.space/workouts',
    images: [
      {
        url: 'https://ecogym.space/images/workout-programs.jpg',
        width: 1200,
        height: 630,
        alt: 'Workout Programs at Ecogym',
      },
    ],
    siteName: 'Ecogym',
  },
};

export default async function WorkoutsPage(): Promise<JSX.Element> {
  try {
    logger.debug('Fetching workout programs', { category: PROGRAM_CATEGORIES.WORKOUT });
    const programs = await fetchProgramsByCategory(PROGRAM_CATEGORIES.WORKOUT);
    logger.debug('Workout programs fetched', { programCount: programs.length });
    
    return (
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise-400" />
        </div>
      }>
        <WorkoutsContent programs={programs} />
      </Suspense>
    );
  } catch (error) {
    logger.error('Error loading workouts', { error });
    return (
      <div className="min-h-screen bg-darkBlue-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Unable to load workouts</h1>
          <p className="text-lightBlue-100">Please try again later</p>
        </div>
      </div>
    );
  }
}
