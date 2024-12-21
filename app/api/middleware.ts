import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../utils/logger';
import { auth as firebaseAuth } from '../libraries/firebase-admin';

interface AuthUser {
  uid: string;
  email: string | undefined;
  role?: string;
}

interface FirebaseError extends Error {
  code?: string;
}

class AuthError extends Error {
  constructor(
    message: string,
    public status: number = 401,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}


export async function authenticateRequest(request: NextRequest): Promise<AuthUser | NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthError('Missing or invalid authorization header');
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      
      // Log successful authentication
      logger.info('User authenticated successfully', {
        uid: decodedToken.uid,
        email: decodedToken.email
      });

      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role as string | undefined
      };
    } catch (error) {
      const firebaseError = error as FirebaseError;
      logger.error('Token verification failed', {
        error: firebaseError.message,
        code: firebaseError.code,
        token: token.substring(0, 10) + '...' // Log only first 10 chars for security
      });

      if (firebaseError.code === 'auth/id-token-expired') {
        throw new AuthError('Token has expired', 401, 'TOKEN_EXPIRED');
      } else if (firebaseError.code === 'auth/id-token-revoked') {
        throw new AuthError('Token has been revoked', 401, 'TOKEN_REVOKED');
      } else {
        throw new AuthError('Invalid token', 401, 'INVALID_TOKEN');
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code 
        },
        { status: error.status }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unexpected authentication error', { error: errorMessage });
    return NextResponse.json(
      { 
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      },
      { status: 500 }
    );
  }
}

export type AuthenticatedHandler = (
  request: NextRequest, 
  user: AuthUser
) => Promise<NextResponse>;

export async function withAuth(
  request: NextRequest,
  handler: AuthenticatedHandler
): Promise<NextResponse> {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (request.method === 'OPTIONS') {
    return handler(request, { uid: '', email: undefined });
  }

  const authResult = await authenticateRequest(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    return await handler(request, authResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Handler error in authenticated route', {
      error: errorMessage,
      path: request.nextUrl.pathname,
      method: request.method
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'HANDLER_ERROR'
      },
      { status: 500 }
    );
  }
}

// Role-based authorization middleware
export function withRole(role: string) {
  return async function(
    request: NextRequest,
    handler: AuthenticatedHandler
  ): Promise<NextResponse> {
    return withAuth(request, async (req, user) => {
      if (user.role !== role) {
        logger.warn('Unauthorized role access attempt', {
          uid: user.uid,
          requiredRole: role,
          actualRole: user.role
        });

        return NextResponse.json(
          { 
            error: 'Insufficient permissions',
            code: 'INSUFFICIENT_ROLE'
          },
          { status: 403 }
        );
      }

      return handler(req, user);
    });
  };
}

// Admin-only middleware
export const withAdmin = withRole('admin');
