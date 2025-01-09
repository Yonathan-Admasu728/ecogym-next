import * as admin from 'firebase-admin';

import { logger } from '../utils/logger';

interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL?: string;
}

class FirebaseAdminError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirebaseAdminError';
  }
}

function validateConfig(): FirebaseAdminConfig {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;

  // Check required credentials
  if (!projectId || !clientEmail || !privateKey) {
    const missingVars = [
      !projectId && 'FIREBASE_PROJECT_ID',
      !clientEmail && 'FIREBASE_CLIENT_EMAIL',
      !privateKey && 'FIREBASE_PRIVATE_KEY',
    ].filter(Boolean);

    throw new FirebaseAdminError(
      `Missing required Firebase configuration: ${missingVars.join(', ')}`,
      'MISSING_CONFIG'
    );
  }

  // Handle private key formatting
  let formattedPrivateKey = privateKey;
  
  // Log original key for debugging
  logger.debug('Original private key', {
    length: privateKey.length,
    hasQuotes: privateKey.startsWith('"') && privateKey.endsWith('"'),
    hasNewlines: privateKey.includes('\n'),
    hasEscapedNewlines: privateKey.includes('\\n'),
  });
  
  // Remove quotes if present
  if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
    formattedPrivateKey = formattedPrivateKey.slice(1, -1);
  }
  
  // If the key doesn't have actual newlines but has \n, replace them
  if (!formattedPrivateKey.includes('\n') && formattedPrivateKey.includes('\\n')) {
    formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n');
  }
  
  // If the key has actual newlines, use them as is
  // This handles the case where the key in .env.local has real newlines
  
  // Log formatted key for debugging
  logger.debug('Formatted private key', {
    length: formattedPrivateKey.length,
    hasPemHeaders: formattedPrivateKey.includes('-----BEGIN PRIVATE KEY-----') && 
                   formattedPrivateKey.includes('-----END PRIVATE KEY-----'),
    hasNewlines: formattedPrivateKey.includes('\n'),
  });
  
  // Ensure the key has the correct format
  if (!formattedPrivateKey.includes('-----BEGIN PRIVATE KEY-----') || 
      !formattedPrivateKey.includes('-----END PRIVATE KEY-----')) {
    throw new FirebaseAdminError(
      'Invalid private key format. Must be a valid PEM formatted private key.',
      'INVALID_PRIVATE_KEY'
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: formattedPrivateKey,
    ...(databaseURL && { databaseURL }),
  };
}

// Initialize Firebase Admin
logger.debug('Checking Firebase Admin initialization', {
  appsLength: admin.apps.length,
  apps: admin.apps.map(app => app?.name || 'null')
});

if (!admin.apps.length) {
  logger.debug('Initializing Firebase Admin');
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
      clientEmail: config.clientEmail.split('@')[0] + '@...', // Log only first part of email
      databaseURL: config.databaseURL,
    });
  } catch (error) {
    if (error instanceof FirebaseAdminError) {
      // Re-throw Firebase admin configuration errors
      throw error;
    }
    // Handle other initialization errors
    logger.error('Firebase Admin initialization failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new FirebaseAdminError('Failed to initialize Firebase Admin', 'INIT_ERROR');
  }
}

// Export initialized services
export const auth = admin.auth();
export const db = admin.firestore();

// Export admin instance for advanced use cases
export const adminInstance = admin;

interface TokenVerificationResult {
  uid: string | null;
  email: string | null;
  role: string | null;
  isValid: boolean;
  error?: string;
}

interface UserRecord {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Utility functions
export async function verifyIdToken(token: string): Promise<TokenVerificationResult> {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      role: decodedToken.role || null,
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

export async function getUserByEmail(email: string): Promise<UserRecord> {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return {
      uid: userRecord.uid,
      email: userRecord.email || null,
      displayName: userRecord.displayName || null,
      photoURL: userRecord.photoURL || null,
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

export async function createCustomToken(uid: string): Promise<string> {
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
