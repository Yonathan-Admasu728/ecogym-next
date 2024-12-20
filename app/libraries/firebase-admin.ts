import * as admin from 'firebase-admin';

import { logger } from '../utils/logger';

interface FirebaseAdminConfig {
  projectId: string | undefined;
  clientEmail: string | undefined;
  privateKey: string | undefined;
  databaseURL: string | undefined;
}

class FirebaseAdminError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirebaseAdminError';
  }
}

function validateConfig(): FirebaseAdminConfig {
  const config = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  };

  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new FirebaseAdminError(
      `Missing required Firebase configuration: ${missingVars.join(', ')}`,
      'MISSING_CONFIG'
    );
  }

  // Handle private key line breaks
  if (config.privateKey) {
    config.privateKey = config.privateKey.replace(/\\n/g, '\n');
  }

  return config;
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const config = validateConfig();

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      }),
      databaseURL: config.databaseURL,
    });

    logger.info('Firebase Admin initialized successfully', {
      projectId: config.projectId,
      clientEmail: config.clientEmail?.split('@')[0] + '@...', // Log only first part of email
      databaseURL: config.databaseURL,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error instanceof FirebaseAdminError ? error.code : 'INIT_ERROR';

    logger.error('Firebase Admin initialization failed', {
      error: errorMessage,
      code: errorCode,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Re-throw to prevent app from starting with invalid Firebase config
    throw new FirebaseAdminError(
      'Failed to initialize Firebase Admin. Check server logs for details.',
      errorCode
    );
  }
}

// Export initialized services
export const auth = admin.auth();
export const db = admin.firestore();

// Export admin instance for advanced use cases
export const adminInstance = admin;

// Utility functions
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
      isValid: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Token verification failed', { error: errorMessage });
    return {
      uid: null,
      email: null,
      role: null,
      isValid: false,
      error: errorMessage,
    };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to get user by email', {
      error: errorMessage,
      email: email.split('@')[0] + '@...', // Log only first part of email
    });
    throw new FirebaseAdminError('Failed to get user by email', 'USER_NOT_FOUND');
  }
}

export async function createCustomToken(uid: string) {
  try {
    const token = await auth.createCustomToken(uid);
    return token;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to create custom token', {
      error: errorMessage,
      uid,
    });
    throw new FirebaseAdminError('Failed to create custom token', 'TOKEN_CREATION_FAILED');
  }
}
