import { initializeApp, getApps, FirebaseOptions } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
  AuthError,
  AuthErrorCodes,
  Auth
} from 'firebase/auth';

import { logger } from '../utils/logger';

// Add production environment check at the start
if (process.env.NODE_ENV === 'production') {
  console.log('Environment check:', {
    nodeEnv: process.env.NODE_ENV,
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
}

interface FirebaseConfig extends FirebaseOptions {
  measurementId?: string;
}

class FirebaseInitError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirebaseInitError';
  }
}

// Enhanced validation with detailed logging
function validateConfig(): FirebaseConfig | null {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];

  // Add production logging
  if (process.env.NODE_ENV === 'production') {
    logger.debug('Checking environment variables in production:', {
      envVars: requiredEnvVars.map(varName => ({
        name: varName,
        exists: !!process.env[varName],
        length: process.env[varName]?.length || 0
      }))
    });
  }

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Missing Firebase configuration:', {
        missingVars,
        environment: process.env.NODE_ENV
      });
      return null;
    }
    throw new FirebaseInitError(
      `Missing required Firebase configuration: ${missingVars.join(', ')}`,
      'MISSING_CONFIG'
    );
  }

  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Enhanced logging for both development and production
  logger.debug('Firebase Config:', {
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    measurementId: config.measurementId,
    environment: process.env.NODE_ENV
  });

  return config;
}

// Initialize Firebase with enhanced error handling
const firebaseAuth: { auth: Auth | null } = (() => {
  try {
    const apps = getApps();
    
    // Debug logging for existing apps
    logger.debug('Firebase initialization start:', { 
      existingApps: apps.length,
      environment: process.env.NODE_ENV 
    });
    
    const config = validateConfig();
    
    if (!config && process.env.NODE_ENV === 'development') {
      logger.warn('Firebase not initialized in development mode due to missing config');
      return { auth: null };
    }

    if (!config) {
      const error = new FirebaseInitError('Invalid Firebase configuration');
      logger.error('Firebase config validation failed', {
        nodeEnv: process.env.NODE_ENV,
        hasConfig: !!config
      });
      throw error;
    }
    
    logger.debug('Firebase config validated successfully');
    
    const app = apps.length === 0 ? initializeApp(config) : apps[0];
    const auth = getAuth(app);
    
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence)
      .catch(error => {
        logger.error('Failed to set auth persistence', {
          error: error instanceof Error ? error.message : 'Unknown error',
          environment: process.env.NODE_ENV
        });
      });

    logger.info('Firebase initialized successfully', {
      environment: process.env.NODE_ENV
    });
    return { auth };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Firebase initialization failed', { 
      error: errorMessage,
      environment: process.env.NODE_ENV
    });
    
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Continuing in development mode with null auth');
      return { auth: null };
    }
    
    throw new FirebaseInitError('Failed to initialize Firebase');
  }
})();

const { auth } = firebaseAuth;
const googleProvider = new GoogleAuthProvider();

// Auth error handling utility
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case AuthErrorCodes.USER_DELETED:
        return 'Account not found';
      case AuthErrorCodes.INVALID_PASSWORD:
        return 'Invalid password';
      case AuthErrorCodes.EMAIL_EXISTS:
        return 'Email already in use';
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        return 'Sign in cancelled';
      case AuthErrorCodes.INVALID_EMAIL:
        return 'Invalid email address';
      case AuthErrorCodes.WEAK_PASSWORD:
        return 'Password is too weak';
      default:
        return authError.message || 'Authentication failed';
    }
  }
  return 'An unexpected error occurred';
}

// Token management
export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
  try {
    if (!auth) {
      logger.debug('Auth not initialized');
      return null;
    }

    const user = auth.currentUser;
    if (!user) {
      logger.debug('No user found when getting ID token');
      return null;
    }
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    logger.error('Failed to get ID token', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: auth?.currentUser?.uid,
    });
    return null;
  }
};

export const refreshToken = async (): Promise<string | null> => {
  return getIdToken(true);
};

// Token refresh mechanism with exponential backoff
export const setupTokenRefresh = (onTokenRefresh: (token: string) => void): (() => void) => {
  if (!auth) {
    logger.debug('Auth not initialized, skipping token refresh setup');
    return () => {};
  }

  let refreshTimeout: NodeJS.Timeout;
  let retryCount = 0;
  const MAX_RETRY_COUNT = 5;
  const BASE_RETRY_DELAY = 5000;

  const refreshTokenWithRetry = async () => {
    try {
      const token = await getIdToken(true);
      if (token) {
        onTokenRefresh(token);
        retryCount = 0;
        refreshTimeout = setTimeout(refreshTokenWithRetry, 30 * 60 * 1000);
      } else {
        handleRefreshError();
      }
    } catch (_) {
      handleRefreshError();
    }
  };

  const handleRefreshError = () => {
    if (retryCount < MAX_RETRY_COUNT) {
      retryCount++;
      const delay = Math.min(BASE_RETRY_DELAY * Math.pow(2, retryCount), 5 * 60 * 1000);
      logger.warn('Token refresh failed, retrying...', {
        retryCount,
        nextRetryDelay: delay,
      });
      refreshTimeout = setTimeout(refreshTokenWithRetry, delay);
    } else {
      logger.error('Token refresh failed after maximum retries');
    }
  };

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }

    if (user) {
      const token = await getIdToken();
      if (token) {
        onTokenRefresh(token);
        refreshTimeout = setTimeout(refreshTokenWithRetry, 30 * 60 * 1000);
      }
    }
  });

  return () => {
    unsubscribe();
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
  };
};

export { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  AuthErrorCodes
};

export type { User, AuthError };