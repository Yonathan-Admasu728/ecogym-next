import { NextResponse } from 'next/server';
import { mockPrograms } from '../../../utils/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const program = mockPrograms.find(p => 
    p.id.toLowerCase() === id.toLowerCase() || 
    p.category.toLowerCase() === id.toLowerCase()
  );

  if (!program) {
    return NextResponse.json(
      { error: 'Program not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(program);
}
