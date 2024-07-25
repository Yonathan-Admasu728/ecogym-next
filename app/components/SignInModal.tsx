// app/components/SignInModal.tsx

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

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
  const { user, signInWithGoogle, signInWithFacebook, signInWithApple, signUpWithEmail, signInWithEmail } = useAuth();

  useEffect(() => {
    if (user) {
      onSignInSuccess();
      onClose();
    }
  }, [user, onSignInSuccess, onClose]);

  const handleSignIn = async (method: () => Promise<void>) => {
    setError(null);
    setIsSigningIn(true);
    try {
      await method();
      // The useEffect above will handle redirection once the user state is updated
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSigningIn(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      console.error('Email sign in error:', error);
      setError('Failed to sign in. Please check your credentials and try again.');
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
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Dialog.Title>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              {isSigningIn ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500">or</span>
            <hr className="w-full border-gray-300" />
          </div>
          <div className="mt-4 space-y-2">
            <button
              onClick={() => handleSignIn(signInWithGoogle)}
              className="w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
            >
              <FaGoogle className="mr-2" /> Sign in with Google
            </button>
            <button
              onClick={() => handleSignIn(signInWithFacebook)}
              className="w-full flex items-center justify-center bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition duration-300"
            >
              <FaFacebook className="mr-2" /> Sign in with Facebook
            </button>
            <button
              onClick={() => handleSignIn(signInWithApple)}
              className="w-full flex items-center justify-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
            >
              <FaApple className="mr-2" /> Sign in with Apple
            </button>
          </div>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          <p className="mt-4 text-sm text-gray-600 text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
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