import { NextRequest, NextResponse } from 'next/server';

import { Program, Session } from '../../../types';
import { withAuth } from '../../middleware';
import { logger } from '../../../utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const dynamic = 'force-dynamic'; // Opt out of static generation for API routes

// API session type
interface APISession {
  id: string | number;
  title?: string;
  description?: string;
  duration?: string;
  duration_seconds?: number;
  order?: number;
  difficulty_level?: number;
  video_url?: string | null;
  thumbnail?: string | null;
  is_preview?: boolean;
}

// Fallback data when API is not available
const getFallbackProgram = (id: string): Program => ({
  id,
  title: 'Sample Program',
  tagline: 'Experience the best workout',
  description: 'A comprehensive fitness program',
  full_description: 'Start your fitness journey with our guided sessions.',
  sessions: [
    {
      id: '1',
      title: 'Introduction Session',
      description: 'Get started with the basics',
      duration: '30 minutes',
      duration_seconds: 1800,
      order: 1,
      difficulty_level: 1,
      video_url: null,
      thumbnail: '/images/med1.png',
      is_preview: true
    }
  ],
  is_free: true,
  level: 'Beginner',
  duration: '30 minutes',
  category: 'workout',
  tags: 'beginner,fitness,workout',
  thumbnail: '/images/med1.png',
  trainer: {
    id: '1',
    profile_picture: '/images/trainer-sarah.png',
    user: {
      first_name: 'Sarah',
      last_name: ''
    },
    bio: 'Certified fitness instructor'
  },
  average_rating: 4.5,
  review_count: 10,
  price: 0
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    let program;
    
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
        throw new Error('Failed to fetch from external API');
      }

      program = await response.json();
    } catch (error) {
      logger.warn('Using fallback data due to API error', { error });
      program = getFallbackProgram(params.id);
    }

    // Transform the program data to match our Program interface
    const transformedProgram: Program = {
      id: program.id,
      title: program.title,
      tagline: program.tagline || '',
      description: program.description,
      detailed_description: program.full_description,
      program_type: program.sessions?.length > 1 ? 'multi_session_linear' : 'single_session',
      is_free: program.is_free || false,
      isFree: program.is_free || false,
      level: program.difficulty || 'All Levels',
      sessions: (program.sessions || []).map((session: APISession): Session => ({
        id: String(session.id),
        title: session.title || '',
        description: session.description || '',
        duration: session.duration || '0 minutes',
        duration_seconds: session.duration_seconds || 0,
        order: session.order || 0,
        difficulty_level: session.difficulty_level || 1,
        video_url: session.video_url || null,
        thumbnail: session.thumbnail || null,
        is_preview: session.is_preview || false,
        equipment_needed: [],
        key_learnings: []
      })),
      duration: program.duration || '0 minutes',
      total_sessions: program.sessions?.length || 0,
      category: program.category.toLowerCase() as 'workout' | 'meditation' | 'Loading...',
      subcategories: program.tags ? program.tags.match(/[a-z]+/g) || [] : [],
      thumbnail: program.thumbnail.includes('ecogym-django-project-bucket') ? 
        `/images/${program.thumbnail.split('/').pop()}` : program.thumbnail,
      thumbnailUrl: program.thumbnail.includes('ecogym-django-project-bucket') ? 
        `/images/${program.thumbnail.split('/').pop()}` : program.thumbnail,
      trainer: program.trainer ? {
        id: program.trainer.id,
        profile_picture: program.trainer.profile_picture.includes('ecogym-django-project-bucket') ? 
          `/images/${program.trainer.profile_picture.split('/').pop()}` : program.trainer.profile_picture,
        user: program.trainer.user,
        bio: program.trainer.bio,
        specialties: []
      } : undefined,
      average_rating: program.average_rating,
      review_count: program.review_count,
      price: program.price ? parseFloat(program.price) : undefined,
      stripe_price_id: program.stripe_price_id,
      features: [],
      learning_outcomes: [],
      prerequisites: {
        fitness_level: '',
        equipment: [],
        prior_experience: []
      },
      community_features: {
        has_community_chat: false,
        has_trainer_qa: false,
        has_progress_sharing: false
      },
      estimated_completion_days: program.duration.includes('days') ? 
        parseInt(program.duration.match(/\d+/)?.[0] || '1') : 
        program.duration.includes('weeks') ? 
          parseInt(program.duration.match(/\d+/)?.[0] || '1') * 7 : 
          program.duration.includes('minutes') ? 1 : 1,
      recommended_schedule: {
        sessions_per_week: program.sessions?.length > 1 ? 
          Math.ceil(program.sessions.length / (
            program.duration.includes('weeks') ? parseInt(program.duration.match(/\d+/)?.[0] || '1') : 
            program.duration.includes('days') ? Math.ceil(parseInt(program.duration.match(/\d+/)?.[0] || '1') / 7) : 
            1
          )) : 1,
        rest_days: [0] // Sunday as default rest day
      }
    };

    // Set cache headers
    return NextResponse.json(
      transformedProgram,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    logger.error('Error in program detail API', { error });
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
      logger.error('Error updating program', { error });
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
      logger.error('Error deleting program', { error });
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
