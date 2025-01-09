import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../../../../middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; sessionId: string } }
): Promise<NextResponse> {
  return withAuth(request, async (req, user) => {
    try {
      const body = await req.json();

      const response = await fetch(
        `${API_BASE_URL}/user/${user.uid}/programs/${params.id}/sessions/${params.sessionId}/progress`,
        {
          method: 'POST',
          headers: {
            'Authorization': req.headers.get('authorization') || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update session progress');
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error updating session progress:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
