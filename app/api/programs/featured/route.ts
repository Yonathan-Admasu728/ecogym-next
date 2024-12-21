import { NextRequest, NextResponse } from 'next/server';

import { Program } from '../../../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // If there's an auth token, include it for personalized recommendations
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Fetch featured programs from backend
    const response = await fetch(
      `${API_BASE_URL}/programs/featured`,
      {
        headers,
        next: {
          revalidate: 3600 // Cache for 1 hour since featured programs don't change often
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch featured programs');
    }

    const programs: {
      featured: Program[];
      topRated: Program[];
      new: Program[];
    } = await response.json();

    // Set cache headers
    return NextResponse.json(
      programs,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error in featured programs API:', error);
    
    // If the backend is unavailable, return empty arrays to prevent UI breakage
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      return NextResponse.json(
        {
          featured: [],
          topRated: [],
          new: []
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Short cache for errors
          },
        }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// No POST/PUT/DELETE methods needed for featured programs as they are managed through the main programs endpoints
