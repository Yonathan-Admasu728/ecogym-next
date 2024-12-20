import { Program } from '../types';
import ProgramListClient from './ProgramListClient';
import { fetchPrograms, fetchProgramsByCategory } from '../utils/api';

interface ProgramListProps {
  category?: string;
  title: string;
  initialPrograms?: Program[];
}

export default async function ProgramList({ 
  category, 
  title, 
  initialPrograms 
}: ProgramListProps) {
  // If initialPrograms is provided (SSG/SSR), use that
  // Otherwise fetch programs server-side (SSR)
  const programs = initialPrograms ?? (
    category 
      ? await fetchProgramsByCategory(category)
      : await fetchPrograms()
  );

  return <ProgramListClient programs={programs} title={title} />;
}
