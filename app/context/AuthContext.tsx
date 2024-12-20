'use client';

import type { Auth, UserCredential } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  getIdToken,
  setupTokenRefresh
} from '../libraries/firebase';
import axiosInstance from '../utils/axiosConfig';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

interface MockUser {
  email: string;
  uid: string;
}

interface MockAuthResult {
  user: MockUser;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth functions for development mode when Firebase is not initialized
const mockAuthFunctions = {
  async signInWithEmail(email: string, _password: string): Promise<MockAuthResult> {
    logger.info('Mock sign in', { email });
    return { user: { email, uid: 'mock-uid' } };
  },
  async signUpWithEmail(email: string, _password: string): Promise<MockAuthResult> {
    logger.info('Mock sign up', { email });
    return { user: { email, uid: 'mock-uid' } };
  },
  async signInWithGoogle(): Promise<MockAuthResult> {
    logger.info('Mock Google sign in');
    return { user: { email: 'mock@google.com', uid: 'mock-google-uid' } };
  },
  async signOut(): Promise<void> {
    logger.info('Mock sign out');
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    let unsubscribe = (): void => {};

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
        setUser(user);
        
        if (user) {
          try {
            // Set up token refresh and sync with Django backend
            const token = await user.getIdToken();
            setupTokenRefresh((newToken: string) => {
              // Update axios default headers when token refreshes
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            });
            
            // Initial setup of axios headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Sync with Django backend
            await axiosInstance.post('/firebase/auth/', { token });
          } catch (error) {
            logger.error('Failed to sync with backend', error);
          }
        } else {
          // Clear axios headers when user logs out
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
        
        setLoading(false);
      });

      // Listen for auth errors
      const authErrorHandler = (event: CustomEvent): void => {
        logger.error('Auth error', { message: event.detail?.message ?? 'Unknown error' });
        void signOut();
      };
      window.addEventListener('auth-error', authErrorHandler as EventListener);

      return () => {
        unsubscribe();
        window.removeEventListener('auth-error', authErrorHandler as EventListener);
      };
    } else {
      // In development without Firebase config, just set loading to false
      setLoading(false);
      return unsubscribe;
    }
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      if (!auth) {
        if (isDevelopment) {
          const result = await mockAuthFunctions.signInWithEmail(email, password);
          setUser(result.user as unknown as User);
          return;
        }
        throw new Error('Auth not initialized');
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      const token = await result.user.getIdToken();
      await axiosInstance.post('/firebase/auth/', { token });
    } catch (error) {
      logger.error('Sign in failed', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      if (!auth) {
        if (isDevelopment) {
          const result = await mockAuthFunctions.signUpWithEmail(email, password);
          setUser(result.user as unknown as User);
          return;
        }
        throw new Error('Auth not initialized');
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      const token = await result.user.getIdToken();
      await axiosInstance.post('/firebase/auth/', { token });
    } catch (error) {
      logger.error('Sign up failed', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      if (!auth) {
        if (isDevelopment) {
          const result = await mockAuthFunctions.signInWithGoogle();
          setUser(result.user as unknown as User);
          return;
        }
        throw new Error('Auth not initialized');
      }

      const result = await signInWithPopup(auth, googleProvider)
        .catch((error: Error & { code?: string }) => {
          if (error.code === 'auth/popup-closed-by-user') {
            logger.info('Popup closed by user');
            return null;
          }
          throw error;
        });
      
      if (result) {
        setUser(result.user);
        const token = await result.user.getIdToken();
        await axiosInstance.post('/firebase/auth/', { token });
      }
    } catch (error) {
      logger.error('Google sign in failed', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      if (!auth) {
        if (isDevelopment) {
          await mockAuthFunctions.signOut();
          setUser(null);
          return;
        }
        throw new Error('Auth not initialized');
      }

      await firebaseSignOut(auth);
      setUser(null);
      delete axiosInstance.defaults.headers.common['Authorization'];
      // Clear any auth-related cache or state
      localStorage.removeItem('authToken');
    } catch (error) {
      logger.error('Sign out failed', error);
      throw error;
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken(true);
    } catch (error) {
      logger.error('Failed to get token', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
