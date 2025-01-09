import { NextRequest, NextResponse } from 'next/server';

import { Program } from '../../types';
import { withAuth } from '../middleware';
import { PROGRAM_CATEGORIES, isProgramCategory, transformProgramsResponse } from '../../utils/programTransform';
import { logger } from '../../utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes

// Fallback data when API is not available
const fallbackPrograms: Program[] = [
  {
    id: '1',
    title: 'Mindfulness Meditation',
    tagline: 'Find your inner peace',
    description: 'A beginner-friendly meditation program',
    detailed_description: 'Start your meditation journey with guided sessions.',
    sessions: [{
      id: '1',
      title: 'Introduction to Meditation',
      description: 'Learn the basics of meditation',
      duration: '15 minutes',
      duration_seconds: 900,
      order: 1,
      difficulty_level: 1,
      video_url: '',
      thumbnail: '/images/med1.png',
      is_preview: true,
      is_free: true
    }],
    total_sessions: 1,
    level: 'Beginner' as const,
    program_type: 'single_session',
    duration: '15 minutes',
    category: PROGRAM_CATEGORIES.MEDITATION,
    thumbnail: '/images/med1.png',
    trainer: {
      id: '1',
      profile_picture: '/images/trainer-sarah.png',
      user: {
        first_name: 'Sarah',
        last_name: ''
      },
      bio: 'Certified meditation instructor'
    },
    average_rating: 4.5,
    review_count: 10,
    price: 0,
    is_free: true,
    freeSessionCount: 1,
    estimated_completion_days: 1
  },
  {
    id: '2',
    title: 'HIIT Workout',
    tagline: 'High-intensity interval training',
    description: 'Burn calories and build strength with this intense workout program',
    detailed_description: 'A comprehensive HIIT program designed to maximize calorie burn and improve fitness.',
    sessions: [{
      id: '2',
      title: 'HIIT Basics',
      description: 'Introduction to high-intensity interval training',
      duration: '30 minutes',
      duration_seconds: 1800,
      order: 1,
      difficulty_level: 2,
      video_url: '',
      thumbnail: '/images/hiit.png',
      is_preview: true,
      is_free: true
    }],
    total_sessions: 1,
    level: 'Intermediate' as const,
    program_type: 'single_session',
    duration: '30 minutes',
    category: PROGRAM_CATEGORIES.WORKOUT,
    thumbnail: '/images/hiit.png',
    trainer: {
      id: '2',
      profile_picture: '/images/trainer-michael.png',
      user: {
        first_name: 'Michael',
        last_name: ''
      },
      bio: 'Certified fitness trainer'
    },
    average_rating: 4.8,
    review_count: 15,
    price: 0,
    is_free: true,
    freeSessionCount: 1,
    estimated_completion_days: 1
  },
  {
    id: '3',
    title: 'Strength Training',
    tagline: 'Build muscle and get stronger',
    description: 'A comprehensive strength training program for all levels',
    detailed_description: 'Build muscle, increase strength, and improve overall fitness with this structured program.',
    sessions: [{
      id: '3',
      title: 'Foundations of Strength',
      description: 'Learn proper form and basic movements',
      duration: '45 minutes',
      duration_seconds: 2700,
      order: 1,
      difficulty_level: 1,
      video_url: '',
      thumbnail: '/images/strength.png',
      is_preview: true,
      is_free: true
    }],
    total_sessions: 1,
    level: 'Beginner' as const,
    program_type: 'single_session',
    duration: '45 minutes',
    category: PROGRAM_CATEGORIES.WORKOUT,
    thumbnail: '/images/strength.png',
    trainer: {
      id: '3',
      profile_picture: '/images/trainer-robert.png',
      user: {
        first_name: 'Robert',
        last_name: ''
      },
      bio: 'Strength and conditioning specialist'
    },
    average_rating: 4.7,
    review_count: 12,
    price: 0,
    is_free: true,
    freeSessionCount: 1,
    estimated_completion_days: 1
  }
];

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    
    // Validate category if provided
    if (category && !isProgramCategory(category)) {
      return NextResponse.json(
        { error: `Invalid category: ${category}. Valid categories are: ${Object.values(PROGRAM_CATEGORIES).join(', ')}` },
        { status: 400 }
      );
    }

    // Forward request to backend API
    const queryParams = new URLSearchParams();
    if (category) {
      const normalizedCategory = category.toLowerCase();
      logger.debug('Processing category parameter', {
        category,
        normalizedCategory,
        isValid: isProgramCategory(category)
      });
      queryParams.append('category', normalizedCategory);
    }
    if (search) queryParams.append('search', search);
    if (tags) queryParams.append('tags', tags);

    // Remove '/api' if it's already in the URL to avoid double '/api/api'
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    let data;
    try {
      const url = `${baseUrl}/api/programs?${queryParams.toString()}`;
      logger.debug('Making API request', { url, queryParams: queryParams.toString() });
      const response = await fetch(url);

      if (response.ok) {
        data = await response.json();
      } else {
        logger.debug('API returned error, using fallback data');
        // Filter fallback programs based on category if provided
        data = {
          results: category 
            ? fallbackPrograms.filter(p => p.category.toLowerCase() === category.toLowerCase())
            : fallbackPrograms
        };
      }
    } catch (error) {
      logger.error('API request failed, using fallback data', { error });
      // Filter fallback programs based on category if provided
      data = {
        results: category 
          ? fallbackPrograms.filter(p => p.category.toLowerCase() === category.toLowerCase())
          : fallbackPrograms
      };
    }

    logger.debug('Processing API response', { rawData: data });
    const transformedResponse = transformProgramsResponse(data.results || []);
    logger.debug('Response transformation complete', {
      programCount: transformedResponse.results.length,
      workoutCount: transformedResponse.results.filter(p => p.category === 'workout').length
    });
    
    return NextResponse.json(
      transformedResponse,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    logger.error('Error in programs API', { error });
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

      // Remove '/api' if it's already in the URL to avoid double '/api/api'
      const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/programs`, {
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
      const revalidateUrl = `${baseUrl}/api/revalidate?path=/programs`;
      logger.debug('Invalidating cache', { revalidateUrl });
      await fetch(revalidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return NextResponse.json(program, { status: 201 });
    } catch (error) {
      logger.error('Error creating program', { error });
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
