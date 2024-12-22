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

// Log environment status at initialization
logger.info('Firebase Environment Status:', {
  nodeEnv: process.env.NODE_ENV,
  envVars: {
    apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }
});

interface FirebaseConfig extends FirebaseOptions {
  measurementId?: string;
}

class FirebaseInitError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirebaseInitError';
  }
}

function validateConfig(): FirebaseConfig {
  // Log actual values for debugging (excluding sensitive data)
  logger.info('Firebase Config Values:', {
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'missing',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'missing',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'missing',
  });

  // Validate required config values
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    throw new FirebaseInitError(
      'Missing required Firebase configuration. Please check environment variables.',
      'MISSING_CONFIG'
    );
  }

  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || undefined,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || undefined,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined
  };

  return config;
}

// Initialize Firebase with enhanced error handling
const firebaseAuth: { auth: Auth | null } = (() => {
  try {
    logger.info('Starting Firebase initialization...');
    const apps = getApps();
    logger.info('Existing Firebase apps:', apps.length);

    const config = validateConfig();
    logger.info('Config validation successful');

    // Initialize app if not already initialized
    const app = apps.length === 0 ? initializeApp(config) : apps[0];
    logger.info('Firebase app initialized');

    const auth = getAuth(app);
    
    if (!auth) {
      throw new FirebaseInitError('Auth initialization failed');
    }

    // Set persistence
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        logger.info('Auth persistence set to LOCAL');
      })
      .catch((error) => {
        logger.error('Failed to set auth persistence:', error);
      });

    logger.info('Firebase initialization complete');
    return { auth };

  } catch (error) {
    logger.error('Firebase initialization error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Running in development mode with null auth');
      return { auth: null };
    }
    
    throw error;
  }
})();

const { auth } = firebaseAuth;
const googleProvider = new GoogleAuthProvider();

// Auth error handling utility
export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const authError = err as AuthError;
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
      logger.info('Auth not initialized');
      return null;
    }

    const user = auth.currentUser;
    if (!user) {
      logger.info('No user found when getting ID token');
      return null;
    }
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    logger.error('Failed to get ID token:', error);
    return null;
  }
};

export const refreshToken = async (): Promise<string | null> => {
  return getIdToken(true);
};

// Token refresh mechanism with exponential backoff
export const setupTokenRefresh = (onTokenRefresh: (token: string) => void): (() => void) => {
  if (!auth) {
    logger.info('Auth not initialized, skipping token refresh setup');
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
    } catch (err) {
      handleRefreshError(err);
    }
  };

  const handleRefreshError = (err?: unknown) => {
    if (retryCount < MAX_RETRY_COUNT) {
      retryCount++;
      const delay = Math.min(BASE_RETRY_DELAY * Math.pow(2, retryCount), 5 * 60 * 1000);
      logger.warn('Token refresh failed, retrying...', {
        error: err,
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
