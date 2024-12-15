'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { FaGoogle } from 'react-icons/fa';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignInSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();

  useEffect(() => {
    if (user) {
      onSignInSuccess();
      onClose();
    }
  }, [user, onSignInSuccess, onClose]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError(null);
    setIsSigningIn(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      console.error('Email sign in error:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials and try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-2xl font-bold leading-6 text-gray-900 mb-4">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Dialog.Title>
          
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="email"
                name="email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                name="password"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {isSigningIn ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="mt-4 w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300 disabled:opacity-50"
          >
            <FaGoogle className="mr-2 text-red-600" /> Continue with Google
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <p className="mt-4 text-sm text-gray-600 text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="ml-1 text-blue-600 hover:underline focus:outline-none"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SignInModal;
