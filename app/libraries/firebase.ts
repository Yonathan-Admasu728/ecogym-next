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

interface FirebaseConfig extends FirebaseOptions {
  measurementId?: string;
}

class FirebaseInitError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirebaseInitError';
  }
}

// Validate Firebase configuration
function validateConfig(): FirebaseConfig | null {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];

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

  // Log config in development (excluding sensitive info)
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Firebase Config:', {
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      measurementId: config.measurementId,
    });
  }

  return config;
}

if (process.env.NODE_ENV === 'production') {
  logger.debug('Firebase Config in Production:', {
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });
}

// Initialize Firebase
const firebaseAuth: { auth: Auth | null } = (() => {
  try {
    const apps = getApps();
    const config = validateConfig();
    
    // If no config in development, return null auth
    if (!config && process.env.NODE_ENV === 'development') {
      logger.warn('Firebase not initialized in development mode due to missing config');
      return { auth: null };
    }

    if (!config) {
      throw new FirebaseInitError('Invalid Firebase configuration');
    }
    
    const app = apps.length === 0 ? initializeApp(config) : apps[0];
    const auth = getAuth(app);
    
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence)
      .catch(_ => {
        logger.error('Failed to set auth persistence', {
          error: 'Unknown error',
        });
      });

    logger.info('Firebase initialized successfully');
    return { auth };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Firebase initialization failed', { error: errorMessage });
    
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

// For backward compatibility with axiosConfig
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
  const BASE_RETRY_DELAY = 5000; // 5 seconds

  const refreshTokenWithRetry = async () => {
    try {
      const token = await getIdToken(true);
      if (token) {
        onTokenRefresh(token);
        retryCount = 0; // Reset retry count on success
        // Schedule next refresh in 30 minutes
        refreshTimeout = setTimeout(refreshTokenWithRetry, 30 * 60 * 1000);
      } else {
        handleRefreshError();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      handleRefreshError();
    }
  };

  const handleRefreshError = () => {
    if (retryCount < MAX_RETRY_COUNT) {
      retryCount++;
      const delay = Math.min(BASE_RETRY_DELAY * Math.pow(2, retryCount), 5 * 60 * 1000); // Max 5 minutes
      logger.warn('Token refresh failed, retrying...', {
        retryCount,
        nextRetryDelay: delay,
      });
      refreshTimeout = setTimeout(refreshTokenWithRetry, delay);
    } else {
      logger.error('Token refresh failed after maximum retries');
      // Optionally trigger a sign-out or error callback
    }
  };

  // Start listening for auth state changes
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

  // Return cleanup function
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
