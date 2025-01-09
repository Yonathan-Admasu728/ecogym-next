// app/meditations/page.tsx

import { Metadata } from 'next';
import MeditationsContent from './MeditationsContent';
import { fetchProgramsByCategory } from '../utils/api';
import { PROGRAM_CATEGORIES } from '../utils/programTransform';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Meditation Programs | Ecogym',
  description: 'Discover our meditation programs at Ecogym. Find inner peace and improve your mental wellbeing.',
  openGraph: {
    title: 'Meditation Programs | Ecogym',
    description: 'Discover our meditation programs at Ecogym. Find inner peace and improve your mental wellbeing.',
    url: 'https://ecogym.space/meditations',
    images: [
      {
        url: 'https://ecogym.space/images/meditation-programs.jpg',
        width: 1200,
        height: 630,
        alt: 'Meditation Programs at Ecogym',
      },
    ],
    siteName: 'Ecogym',
  },
};

export default async function MeditationsPage(): Promise<JSX.Element> {
  const programs = await fetchProgramsByCategory(PROGRAM_CATEGORIES.MEDITATION);
  
  return <MeditationsContent programs={programs} />;
}
