// app/meditations/page.tsx

import { Metadata } from 'next';
import ProgramList from '../components/ProgramList';

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

export default function MeditationsPage() {
  return <ProgramList title="Meditation Programs" category="Meditation" />;
}