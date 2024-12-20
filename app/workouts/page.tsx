// app/workouts/page.tsx

import { Metadata } from 'next';

import ProgramList from '../components/ProgramList';

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

export default function WorkoutsPage() {
  return <ProgramList title="Workout Programs" category="Workout" />;
}