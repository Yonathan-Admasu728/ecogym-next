"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const loadFirebase = async () => {
      try {
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        setFirebaseApp(app);
        setFirebaseAuth(auth);

        onAuthStateChanged(auth, (user: User | null) => {
          setUser(user);
          setLoading(false);
        });
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setError('Failed to initialize Firebase. Please try again later.');
        setLoading(false);
      }
    };

    loadFirebase();
  }, []);

  const signIn = async () => {
    if (!firebaseAuth) {
      setError('Authentication is not initialized');
      return;
    }

    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Failed to sign in. Please try again.');
    }
  };

  const signOut = async () => {
    if (!firebaseAuth) {
      setError('Authentication is not initialized');
      return;
    }

    try {
      setError(null);
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      console.error('Sign-out error:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!user) {
      return null;
    }
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
