'use client';

import { motion } from 'framer-motion';
import ProgressiveImage from './ProgressiveImage';
import React from 'react';
import type { IconType } from 'react-icons';
import { FaYinYang, FaDumbbell, FaBrain, FaClock, FaSignal, FaHeart, FaPlay, FaLock } from 'react-icons/fa';

import type { Program } from '../types';
import { toString } from '../types';
import { logger } from '../utils/logger';

interface ProgramCardProps {
  program: Program;
  isFeatured: boolean;
  isAuthenticated: boolean;
  isPurchased: boolean;
  onExplore: (programId: string) => void;
  onQuickAddToFavorites: (programId: string) => void;
  onSignIn: () => void;
}

type ProgramCategory = 'meditation' | 'workout' | 'mindfulness';
type ButtonType = 'free' | 'purchased' | 'preview';

const DEFAULT_THUMBNAIL = '/images/placeholder-program.svg';

const CATEGORY_ICONS: Record<ProgramCategory, IconType> = {
  meditation: FaYinYang,
  workout: FaDumbbell,
  mindfulness: FaBrain,
};

const BUTTON_STATES: Record<ButtonType, { text: string; icon: IconType }> = {
  free: { text: 'Start Free Program', icon: FaPlay },
  purchased: { text: 'Continue Program', icon: FaPlay },
  preview: { text: 'Preview Program', icon: FaLock },
};

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  isFeatured, 
  isAuthenticated, 
  isPurchased, 
  onExplore, 
  onQuickAddToFavorites,
  onSignIn
}): JSX.Element => {
  const getProgramIcon = (category: string): JSX.Element | null => {
    const normalizedCategory = category.toLowerCase() as ProgramCategory;
    const Icon = CATEGORY_ICONS[normalizedCategory];
    
    return Icon ? (
      <Icon className="text-turquoise-400" aria-label={`${category} program`} />
    ) : null;
  };

  const handleExploreClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    
    logger.info('Program card clicked', {
      programId: program.id,
      isAuthenticated,
      isPurchased
    });

    if (isAuthenticated) {
      onExplore(toString(program.id));
    } else {
      onSignIn();
    }
  };

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    
    logger.info('Program favorite clicked', {
      programId: program.id,
      isAuthenticated
    });
    onQuickAddToFavorites(toString(program.id));
  };

  const getButtonState = (): ButtonType => {
    if (program.isFree) return 'free';
    if (isPurchased) return 'purchased';
    return 'preview';
  };

  const buttonState = getButtonState();
  const { text: buttonText, icon: ButtonIcon } = BUTTON_STATES[buttonState];

  return (
    <motion.div 
      className="bg-gradient-to-b from-darkBlue-800/95 to-darkBlue-900/95 rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col border border-white/10 backdrop-blur-sm group"
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 25px 35px -15px rgba(0, 0, 0, 0.5)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      role="article"
      aria-label={`${program.title} - ${program.category} program`}
    >
      <div className="relative pt-[60%] overflow-hidden">
        <ProgressiveImage
          src={program.thumbnail || DEFAULT_THUMBNAIL}
          alt={`${program.title} thumbnail`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
          priority={isFeatured}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-darkBlue-900 via-darkBlue-900/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"
        />
        <motion.div 
          className="absolute inset-0 bg-darkBlue-900/20 group-hover:bg-transparent transition-colors duration-300"
        />
        {isFeatured && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute top-3 right-3 bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900 text-xs font-bold px-4 py-2 rounded-full shadow-xl backdrop-blur-sm"
          >
            Featured
          </motion.div>
        )}
        {isAuthenticated && (
          <motion.button
            className="absolute top-3 left-3 bg-darkBlue-800/80 backdrop-blur-sm text-turquoise-400 p-3 rounded-full shadow-xl border border-white/20 hover:border-turquoise-400/50 transition-all duration-300"
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            aria-label={`Add ${program.title} to favorites`}
          >
            <FaHeart className="w-4 h-4" />
          </motion.button>
        )}
      </div>
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="p-2 bg-darkBlue-800/50 rounded-lg border border-white/5">
              {getProgramIcon(program.category)}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">{program.title}</h3>
          </motion.div>
          <motion.p 
            className="text-lightBlue-100/90 text-sm sm:text-base line-clamp-2 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {program.tagline || program.description}
          </motion.p>
          <motion.div 
            className="flex justify-between items-center text-sm text-lightBlue-200/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-darkBlue-800/30 rounded-md">
                <FaClock className="text-turquoise-400 w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-darkBlue-800/30 rounded-md">
                <FaSignal className="text-turquoise-400 w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span>{program.level}</span>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center justify-between px-3 py-2 bg-darkBlue-800/30 rounded-lg border border-white/5">
            <span className="text-sm font-medium text-lightBlue-100/90">Category</span>
            <span className="text-sm text-turquoise-400 font-semibold capitalize">{program.category}</span>
          </div>
          <motion.button
            onClick={handleExploreClick}
            className={`
              w-full py-3.5 rounded-xl font-bold text-base
              flex items-center justify-center gap-2
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-turquoise-400/50 focus:ring-offset-2 focus:ring-offset-darkBlue-900
              ${buttonState !== 'preview'
                ? 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900 hover:from-turquoise-400 hover:to-turquoise-300 shadow-lg shadow-turquoise-500/20'
                : 'bg-darkBlue-700/50 text-turquoise-400 border-2 border-turquoise-400/30 hover:bg-darkBlue-700/70 hover:border-turquoise-400/50'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`${buttonText} - ${program.title}`}
          >
            {buttonText}
            <ButtonIcon className="w-4 h-4" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
