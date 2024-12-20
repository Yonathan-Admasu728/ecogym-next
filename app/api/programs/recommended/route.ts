import { NextRequest, NextResponse } from 'next/server';

import { Program } from '../../../types';
import { withAuth } from '../../middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // Parse query parameters for filtering recommendations
      const { searchParams } = new URL(req.url);
      const level = searchParams.get('level');
      const categories = searchParams.get('categories');
      const maxPrice = searchParams.get('maxPrice');
      const limit = searchParams.get('limit');

      // Build query string
      const queryParams = new URLSearchParams();
      if (level) queryParams.append('level', level);
      if (categories) queryParams.append('categories', categories);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      if (limit) queryParams.append('limit', limit);

      // Fetch recommended programs from backend
      const response = await fetch(
        `${API_BASE_URL}/programs/recommended?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': req.headers.get('authorization') || '',
            'Content-Type': 'application/json',
          },
          next: {
            revalidate: 300 // Cache for 5 minutes since recommendations are personalized
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
        throw new Error(error.message || 'Failed to fetch recommended programs');
      }

      const programs: {
        forYou: Program[];
        basedOnHistory: Program[];
        similar: Program[];
        trending: Program[];
      } = await response.json();

      // Set cache headers - shorter cache time since these are personalized
      return NextResponse.json(
        programs,
        {
          headers: {
            'Cache-Control': 'private, max-age=300, must-revalidate',
          },
        }
      );
    } catch (error) {
      console.error('Error in recommended programs API:', error);
      
      // If the backend is unavailable, return empty arrays to prevent UI breakage
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return NextResponse.json(
          {
            forYou: [],
            basedOnHistory: [],
            similar: [],
            trending: []
          },
          {
            headers: {
              'Cache-Control': 'private, max-age=60, must-revalidate', // Short cache for errors
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

// Helper function to get user's completed programs for better recommendations
async function getUserCompletedPrograms(token: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/progress`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const progress = await response.json();
    return progress.completed_programs || [];
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
}

// No POST/PUT/DELETE methods needed for recommended programs as they are generated automatically
