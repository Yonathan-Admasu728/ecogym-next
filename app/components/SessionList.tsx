'use client';

import { motion, Variants } from 'framer-motion';
import React from 'react';
import { FaPlay, FaLock, FaClock, FaSignal } from 'react-icons/fa';

import type { Session } from '../types';
import { logger } from '../utils/logger';

interface SessionListProps {
  sessions: Session[];
  onPlaySession: (session: Session) => void;
  isPurchased: boolean;
}

type DifficultyLevel = 1 | 2 | 3;

interface ButtonState {
  icon: typeof FaPlay  ;
  title: string;
  ariaLabel: string;
  className: string;
}

const DIFFICULTY_LABELS: Record<DifficultyLevel | number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  0: 'All Levels'
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onPlaySession,
  isPurchased,
}): JSX.Element => {
  const handlePlaySession = (session: Session): void => {
    logger.info('Session play clicked', {
      sessionId: session.id,
      sessionTitle: session.title,
      isPurchased,
      isPreview: session.is_preview
    });
    onPlaySession(session);
  };

  const getDifficultyLabel = (level: number): string => {
    return DIFFICULTY_LABELS[level as DifficultyLevel] || DIFFICULTY_LABELS[0];
  };

  const getButtonState = (session: Session): ButtonState => {
    const isAccessible = isPurchased || session.is_preview;

    return {
      icon: isAccessible ? FaPlay : FaLock,
      title: isAccessible ? `Play ${session.title}` : 'Purchase to Access',
      ariaLabel: isAccessible 
        ? `Play ${session.title}` 
        : `Purchase required to access ${session.title}`,
      className: `
        ml-6 p-4 rounded-xl
        flex items-center justify-center
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900
        ${isAccessible
          ? 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900 hover:from-turquoise-400 hover:to-turquoise-300'
          : 'bg-darkBlue-700/50 text-turquoise-400 border-2 border-turquoise-400/30 hover:bg-darkBlue-700/70'
        }
      `
    };
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {sessions.map((session) => {
        const buttonState = getButtonState(session);
        const ButtonIcon = buttonState.icon;

        return (
          <motion.div
            key={session.id}
            variants={item}
            className="bg-gradient-to-r from-darkBlue-800 to-darkBlue-900 rounded-2xl p-6 border border-turquoise-400/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-turquoise-400 transition-colors">
                    {session.title}
                  </h3>
                  {session.is_preview && !isPurchased && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900">
                      Preview
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-lightBlue-200">
                  <div className="flex items-center space-x-1">
                    <FaClock className="text-turquoise-400" aria-hidden="true" />
                    <span>{session.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaSignal className="text-turquoise-400" aria-hidden="true" />
                    <span>{getDifficultyLabel(session.difficulty_level)}</span>
                  </div>
                </div>

                <p className="text-sm text-lightBlue-100 line-clamp-2 leading-relaxed">
                  {session.description}
                </p>
              </div>

              <motion.button
                onClick={() => handlePlaySession(session)}
                className={buttonState.className}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={buttonState.title}
                aria-label={buttonState.ariaLabel}
              >
                <ButtonIcon className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            </div>

            {!isPurchased && !session.is_preview && (
              <motion.div 
                className="mt-4 pt-4 border-t border-turquoise-400/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-lightBlue-200">
                  <FaLock className="inline-block w-4 h-4 mr-2 text-turquoise-400" aria-hidden="true" />
                  Purchase the program to unlock this session
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SessionList;
