import { useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromptGallery } from '../hooks/usePromptGallery';
import { useGalleryPrompt } from '../hooks/useGalleryPrompt';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import StreakTracker from './StreakTracker';

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PromptCard: FC<{ prompt: any }> = ({ prompt }) => {
  const { user } = useAuth();
  const {
    isExpanded,
    reflection,
    rating,
    isSaving,
    showCompletionSuccess,
    handleExpand,
    handleComplete,
    setReflection,
    setRating
  } = useGalleryPrompt(prompt);

  return (
    <>
      <motion.div
        layout
        variants={fadeInScale}
        whileHover={{ scale: 1.02 }}
        onClick={handleExpand}
        className="bg-darkBlue-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-turquoise-400/20 cursor-pointer group min-h-[280px] relative overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {prompt.title && (
            <h3 className="text-xl md:text-2xl font-bold text-teal-200 mb-3 group-hover:text-turquoise-300 transition-colors duration-300 line-clamp-2">
              {prompt.title}
            </h3>
          )}

          {prompt.category && (
            <span className="inline-block px-3 py-1.5 text-xs font-medium bg-turquoise-400/10 text-turquoise-400 rounded-full mb-4 w-fit">
              {prompt.category}
            </span>
          )}

          <p className="text-lightBlue-100 leading-relaxed flex-1 line-clamp-4 text-base md:text-lg">
            {prompt.body}
          </p>

          {prompt.userEngagement?.completed && (
            <div className="flex items-center text-green-400 text-sm md:text-base mt-4 font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-darkBlue-900/90 backdrop-blur-lg"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleExpand();
              }
            }}
          >
            <div className="min-h-screen py-6 sm:py-8 md:py-12 px-4 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-darkBlue-900/100 backdrop-blur-md rounded-xl p-6 sm:p-8 md:p-10 border border-turquoise-400/30 shadow-2xl glow max-w-3xl w-full relative mx-auto"
              >
                <button
                  onClick={handleExpand}
                  className="absolute top-4 right-4 text-turquoise-400 hover:text-turquoise-300 transition-colors duration-300"
                >
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-8 md:mb-10">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-teal-200 mb-3">
                    {prompt.title}
                  </h2>
                  {prompt.category && (
                    <span className="inline-block px-3 py-1.5 text-sm font-medium bg-turquoise-400/10 text-turquoise-400 rounded-full mb-6">
                      {prompt.category}
                    </span>
                  )}
                  <p className="text-lightBlue-100 leading-relaxed text-lg md:text-xl">
                    {prompt.body}
                  </p>
                </div>

                {prompt.explanation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mb-8 md:mb-10"
                  >
                    <h3 className="text-turquoise-300/90 font-medium text-sm md:text-base mb-3 tracking-wide uppercase">Why This Matters</h3>
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg">{prompt.explanation}</p>
                  </motion.div>
                )}

                {prompt.tips && prompt.tips.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mb-8 md:mb-10"
                  >
                    <h3 className="text-turquoise-300/90 font-medium text-sm md:text-base mb-3 tracking-wide uppercase">Practice Tips</h3>
                    <motion.ul className="space-y-3 md:space-y-4">
                      {prompt.tips.map((tip: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="flex items-start text-gray-300 text-base md:text-lg bg-darkBlue-800/30 p-3 md:p-4 rounded-lg"
                        >
                          <span className="inline-block w-6 h-6 md:w-7 md:h-7 bg-turquoise-300/20 rounded-full flex-shrink-0 mr-3 md:mr-4 mt-0.5">
                            <span className="flex items-center justify-center h-full text-xs md:text-sm text-turquoise-300 font-medium">
                              {index + 1}
                            </span>
                          </span>
                          {tip}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}

                {/* Engagement Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-8 md:mt-10 space-y-6 md:space-y-8"
                >
                  <div className="space-y-3">
                    <label className="block text-teal-200 font-medium text-base md:text-lg">Your Reflection</label>
                    <div className="relative">
                      {user ? (
                        <textarea
                          value={reflection}
                          onChange={(e) => setReflection(e.target.value)}
                          placeholder="Share your thoughts on this prompt..."
                          className="w-full bg-darkBlue-700/50 text-lightBlue-100 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-turquoise-400 transition-all duration-300 text-base md:text-lg"
                          rows={4}
                        />
                      ) : (
                        <div 
                          className="w-full bg-darkBlue-700/30 text-lightBlue-100/50 rounded-lg p-4 cursor-pointer hover:bg-darkBlue-700/40 transition-colors duration-300 text-base md:text-lg"
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
                        <span className="absolute bottom-3 right-3 text-sm text-turquoise-400">
                          Saving...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-teal-200 font-medium text-base md:text-lg">
                      Rate this prompt {!rating && !prompt.userEngagement?.completed && "(Required)"}
                    </label>
                    <div className="flex space-x-3">
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
                            if (!prompt.userEngagement?.completed) {
                              setRating(star);
                            }
                          }}
                          className={`text-2xl md:text-3xl transition-colors duration-300 ${
                            rating && star <= rating
                              ? 'text-yellow-400'
                              : prompt.userEngagement?.completed
                              ? 'text-darkBlue-700 cursor-not-allowed'
                              : user
                              ? 'text-darkBlue-700 hover:text-darkBlue-600'
                              : 'text-darkBlue-700/50 hover:text-darkBlue-600/50'
                          }`}
                          disabled={prompt.userEngagement?.completed}
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
                    whileHover={!prompt.userEngagement?.completed && rating ? { scale: 1.02 } : {}}
                    whileTap={!prompt.userEngagement?.completed && rating ? { scale: 0.98 } : {}}
                    onClick={() => handleComplete(prompt.id)}
                    disabled={prompt.userEngagement?.completed || !rating}
                    className={`w-full py-4 rounded-lg font-medium transition-all duration-300 text-base md:text-lg ${
                      prompt.userEngagement?.completed
                        ? 'bg-green-400/20 text-green-400 cursor-not-allowed'
                        : !rating
                        ? 'bg-darkBlue-700/50 text-darkBlue-300 cursor-not-allowed'
                        : 'bg-turquoise-400 text-darkBlue-900 hover:bg-turquoise-300'
                    }`}
                  >
                    {prompt.userEngagement?.completed ? (
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .glow {
          box-shadow: 0 0 30px rgba(45, 212, 191, 0.15),
                    inset 0 0 20px rgba(45, 212, 191, 0.1);
        }
      `}</style>
    </>
  );
};

const PromptGallery: FC = (): JSX.Element => {
  const { user } = useAuth();
  const {
    collection,
    isLoading,
    error,
    currentPage,
    filters,
    categories,
    fetchPrompts,
    fetchCategories,
    handleFilterChange,
    handlePageChange,
  } = usePromptGallery();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchPrompts()
        ]);
      } catch (error) {
        logger.error('Error loading gallery data:', error);
      }
    };
    
    loadData();
  }, [fetchCategories, fetchPrompts]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          className="space-y-4 md:space-y-6"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              variants={fadeInScale}
              className="animate-pulse bg-darkBlue-800/50 rounded-xl p-6 md:p-8"
            >
              <div className="h-6 md:h-8 bg-darkBlue-700/50 rounded-lg w-1/3 mb-4"></div>
              <div className="h-4 md:h-5 bg-darkBlue-700/50 rounded-lg w-1/4 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 md:h-5 bg-darkBlue-700/50 rounded-lg w-full"></div>
                <div className="h-4 md:h-5 bg-darkBlue-700/50 rounded-lg w-5/6"></div>
                <div className="h-4 md:h-5 bg-darkBlue-700/50 rounded-lg w-4/6"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : error ? (
        <motion.div
          key="error"
          {...fadeInScale}
          className="bg-darkBlue-800/50 rounded-xl p-6 md:p-8"
        >
          <div className="text-red-400 text-base md:text-lg">{error}</div>
        </motion.div>
      ) : !collection ? null : (
        <motion.div
          key="content"
          className="space-y-8 md:space-y-10"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Streak Tracker - Only show for authenticated users */}
          {user && (
            <div className="mb-8">
              <StreakTracker />
            </div>
          )}

          {/* Filters */}
          <motion.div
            variants={fadeInScale}
            className="flex flex-wrap gap-4 p-4 md:p-6 bg-darkBlue-800/30 rounded-xl backdrop-blur-sm"
          >
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 min-w-[200px] bg-darkBlue-700 text-lightBlue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-turquoise-400 transition-all duration-300 text-base md:text-lg"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </motion.select>

            <motion.select
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 min-w-[200px] bg-darkBlue-700 text-lightBlue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-turquoise-400 transition-all duration-300 text-base md:text-lg"
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange({ sortBy: (e.target.value as 'date' | 'popularity' | '') || undefined })}
            >
              <option value="">Sort By</option>
              <option value="date">Date</option>
              <option value="popularity">Popularity</option>
            </motion.select>

            <motion.input
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="text"
              placeholder="Search prompts..."
              className="flex-[2] min-w-[300px] bg-darkBlue-700 text-lightBlue-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-turquoise-400 transition-all duration-300 text-base md:text-lg"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value || undefined })}
            />
          </motion.div>

          {/* Prompts Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {collection.prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {collection.totalPages > 1 && (
            <motion.div
              variants={fadeInScale}
              className="flex justify-center items-center space-x-3 md:space-x-4 pt-6 md:pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 md:px-6 py-2 md:py-3 rounded-lg bg-darkBlue-700 text-lightBlue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base md:text-lg"
              >
                Previous
              </motion.button>
              <span className="px-4 md:px-6 py-2 md:py-3 rounded-lg bg-darkBlue-700 text-lightBlue-100 text-base md:text-lg">
                Page {currentPage} of {collection.totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === collection.totalPages}
                className="px-4 md:px-6 py-2 md:py-3 rounded-lg bg-darkBlue-700 text-lightBlue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base md:text-lg"
              >
                Next
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromptGallery;
