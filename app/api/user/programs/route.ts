import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middleware';
import { logger } from '../../../utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withAuth(request, async (req, user) => {
    try {
      // Fetch user's programs from backend with retry logic
      let response;
      let retryCount = 0;
      const maxRetries = 3;
      const baseDelay = 1000; // 1 second

      while (retryCount < maxRetries) {
        try {
          response = await fetch(
            `${API_BASE_URL}/api/user/${user.uid}/programs`,
            {
              headers: {
                'Authorization': req.headers.get('authorization') || '',
                'Content-Type': 'application/json',
              },
              cache: 'no-store'
            }
          );

          if (response.status !== 429) {
            break;
          }

          // Get retry delay from response header or use exponential backoff
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, retryCount);
          
          // If delay is too long, return empty response
          if (delay > 10000) {
            logger.warn('Rate limit retry delay too long, returning empty response', { 
              delay,
              userId: user.uid,
              retryCount 
            });
            return NextResponse.json({
              purchased_programs: [],
              favorite_programs: [],
              watch_later_programs: []
            });
          }
          
          logger.debug('Rate limited, retrying', { 
            delay,
            userId: user.uid,
            retryCount,
            maxRetries 
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
        } catch (error) {
          logger.error('Error fetching user programs', { 
            error,
            userId: user.uid,
            retryCount 
          });
          return NextResponse.json({
            purchased_programs: [],
            favorite_programs: [],
            watch_later_programs: []
          });
        }
      }

      // Check response after retries
      if (!response?.ok) {
        if (response?.status === 429) {
          logger.warn('Rate limit exceeded after retries', { 
            userId: user.uid,
            retryCount,
            status: response.status 
          });
          // Return empty data instead of throwing error
          return NextResponse.json({
            purchased_programs: [],
            favorite_programs: [],
            watch_later_programs: []
          });
        }
        logger.warn('Non-OK response from API', { 
          userId: user.uid,
          status: response?.status 
        });
        // Return empty arrays for any error response
        return NextResponse.json({
          purchased_programs: [],
          favorite_programs: [],
          watch_later_programs: []
        });
      }

      // Try to parse response as JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        logger.warn('Error parsing response', { 
          error: parseError,
          userId: user.uid 
        });
        return NextResponse.json({
          purchased_programs: [],
          favorite_programs: [],
          watch_later_programs: []
        });
      }

      logger.debug('Successfully fetched user programs', {
        userId: user.uid,
        purchasedCount: data.purchased_programs?.length || 0,
        favoriteCount: data.favorite_programs?.length || 0,
        watchLaterCount: data.watch_later_programs?.length || 0
      });

      return NextResponse.json({
        purchased_programs: data.purchased_programs || [],
        favorite_programs: data.favorite_programs || [],
        watch_later_programs: data.watch_later_programs || []
      });
    } catch (error) {
      logger.error('Error in user programs API', { 
        error,
        userId: user.uid 
      });
      
      // Return empty arrays to prevent UI breakage
      return NextResponse.json({
        purchased_programs: [],
        favorite_programs: [],
        watch_later_programs: []
      });
    }
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withAuth(request, async (req, user) => {
    try {
      const body = await req.json();

      logger.debug('Updating user programs', {
        userId: user.uid,
        body
      });

      // Forward to backend API
      const response = await fetch(
        `${API_BASE_URL}/api/user/${user.uid}/programs`,
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
        throw new Error(error.message || 'Failed to update user programs');
      }

      const data = await response.json();
      logger.debug('Successfully updated user programs', {
        userId: user.uid,
        data
      });

      return NextResponse.json(data);
    } catch (error) {
      logger.error('Error updating user programs', { 
        error,
        userId: user.uid 
      });
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}
