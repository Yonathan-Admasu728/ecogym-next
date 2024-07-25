// app/programs/page.tsx
import { Metadata } from 'next';
import ProgramList from '../components/ProgramList';

export const metadata: Metadata = {
  title: 'All Programs | Ecogym',
  description: 'Explore all our fitness and wellness programs at Ecogym. Find the perfect program to achieve your health goals.',
  openGraph: {
    title: 'All Programs | Ecogym',
    description: 'Explore all our fitness and wellness programs at Ecogym. Find the perfect program to achieve your health goals.',
    url: 'https://ecogym.space/programs',
    images: [
      {
        url: 'https://ecogym.space/images/all-programs.jpg',
        width: 1200,
        height: 630,
        alt: 'All Programs at Ecogym',
      },
    ],
    siteName: 'Ecogym',
  },
};

export default function AllProgramsPage() {
  return <ProgramList title="All Programs" />;
}