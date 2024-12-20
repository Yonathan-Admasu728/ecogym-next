'use client';

import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

import { logger } from '../utils/logger';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const DEBOUNCE_DELAY = 300;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }): JSX.Element => {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((searchQuery: string): void => {
      logger.info('Search query executed', { query: searchQuery });
      onSearch(searchQuery);
    }, DEBOUNCE_DELAY),
    [onSearch]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    void debouncedSearch(newQuery);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    logger.info('Search form submitted', { query });
    onSearch(query);
  };

  const handleClear = (): void => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
    logger.info('Search cleared');
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto"
      role="search"
    >
      <div className="relative group">
        <motion.div
          className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-r from-turquoise-400/20 to-turquoise-300/20
            transition-opacity duration-300
            ${isFocused ? 'opacity-100' : 'opacity-0'}
          `}
          initial={false}
          animate={{
            scale: isFocused ? 1.02 : 1,
            opacity: isFocused ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        />
        
        <div className="relative">
          <FaSearch 
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-turquoise-400 w-5 h-5" 
            aria-hidden="true"
          />
          
          <input
            ref={inputRef}
            type="search"
            className={`
              w-full px-14 py-4 rounded-2xl
              bg-darkBlue-800/50 backdrop-blur-sm
              border-2 border-turquoise-400/30
              text-white placeholder-lightBlue-100/70
              text-base sm:text-lg
              transition-all duration-300
              focus:outline-none focus:border-turquoise-400 focus:ring-2 focus:ring-turquoise-400/50
              hover:border-turquoise-400/50
            `}
            placeholder="Search for mindfulness programs, workouts, and more..."
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label="Search programs"
          />

          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                onClick={handleClear}
                className={`
                  absolute right-14 top-1/2 transform -translate-y-1/2
                  text-lightBlue-100 hover:text-turquoise-400
                  p-2 rounded-full
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-turquoise-400
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Clear search"
              >
                <FaTimes className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className={`
              absolute right-2 top-1/2 transform -translate-y-1/2
              bg-gradient-to-r from-turquoise-500 to-turquoise-400
              text-darkBlue-900 rounded-xl p-3
              transition-all duration-300
              hover:from-turquoise-400 hover:to-turquoise-300
              focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900
              shadow-lg hover:shadow-xl
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Submit search"
          >
            <FaSearch className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
