import { NextRequest, NextResponse } from 'next/server';

import { Program } from '../../../types';
import { withAuth } from '../../middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // If there's an auth token, include it for access control
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Fetch program details from backend
    const response = await fetch(
      `${API_BASE_URL}/programs/${params.id}`,
      {
        headers,
        next: {
          revalidate: 60 // Cache for 1 minute
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Program not found' },
          { status: 404 }
        );
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch program');
    }

    const program: Program = await response.json();

    // Set cache headers
    return NextResponse.json(
      program,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error in program detail API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Protected route for updating programs
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  return withAuth(request, async (req, _user) => {
    try {
      const body = await req.json();

      // Forward to backend API
      const response = await fetch(
        `${API_BASE_URL}/programs/${params.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': req.headers.get('authorization') || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...body,
            updated_by: _user.uid
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json(
            { error: 'Program not found' },
            { status: 404 }
          );
        }
        if (response.status === 403) {
          return NextResponse.json(
            { error: 'Not authorized to update this program' },
            { status: 403 }
          );
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update program');
      }

      const program = await response.json();

      // Invalidate the program cache
      await fetch(`${API_BASE_URL}/api/revalidate?path=/programs/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return NextResponse.json(program);
    } catch (error) {
      console.error('Error updating program:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}

// Protected route for deleting programs
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  return withAuth(request, async (req, _user) => {
    try {
      // Forward to backend API
      const response = await fetch(
        `${API_BASE_URL}/programs/${params.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': req.headers.get('authorization') || '',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json(
            { error: 'Program not found' },
            { status: 404 }
          );
        }
        if (response.status === 403) {
          return NextResponse.json(
            { error: 'Not authorized to delete this program' },
            { status: 403 }
          );
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete program');
      }

      // Invalidate the programs cache
      await fetch(`${API_BASE_URL}/api/revalidate?path=/programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error('Error deleting program:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
