'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '../utils/logger';

interface ProgressiveImageProps {
  src: string;
  blurDataURL?: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIB4gHh4gIB4dHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

export default function ProgressiveImage({
  src,
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  alt,
  fill = false,
  sizes,
  className = '',
  priority = false,
  style,
}: ProgressiveImageProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(blurDataURL);

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true);
    setCurrentSrc(blurDataURL);

    logger.debug('Loading image', { 
      src,
      alt,
      priority 
    });

    // Preload the image
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
      setCurrentSrc(src);
      logger.debug('Image loaded successfully', { 
        src,
        alt 
      });
    };
    img.onerror = (error) => {
      logger.error('Error loading image', { 
        src,
        alt,
        error 
      });
    };
  }, [src, blurDataURL, alt, priority]);

  return (
    <AnimatePresence>
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={currentSrc}
          alt={alt}
          fill={fill}
          sizes={sizes}
          className={`
            ${className}
            transition-all duration-300 ease-in-out
            ${isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0'}
          `}
          priority={priority}
          style={{
            ...style,
            transform: isLoading ? 'scale(1.05)' : 'scale(1)',
          }}
          onLoadingComplete={() => {
            setIsLoading(false);
            logger.debug('Image loading complete', { 
              src,
              alt 
            });
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
