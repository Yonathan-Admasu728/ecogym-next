'use client';

import { motion, AnimatePresence } from "framer-motion";
import { usePrompt } from "../hooks/usePrompt";
import { useDailyCompass } from "../context/DailyCompassContext";
import { useAuth } from "../context/AuthContext";
import StreakTracker from "./StreakTracker";
import PromptGallery from "./PromptGallery";
import { useState, FC, useRef, useEffect } from "react";
import { logger } from '../utils/logger';
import { DailyCompassService } from '../services/DailyCompassService';

const variants = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
  },
  loading: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  },
  container: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    transition: { staggerChildren: 0.1 }
  }
};

// Keyboard shortcuts help text
const KEYBOARD_SHORTCUTS = {
  'Alt + E': 'Expand/Collapse Details',
  'Alt + R': 'Focus Reflection',
  'Alt + C': 'Complete Prompt',
  'Alt + G': 'View Gallery',
  'Esc': 'Close Gallery'
};

const DailyCompass: FC = (): JSX.Element => {
  const reflectionRef = useRef<HTMLTextAreaElement>(null);
  const completeButtonRef = useRef<HTMLButtonElement>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const { state, fetchTodayPrompt, fetchUserStreak } = useDailyCompass();
  const {
    isExpanded,
    reflection,
    rating,
    hasCompleted,
    isSaving,
    lastSaved,
    handleExpand,
    handleComplete,
    setReflection,
    setRating,
  } = usePrompt();

  const isLoading = !state.isInitialized || state.isLoading.prompt;
  const prompt = state.currentPrompt;
  const error = state.error;
  const [showGallery, setShowGallery] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [showCompletionSuccess, setShowCompletionSuccess] = useState(false);

  // Trigger initial fetch only once on mount
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!state.isInitialized && mounted) {
        try {
          await fetchTodayPrompt();
          // Only fetch streak if user is authenticated
          if (state.currentPrompt?.userEngagement) {
            await fetchUserStreak();
          }
        } catch (error) {
          logger.error('Error fetching initial data:', error);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [fetchTodayPrompt, fetchUserStreak, state.isInitialized, state.currentPrompt?.userEngagement]);

  // Handle completion
  const { user } = useAuth();
  
  const onComplete = async () => {
    if (!user) {
      // Trigger authentication flow
      const signInModal = document.getElementById('signInModal');
      if (signInModal) {
        signInModal.classList.remove('hidden');
      }
      return;
    }

    if (!rating) {
      // Show rating requirement message
      const ratingLabel = document.querySelector('label[for="rating"]');
      if (ratingLabel) {
        ratingLabel.scrollIntoView({ behavior: 'smooth' });
        ratingLabel.classList.add('text-yellow-400');
        setTimeout(() => {
          ratingLabel.classList.remove('text-yellow-400');
        }, 2000);
      }
      return;
    }

    try {
      await handleComplete();
      setShowCompletionSuccess(true);
      // Auto collapse after showing success message
      setTimeout(() => {
        handleExpand();
        setShowCompletionSuccess(false);
      }, 2000);
    } catch (error) {
      logger.error('Error completing prompt:', error);
    }
  };

  // Log state changes for debugging
  useEffect(() => {
    logger.debug('DailyCompass state:', {
      hasPrompt: !!prompt,
      isLoading,
      error,
      isExpanded,
      hasReflection: !!reflection,
      hasRating: !!rating,
      hasCompleted,
      isSaving,
      lastSaved
    });
  }, [prompt, isLoading, error, isExpanded, reflection, rating, hasCompleted, isSaving, lastSaved]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'e':
            e.preventDefault();
            handleExpand();
            break;
          case 'r':
            e.preventDefault();
            reflectionRef.current?.focus();
            break;
          case 'c':
            e.preventDefault();
            completeButtonRef.current?.click();
            break;
          case 'g':
            e.preventDefault();
            setShowGallery(true);
            break;
        }
      } else if (e.key === 'Escape' && showGallery) {
        setShowGallery(false);
      } else if (e.key === '?' && e.shiftKey) {
        setShowKeyboardHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [showGallery, handleExpand]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showGallery ? (
        <motion.div
          key="gallery"
          variants={variants.fadeInScale}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-6"
        >
          <button
            onClick={() => setShowGallery(false)}
            className="flex items-center text-turquoise-400 hover:text-turquoise-300 transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Today&apos;s Prompt
          </button>
          <PromptGallery />
        </motion.div>
      ) : !state.isInitialized || state.isLoading.prompt ? (
        <motion.div
          key="loading"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="animate-pulse bg-darkBlue-800/50 rounded-lg p-6 shadow-md"
        >
          <div className="h-4 bg-darkBlue-700/50 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-darkBlue-700/50 rounded w-3/4 animate-pulse"></div>
        </motion.div>
      ) : error ? (
        <motion.div
          key="error"
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-darkBlue-800/50 rounded-lg p-6 shadow-md"
        >
          <div className="space-y-4">
            {error?.toLowerCase().includes('too many requests') ? (
              <div className="bg-darkBlue-700/30 rounded-lg p-4">
                <div className="flex items-center text-yellow-400 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Connection Notice</span>
                </div>
                <p className="text-lightBlue-100 text-sm">
                  We&apos;re experiencing some connection issues, but don&apos;t worry - you&apos;re still seeing today&apos;s prompt. We&apos;ll automatically reconnect when possible.
                </p>
              </div>
            ) : (
              <>
                <div className="text-red-400 text-sm">Unable to load today&apos;s prompt</div>
                <div className="bg-darkBlue-700/30 rounded-lg p-4">
                  <p className="text-lightBlue-100 text-sm">
                    We&apos;re having trouble connecting to our servers. Please check your internet connection and try again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-turquoise-400 hover:text-turquoise-300 transition-colors duration-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Page
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      ) : !prompt ? null : (
        <motion.div
          key="content"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <h2 className="text-2xl font-bold text-teal-200">Daily Compass</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGallery(true)}
              className="text-turquoise-400 hover:text-turquoise-300 transition-colors duration-300"
            >
              View All Prompts
            </motion.button>
            {galleryError && (
              <div className="mt-2 text-sm text-red-400">
                {galleryError}
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Streak Tracker - Only show for authenticated users */}
            {state.currentPrompt?.userEngagement && (
              <div className="lg:col-span-1">
                <StreakTracker />
              </div>
            )}

            {/* Daily Prompt */}
            <motion.div 
              className="lg:col-span-2 bg-darkBlue-800/50 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-turquoise-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="max-w-2xl mx-auto"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                <motion.div 
                  className="flex flex-col space-y-4"
                  variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 }
                  }}
                >
                  <motion.div 
                    className="flex items-center justify-between"
                    variants={variants.fadeInScale}
                  >
                    <div className="flex-1">
                      {prompt?.title && (
                        <motion.h2 
                          className="text-lg font-semibold text-teal-200"
                          variants={variants.fadeInScale}
                        >
                          {prompt.title}
                        </motion.h2>
                      )}
                      <motion.div 
                        className="flex flex-wrap gap-2 mt-2"
                        variants={{
                          initial: { opacity: 0 },
                          animate: { opacity: 1, transition: { staggerChildren: 0.05 } }
                        }}
                      >
                        {prompt?.category && (
                          <motion.span
                            variants={variants.fadeInScale}
                            className="inline-block px-2 py-1 text-xs font-medium bg-turquoise-400/10 text-turquoise-400 rounded-full"
                          >
                            {prompt.category}
                          </motion.span>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.p 
                    className="text-lightBlue-100 leading-relaxed"
                    variants={variants.fadeInScale}
                  >
                    {prompt?.body}
                  </motion.p>

                  <motion.div variants={variants.fadeInScale}>
                    <button
                      onClick={handleExpand}
                      className="flex items-center text-turquoise-400 hover:text-turquoise-300 transition-colors duration-300 text-sm font-medium focus:outline-none"
                    >
                      <span>{isExpanded ? "Show Less" : "Learn More"}</span>
                      <motion.svg
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </button>
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-darkBlue-900/100 backdrop-blur-md rounded-lg mt-3 p-6 border border-turquoise-400/30 shadow-lg glow">
                          {prompt?.explanation && (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="mb-6"
                            >
                              <h3 className="text-turquoise-300/90 font-medium text-sm mb-2 tracking-wide uppercase">Why This Matters</h3>
                              <p className="text-gray-300 leading-relaxed text-sm">{prompt.explanation}</p>
                            </motion.div>
                          )}

                          {prompt?.tips && prompt.tips.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              <h3 className="text-turquoise-300/90 font-medium text-sm mb-2 tracking-wide uppercase">Practice Tips</h3>
                              <motion.ul 
                                className="space-y-2"
                                variants={{
                                  animate: {
                                    transition: { staggerChildren: 0.1 }
                                  }
                                }}
                              >
                                {prompt.tips.map((tip, index) => (
                                  <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                    className="flex items-start text-gray-300 text-sm bg-darkBlue-800/30 p-2 rounded-lg"
                                  >
                                    <span className="inline-block w-5 h-5 bg-turquoise-300/20 rounded-full flex-shrink-0 mr-3 mt-0.5">
                                      <span className="flex items-center justify-center h-full text-xs text-turquoise-300 font-medium">
                                        {index + 1}
                                      </span>
                                    </span>
                                    {tip}
                                  </motion.li>
                                ))}
                              </motion.ul>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Engagement Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 space-y-4 overflow-hidden"
                        variants={variants.fadeInScale}
                      >
                        <div className="space-y-2">
                          <label className="block text-teal-200 font-medium">Your Reflection</label>
                          <div className="relative">
                            {user ? (
                              <textarea
                                ref={reflectionRef}
                                value={reflection}
                                onChange={(e) => setReflection(e.target.value)}
                                placeholder="Share your thoughts on this prompt... (Alt + R)"
                                className="w-full bg-darkBlue-700/50 text-lightBlue-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-turquoise-400 transition-all duration-300"
                                rows={4}
                                aria-label="Your reflection"
                                data-gramm="false"
                              />
                            ) : (
                              <div 
                                className="w-full bg-darkBlue-700/30 text-lightBlue-100/50 rounded-lg p-3 cursor-not-allowed"
                                onClick={() => {
                                  const signInModal = document.getElementById('signInModal');
                                  if (signInModal) {
                                    signInModal.classList.remove('hidden');
                                  }
                                }}
                              >
                                Sign in to share your reflection
                              </div>
                            )}
                            {isSaving && (
                              <span className="absolute bottom-2 right-2 text-xs text-turquoise-400">
                                Saving...
                              </span>
                            )}
                            {!isSaving && lastSaved && (
                              <span className="absolute bottom-2 right-2 text-xs text-turquoise-400">
                                Saved {lastSaved?.toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="rating" className="block text-teal-200 font-medium transition-colors duration-300">
                            Rate this prompt {!rating && !hasCompleted && "(Required)"}
                          </label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  if (!user) {
                                    const signInModal = document.getElementById('signInModal');
                                    if (signInModal) {
                                      signInModal.classList.remove('hidden');
                                    }
                                    return;
                                  }
                                  if (!hasCompleted) {
                                    setRating(star);
                                  }
                                }}
                                className={`text-2xl transition-colors duration-300 ${
                                  rating && star <= rating
                                    ? 'text-yellow-400'
                                    : hasCompleted
                                    ? 'text-darkBlue-700 cursor-not-allowed'
                                    : user
                                    ? 'text-darkBlue-700 hover:text-darkBlue-600'
                                    : 'text-darkBlue-700/50 hover:text-darkBlue-600/50'
                                }`}
                                disabled={hasCompleted}
                              >
                                ★
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <AnimatePresence>
                          {showCompletionSuccess && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="bg-green-400/20 text-green-400 p-3 rounded-lg text-center"
                            >
                              <span className="flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Prompt completed successfully!
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.button
                          ref={completeButtonRef}
                          onClick={onComplete}
                          disabled={hasCompleted}
                          whileHover={!hasCompleted ? { scale: 1.02 } : {}}
                          whileTap={!hasCompleted ? { scale: 0.98 } : {}}
                          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                            hasCompleted
                              ? 'bg-green-400/20 text-green-400 cursor-not-allowed'
                              : !rating
                              ? 'bg-darkBlue-700/50 text-darkBlue-300 cursor-not-allowed'
                              : 'bg-turquoise-400 text-darkBlue-900 hover:bg-turquoise-300 hover:shadow-lg'
                          }`}
                          aria-label={
                            hasCompleted
                              ? 'Prompt completed'
                              : !rating
                              ? 'Please rate the prompt before completing'
                              : 'Complete this prompt (Alt + C)'
                          }
                        >
                          {hasCompleted ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Completed
                            </span>
                          ) : (
                            'Complete This Prompt'
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <style>{`
                    .glow {
                      box-shadow: 0 0 30px rgba(45, 212, 191, 0.15),
                                inset 0 0 20px rgba(45, 212, 191, 0.1);
                    }
                    .glow-text {
                      text-shadow: 0 0 15px rgba(45, 212, 191, 0.4),
                                 0 0 30px rgba(45, 212, 191, 0.2);
                    }
                  `}</style>

                  {/* Keyboard Shortcuts Help */}
                  <AnimatePresence>
                    {showKeyboardHelp && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-4 p-4 bg-darkBlue-700/50 rounded-lg"
                      >
                        <h3 className="text-teal-200 font-medium mb-2">Keyboard Shortcuts</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(KEYBOARD_SHORTCUTS).map(([key, description]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <kbd className="px-2 py-1 bg-darkBlue-800 rounded text-turquoise-400">{key}</kbd>
                              <span className="text-lightBlue-100">{description}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-lightBlue-100 mt-2">
                          Press Shift + ? to toggle this help menu
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyCompass;
