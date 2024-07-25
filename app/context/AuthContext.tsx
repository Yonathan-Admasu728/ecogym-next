// app/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import {
  User as FirebaseUser,
  UserCredential,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../libraries/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken(true);
        localStorage.setItem('authToken', token);
        const userObj = convertFirebaseUserToUser(firebaseUser);
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        await authenticateWithDjango(token);
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false); // Set loading to false after auth state changes
    });

    const refreshTokenInterval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken(true);
        console.log('Token refreshed');
        localStorage.setItem('authToken', token);
        await authenticateWithDjango(token);
      }
    }, 55 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(refreshTokenInterval);
    };
  }, []);

  const convertFirebaseUserToUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    first_name: firebaseUser.displayName ? firebaseUser.displayName.split(' ')[0] : '',
    last_name: firebaseUser.displayName ? firebaseUser.displayName.split(' ').slice(1).join(' ') : '',
    displayName: firebaseUser.displayName || '',
    photo_url: firebaseUser.photoURL || '',
    metadata: {
      creationTime: firebaseUser.metadata.creationTime || '',
      lastLoginTime: firebaseUser.metadata.lastSignInTime || '',
    },
  });
  
  

  const handleSignIn = async (methodName: string, method: () => Promise<UserCredential>) => {
    setError(null);
    setIsSigningIn(true);
    try {
      const userCredential = await method();
      const idToken = await userCredential.user.getIdToken();
      if (idToken) {
        console.log(`Retrieved ID Token for ${methodName}:`, idToken);
        await authenticateWithDjango(idToken);
        const userObj = convertFirebaseUserToUser(userCredential.user);
        setUser(userObj);  // Make sure this line is here
      } else {
        throw new Error('Failed to obtain ID token');
      }
    } catch (err) {
      // ... (error handling)
    } finally {
      setIsSigningIn(false);
    }
  };

  const authenticateWithDjango = async (idToken: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login/`, {
        id_token: idToken,
      });
      console.log('Authentication successful:', response.data);
    } catch (err) {
      const error = err as any;
      console.error('Authentication failed:', error.response ? error.response.data : error.message);
    }
  };

  const signInWithGoogle = () => handleSignIn('Google', async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  });

  const signInWithFacebook = () => handleSignIn('Facebook', async () => {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
  });

  const signInWithApple = () => handleSignIn('Apple', async () => {
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(auth, provider);
  });

  const signUpWithEmail = (email: string, password: string) => 
    handleSignIn('Email signup', () => createUserWithEmailAndPassword(auth, email, password));

  const signInWithEmail = (email: string, password: string) => 
    handleSignIn('Email signin', () => signInWithEmailAndPassword(auth, email, password));

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const getIdToken = async (): Promise<string | null> => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(true); // Forces refresh of the token
        console.log("Retrieved token:", token.substring(0, 10) + "...");
        return token;
      } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
      }
    }
    console.log("No current user");
    return null;
  };
  
  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
