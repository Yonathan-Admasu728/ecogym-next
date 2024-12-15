import { NextResponse } from 'next/server';
import { mockPrograms } from '../../../utils/mockData';

export async function GET() {
  // For demo purposes, return a subset of programs as purchased
  const purchasedPrograms = mockPrograms
    .filter(program => program.price && program.price > 0)
    .slice(0, 2);

  return NextResponse.json(purchasedPrograms);
}
