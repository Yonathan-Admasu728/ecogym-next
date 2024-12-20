'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import type { IconType } from 'react-icons';
import { FaYinYang, FaDumbbell, FaBrain, FaClock, FaSignal, FaHeart, FaPlay, FaLock } from 'react-icons/fa';

import type { Program } from '../types';
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
      onExplore(program.id);
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
    onQuickAddToFavorites(program.id);
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
      className="bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col border border-turquoise-400/20"
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 25px 30px -12px rgba(0, 0, 0, 0.4)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      role="article"
      aria-label={`${program.title} - ${program.category} program`}
    >
      <div className="relative pt-[56.25%]">
        <Image
          src={program.thumbnail || DEFAULT_THUMBNAIL}
          alt={`${program.title} thumbnail`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue-900 via-darkBlue-900/50 to-transparent" />
        {isFeatured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
            Featured
          </div>
        )}
        {isAuthenticated && (
          <motion.button
            className="absolute top-3 left-3 bg-darkBlue-800/80 backdrop-blur-sm text-turquoise-400 p-2.5 rounded-full shadow-xl border border-turquoise-400/20"
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Add ${program.title} to favorites`}
          >
            <FaHeart />
          </motion.button>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center">
            {getProgramIcon(program.category)}
            <h3 className="text-xl font-bold ml-2 text-white truncate">{program.title}</h3>
          </div>
          <p className="text-lightBlue-100 text-sm line-clamp-2 leading-relaxed">{program.description}</p>
          <div className="flex justify-between items-center text-sm text-lightBlue-200">
            <div className="flex items-center space-x-1">
              <FaClock className="text-turquoise-400" aria-hidden="true" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaSignal className="text-turquoise-400" aria-hidden="true" />
              <span>{program.level}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-lightBlue-100">Category:</span>
            <span className="text-sm text-turquoise-400 font-semibold">{program.category}</span>
          </div>
          <motion.button
            onClick={handleExploreClick}
            className={`
              w-full py-3 rounded-xl font-bold text-base
              flex items-center justify-center
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900
              ${buttonState !== 'preview'
                ? 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900 hover:from-turquoise-400 hover:to-turquoise-300'
                : 'bg-darkBlue-700/50 text-turquoise-400 border-2 border-turquoise-400/30 hover:bg-darkBlue-700/70'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`${buttonText} - ${program.title}`}
          >
            {buttonText}
            <ButtonIcon className="ml-2" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
