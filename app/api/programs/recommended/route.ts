import { NextResponse } from 'next/server';
import { mockPrograms } from '../../../utils/mockData';

export async function GET() {
  // For demo purposes, return a random selection of programs as recommendations
  const recommendedPrograms = mockPrograms
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return NextResponse.json(recommendedPrograms);
}
