import { NextRequest, NextResponse } from 'next/server';

import { Program } from '../../../types';
import { withAuth } from '../../middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withAuth(request, async (req, _user) => {
    try {
      // Fetch user's purchased programs from backend
      const response = await fetch(
        `${API_BASE_URL}/user/purchased-programs`,
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
        throw new Error(error.message || 'Failed to fetch purchased programs');
      }

      const programs: {
        programs: Program[];
        total: number;
        hasActiveSubscription: boolean;
      } = await response.json();

      // Set cache headers - short cache time since purchase status can change
      return NextResponse.json(
        programs,
        {
          headers: {
            'Cache-Control': 'private, max-age=60, must-revalidate',
          },
        }
      );
    } catch (error) {
      console.error('Error in purchased programs API:', error);
      
      // If the backend is unavailable, return empty data to prevent UI breakage
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return NextResponse.json(
          {
            programs: [],
            total: 0,
            hasActiveSubscription: false
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

// No POST/PUT/DELETE methods needed for purchased programs as they are managed through the checkout process
