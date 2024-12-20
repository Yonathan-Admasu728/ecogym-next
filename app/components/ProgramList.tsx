'use client';

import { Suspense } from 'react';
import { Program } from '../types';
import ProgramListClient from './ProgramListClient';
import { fetchPrograms, fetchProgramsByCategory } from '../utils/api';

interface ProgramListProps {
  category?: string;
  title: string;
  initialPrograms?: Program[];
}

async function fetchProgramData(category?: string, initialPrograms?: Program[]): Promise<Program[]> {
  return initialPrograms ?? (
    category 
      ? await fetchProgramsByCategory(category)
      : await fetchPrograms()
  );
}

export default function ProgramList({ 
  category, 
  title, 
  initialPrograms 
}: ProgramListProps): JSX.Element {
  return (
    <Suspense fallback={<div>Loading programs...</div>}>
      <ProgramListContent 
        category={category} 
        title={title} 
        initialPrograms={initialPrograms} 
      />
    </Suspense>
  );
}

async function ProgramListContent({ 
  category, 
  title, 
  initialPrograms 
}: ProgramListProps): Promise<JSX.Element> {
  const programs = await fetchProgramData(category, initialPrograms);
  return <ProgramListClient programs={programs} title={title} />;
}
