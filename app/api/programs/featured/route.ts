import { NextResponse } from 'next/server';
import { mockPrograms } from '../../../utils/mockData';

export async function GET() {
  // For now, return the first 3 programs as featured
  const featuredPrograms = mockPrograms.slice(0, 3);
  return NextResponse.json(featuredPrograms);
}
