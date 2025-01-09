import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../libraries/firebase-admin';
import { logger } from '../../utils/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { token } = await request.json();

    if (!token) {
      logger.warn('Auth attempt without token');
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      logger.debug('Token verified successfully', { 
        uid: decodedToken.uid,
        email: decodedToken.email 
      });
      return NextResponse.json({
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role
      });
    } catch (_tokenError) {
      logger.warn('Invalid token provided', { error: _tokenError });
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (_parseError) {
    logger.error('Error parsing auth request', { error: _parseError });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
