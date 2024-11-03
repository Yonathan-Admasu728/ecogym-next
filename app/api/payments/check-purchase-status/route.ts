import { NextResponse } from 'next/server';

// Mock purchase data with string IDs
const mockPurchases = [
  { userId: 'user1', programId: '1' },
  { userId: 'user1', programId: '2' },
  { userId: 'user2', programId: '3' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const programId = searchParams.get('program_id');

  if (!programId) {
    return NextResponse.json({ error: 'Program ID is required' }, { status: 400 });
  }

  try {
    // TODO: Implement proper authentication check
    // For now, we'll assume the user is authenticated and has a fixed userId
    const userId = 'user1';

    const purchase = mockPurchases.find(
      p => p.userId === userId && p.programId === programId
    );

    return NextResponse.json({ purchased: !!purchase });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
