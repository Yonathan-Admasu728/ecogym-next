'use client';

import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FaGoogle, FaEnvelope, FaLock, FaLeaf } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import { AuthError } from '../types/auth';
import { logger } from '../utils/logger';


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

  const handleError = (error: AuthError) => {
    logger.error('Authentication error', error);
    let message = error.message;
    if (error.code === 'auth/wrong-password') {
      message = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email.';
    } else if (error.code === 'auth/email-already-in-use') {
      message = 'An account already exists with this email.';
    }
    setError(message || 'An error occurred during authentication. Please try again.');
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      logger.info('Google sign in successful');
    } catch (error) {
      handleError(error as AuthError);
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
        logger.info('Email sign up successful');
      } else {
        await signInWithEmail(email, password);
        logger.info('Email sign in successful');
      }
    } catch (error) {
      handleError(error as AuthError);
    } finally {
      setIsSigningIn(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog 
          static 
          open={isOpen} 
          onClose={onClose} 
          className="relative z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-darkBlue-900/80 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel 
              as={motion.div}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative mx-auto max-w-md w-full overflow-hidden"
            >
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <Image
                    src="/images/pattern.svg"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                    className="mix-blend-overlay"
                  />
                </div>

                <div className="relative bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 p-8 rounded-3xl shadow-2xl border border-turquoise-400/20">
                  <motion.div 
                    className="flex flex-col items-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="relative w-32 h-12 mb-6">
                      <Image
                        src="/images/ecogym-logo.png"
                        alt="EcoGym Logo"
                        fill
                        style={{ objectFit: "contain" }}
                        priority
                      />
                    </div>

                    <Dialog.Title className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-turquoise-400 to-turquoise-300 text-center">
                      {isSignUp ? 'Join EcoGym' : 'Welcome Back'}
                    </Dialog.Title>
                    
                    <motion.p 
                      className="mt-2 text-lightBlue-100 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {isSignUp 
                        ? 'Start your wellness journey today' 
                        : 'Continue your wellness journey'}
                    </motion.p>
                  </motion.div>
                  
                  <motion.form 
                    onSubmit={handleEmailSignIn} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-turquoise-400 group-focus-within:text-turquoise-300 transition-colors" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`
                            w-full pl-12 pr-4 py-4
                            bg-darkBlue-700/50 backdrop-blur-sm
                            border-2 border-turquoise-400/30
                            rounded-xl text-white placeholder-lightBlue-100/70
                            focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:border-transparent
                            transition-all duration-300
                            hover:border-turquoise-400/50
                          `}
                          placeholder="Enter your email"
                          required
                          autoComplete="email"
                          name="email"
                        />
                      </div>
                      
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-turquoise-400 group-focus-within:text-turquoise-300 transition-colors" />
                        </div>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`
                            w-full pl-12 pr-4 py-4
                            bg-darkBlue-700/50 backdrop-blur-sm
                            border-2 border-turquoise-400/30
                            rounded-xl text-white placeholder-lightBlue-100/70
                            focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:border-transparent
                            transition-all duration-300
                            hover:border-turquoise-400/50
                          `}
                          placeholder="Enter your password"
                          required
                          minLength={6}
                          autoComplete={isSignUp ? "new-password" : "current-password"}
                          name="password"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSigningIn}
                      className={`
                        group
                        w-full py-4
                        bg-gradient-to-r from-turquoise-500 to-turquoise-400
                        text-darkBlue-900 font-bold
                        rounded-xl
                        transition-all duration-300
                        transform hover:-translate-y-1
                        shadow-lg hover:shadow-xl
                        focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex items-center justify-center">
                        <FaLeaf className="mr-2 transform transition-transform duration-300 group-hover:rotate-12" />
                        {isSigningIn ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                      </span>
                    </motion.button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-turquoise-400/30" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 text-turquoise-400/70">
                          or continue with
                        </span>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleGoogleSignIn}
                      disabled={isSigningIn}
                      className={`
                        group
                        w-full flex items-center justify-center
                        bg-white/10 backdrop-blur-sm
                        border-2 border-turquoise-400/30
                        text-white
                        py-4 px-4 rounded-xl
                        hover:bg-white/20
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transform hover:-translate-y-1
                        focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaGoogle className="mr-2 text-red-500 transform transition-transform duration-300 group-hover:scale-110" />
                      <span>Google</span>
                    </motion.button>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                        >
                          <p className="text-sm text-red-400 text-center">
                            {error}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.p 
                      className="text-sm text-lightBlue-100 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                      <button
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setError(null);
                        }}
                        className="ml-1 text-turquoise-400 hover:text-turquoise-300 focus:outline-none transition-colors duration-300"
                      >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                      </button>
                    </motion.p>
                  </motion.form>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SignInModal;
