import { NextResponse } from 'next/server';
import { mockPrograms } from '../../utils/mockData';

export async function GET() {
  return NextResponse.json(mockPrograms);
}
