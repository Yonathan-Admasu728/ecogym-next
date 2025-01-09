import { NextRequest, NextResponse } from 'next/server';
import { Program } from '../../../types';
import { logger } from '../../../utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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
    level: 'Beginner',
    program_type: 'single_session',
    duration: '15 minutes',
    category: 'meditation',
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
    estimated_completion_days: 1,
    is_featured: true,
    featured_order: 1
  }
];

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes
export const revalidate = 0; // Disable caching for this route

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // Remove '/api' if it's already in the URL to avoid double '/api/api'
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const url = `${baseUrl}/api/programs/featured`;
    
    logger.debug('Fetching featured programs', { 
      url,
      baseUrl: API_BASE_URL 
    });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let programs: Program[] = [];

    if (response.ok) {
      const data = await response.json();
      programs = Array.isArray(data) ? data : data.results || [];
    } else {
      logger.warn('Failed to fetch from API, using fallback data', {
        status: response.status,
        statusText: response.statusText
      });
      programs = fallbackPrograms;
    }

    // Sort by featured_order if available
    const sortedPrograms = [...programs].sort((a: Program, b: Program) => 
      (a.featured_order || 0) - (b.featured_order || 0)
    );

    logger.debug('Featured programs processed', { 
      programCount: sortedPrograms.length,
      programIds: sortedPrograms.map((program: Program) => program.id)
    });

    return NextResponse.json(sortedPrograms, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    logger.error('Error fetching featured programs', { 
      error,
      baseUrl: API_BASE_URL 
    });
    // Return fallback data instead of empty array
    return NextResponse.json(fallbackPrograms);
  }
}
