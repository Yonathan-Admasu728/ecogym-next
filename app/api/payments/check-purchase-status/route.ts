import { NextResponse } from 'next/server';
import { mockPrograms } from '../../../utils/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const programId = searchParams.get('program_id');

  if (!programId) {
    return NextResponse.json({ error: 'Program ID is required' }, { status: 400 });
  }

  // For demo purposes, consider programs with price > 0 as requiring purchase
  const program = mockPrograms.find(p => 
    p.id.toLowerCase() === programId.toLowerCase() ||
    p.category.toLowerCase() === programId.toLowerCase()
  );

  if (!program) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  // For demo purposes, return a random purchase status
  const isPurchased = !program.price || program.price === 0;

  return NextResponse.json({
    programId,
    isPurchased,
    requiresPurchase: !!program.price && program.price > 0
  });
}
