import { NextRequest, NextResponse } from 'next/server';

import { withAuth } from '../../middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // Get program ID from query params
      const { searchParams } = new URL(req.url);
      const programId = searchParams.get('program_id');

      if (!programId) {
        return NextResponse.json(
          { error: 'Program ID is required' },
          { status: 400 }
        );
      }

      // Check purchase status from backend
      const response = await fetch(
        `${API_BASE_URL}/payments/check-purchase/${programId}`,
        {
          headers: {
            'Authorization': req.headers.get('authorization') || '',
            'Content-Type': 'application/json',
          },
          next: {
            revalidate: 60 // Cache for 1 minute since purchase status can change
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to check purchase status');
      }

      const { purchased, accessType } = await response.json();

      // Set cache headers - short cache time since purchase status can change
      return NextResponse.json(
        {
          isPurchased: purchased,
          accessType: accessType, // 'purchase', 'subscription', or 'trial'
        },
        {
          headers: {
            'Cache-Control': 'private, max-age=60, must-revalidate',
          },
        }
      );
    } catch (error) {
      console.error('Error in check purchase status API:', error);
      
      // If the backend is unavailable, assume not purchased to prevent unauthorized access
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return NextResponse.json(
          {
            isPurchased: false,
            accessType: null
          },
          {
            headers: {
              'Cache-Control': 'private, max-age=60, must-revalidate',
            },
          }
        );
      }

      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}

// POST endpoint for checking multiple programs at once
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await req.json();
      const { programIds } = body;

      if (!Array.isArray(programIds) || programIds.length === 0) {
        return NextResponse.json(
          { error: 'Program IDs array is required' },
          { status: 400 }
        );
      }

      // Check purchase status for multiple programs
      const response = await fetch(
        `${API_BASE_URL}/payments/check-purchases`,
        {
          method: 'POST',
          headers: {
            'Authorization': req.headers.get('authorization') || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ program_ids: programIds }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to check purchase statuses');
      }

      const results = await response.json();

      // Set cache headers
      return NextResponse.json(
        results,
        {
          headers: {
            'Cache-Control': 'private, max-age=60, must-revalidate',
          },
        }
      );
    } catch (error) {
      console.error('Error in bulk check purchase status API:', error);
      
      // If the backend is unavailable, assume not purchased for all programs
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        const { programIds } = await request.json();
        return NextResponse.json(
          programIds.reduce((acc: Record<string, boolean>, id: string) => {
            acc[id] = false;
            return acc;
          }, {}),
          {
            headers: {
              'Cache-Control': 'private, max-age=60, must-revalidate',
            },
          }
        );
      }

      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
