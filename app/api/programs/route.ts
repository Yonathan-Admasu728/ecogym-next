import { NextRequest, NextResponse } from 'next/server';

import { Program } from '../../types';
import { withAuth } from '../middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);
    if (tags) queryParams.append('tags', tags);

    // For public program listing, we don't require authentication
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // If there's an auth token, include it
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Fetch from backend API
    const response = await fetch(
      `${API_BASE_URL}/programs?${queryParams.toString()}`,
      {
        headers,
        next: {
          revalidate: 60 // Cache for 1 minute
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch programs');
    }

    const programs: Program[] = await response.json();

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
    console.error('Error in programs API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Protected route for creating programs
export async function POST(request: NextRequest): Promise<NextResponse> {
  return withAuth(request, async (req, user) => {
    try {
      const body = await req.json();

      // Validate required fields
      const requiredFields = ['title', 'description', 'category', 'level', 'sessions'];
      const missingFields = requiredFields.filter(field => !(field in body));

      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: `Missing required fields: ${missingFields.join(', ')}` },
          { status: 400 }
        );
      }

      // Forward to backend API
      const response = await fetch(`${API_BASE_URL}/programs`, {
        method: 'POST',
        headers: {
          'Authorization': req.headers.get('authorization') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          created_by: user.uid // Include the user ID from Firebase
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create program');
      }

      const program = await response.json();

      // Invalidate the programs cache
      await fetch(`${API_BASE_URL}/api/revalidate?path=/programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return NextResponse.json(program, { status: 201 });
    } catch (error) {
      console.error('Error creating program:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
