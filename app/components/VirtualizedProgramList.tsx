'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { Program, toString } from '../types';
import ProgramCard from './ProgramCard';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';

interface VirtualizedProgramListProps {
  programs: Program[];
  title: string;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onExplore: (programId: string) => void;
  onQuickAddToFavorites: (programId: string) => void;
  onSignIn: () => void;
  purchasedProgramIds?: string[];
}

const THRESHOLD = 0.5;

export default function VirtualizedProgramList({
  programs,
  title,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  onExplore,
  onQuickAddToFavorites,
  onSignIn,
  purchasedProgramIds = [],
}: VirtualizedProgramListProps): JSX.Element {
  logger.debug('VirtualizedProgramList initialized', { 
    programCount: programs.length,
    hasMore,
    isLoading 
  });

  const { user } = useAuth();
  const loadingRef = useRef(false);
  const [virtualItems, setVirtualItems] = React.useState<Program[]>([]);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  
  // Intersection observer for infinite scroll
  const { ref: bottomRef, inView } = useInView({
    threshold: THRESHOLD,
    rootMargin: '100px',
  });

  // Load more items when bottom is in view
  useEffect(() => {
    if (inView && !loadingRef.current && hasMore) {
      logger.debug('Loading more items', { 
        currentCount: programs.length,
        isLoading 
      });
      loadingRef.current = true;
      onLoadMore?.();
      loadingRef.current = false;
    }
  }, [inView, hasMore, onLoadMore, programs.length, isLoading]);

  // Virtual scrolling implementation
  const containerRef = useRef<HTMLDivElement>(null);

  const updateVisibleItems = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const itemHeight = 400; // Approximate height of a program card
    const scrollTop = container.scrollTop;

    // Calculate visible range with buffer
    const buffer = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(
      programs.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
    );

    const slicedItems = programs.slice(startIndex, endIndex);
    logger.debug('Updating visible items', { 
      startIndex, 
      endIndex, 
      visibleCount: slicedItems.length,
      totalCount: programs.length
    });
    setVirtualItems(slicedItems);
    setScrollPosition(startIndex * itemHeight);
  }, [programs]);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      requestAnimationFrame(updateVisibleItems);
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateVisibleItems);

    updateVisibleItems();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateVisibleItems);
    };
  }, [updateVisibleItems]);

  return (
    <section className="py-16 bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-turquoise-400 to-turquoise-300">
          {title}
        </h2>

        <div
          ref={containerRef}
          className="h-[800px] overflow-auto relative"
          style={{ willChange: 'transform' }}
        >
          <div
            style={{
              height: `${programs.length * 400}px`, // Total height for scrollbar
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${scrollPosition}px)`,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {virtualItems.map((program, index) => (
                  <div
                    key={program.id}
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    <ProgramCard
                      program={program}
                      isFeatured={index === 0}
                      isAuthenticated={!!user}
                      isPurchased={purchasedProgramIds.includes(toString(program.id))}
                      onExplore={() => onExplore(toString(program.id))}
                      onQuickAddToFavorites={onQuickAddToFavorites}
                      onSignIn={onSignIn}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div ref={bottomRef} className="py-4 text-center">
          {isLoading && (
            <div className="animate-pulse flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-turquoise-400 rounded-full"></div>
              <div className="w-2 h-2 bg-turquoise-400 rounded-full"></div>
              <div className="w-2 h-2 bg-turquoise-400 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
