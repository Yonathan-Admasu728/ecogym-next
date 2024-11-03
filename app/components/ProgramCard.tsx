import React from 'react';
import Image from 'next/image';
import { Program } from '../types';
import { FaYinYang, FaDumbbell, FaBrain, FaClock, FaSignal, FaHeart, FaPlay, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ProgramCardProps {
  program: Program;
  isFeatured: boolean;
  isAuthenticated: boolean;
  isPurchased: boolean;
  onExplore: (programId: string) => void;
  onQuickAddToFavorites: (programId: string) => void;
  onSignIn: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  isFeatured, 
  isAuthenticated, 
  isPurchased, 
  onExplore, 
  onQuickAddToFavorites,
  onSignIn
}) => {
  const getProgramIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'meditation':
        return <FaYinYang className="text-turquoise-400" />;
      case 'workout':
        return <FaDumbbell className="text-turquoise-400" />;
      case 'mindfulness':
        return <FaBrain className="text-turquoise-400" />;
      default:
        return null;
    }
  };

  const handleExploreClick = () => {
    if (isAuthenticated) {
      onExplore(program.id);
    } else {
      onSignIn();
    }
  };

  const getButtonText = () => {
    if (program.isFree) return "Start Free Program";
    if (isPurchased) return "Continue Program";
    return "Preview Program";
  };

  const getButtonIcon = () => {
    if (program.isFree || isPurchased) return <FaPlay className="ml-2" />;
    return <FaLock className="ml-2" />;
  };

  return (
    <motion.div 
      className="bg-darkBlue-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col"
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative pt-[56.25%]">
        <Image
          src={program.thumbnail || "/images/placeholder-program.svg"}
          alt={program.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue-900 via-transparent to-transparent opacity-70" />
        {isFeatured && (
          <div className="absolute top-2 right-2 bg-turquoise-400 text-darkBlue-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
            Featured
          </div>
        )}
        {isAuthenticated && (
          <motion.button
            className="absolute top-2 left-2 bg-darkBlue-800 bg-opacity-70 text-turquoise-400 p-2 rounded-full shadow-md"
            onClick={() => onQuickAddToFavorites(program.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaHeart />
          </motion.button>
        )}
      </div>
      <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-2">
            {getProgramIcon(program.category)}
            <h3 className="text-lg sm:text-xl font-bold ml-2 text-white truncate">{program.title}</h3>
          </div>
          <p className="text-lightBlue-100 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">{program.description}</p>
          <div className="flex justify-between items-center text-xs sm:text-sm text-lightBlue-200 mb-3">
            <div className="flex items-center">
              <FaClock className="mr-1 text-turquoise-400" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center">
              <FaSignal className="mr-1 text-turquoise-400" />
              <span>{program.level}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-3">
            <span className="text-xs sm:text-sm font-medium text-lightBlue-100">Category:</span>
            <span className="text-xs sm:text-sm text-turquoise-400 ml-1 font-semibold">{program.category}</span>
          </div>
          <motion.button
            onClick={handleExploreClick}
            className="w-full bg-turquoise-500 text-darkBlue-900 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-turquoise-400 transition-colors duration-300 ease-in-out flex items-center justify-center group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getButtonText()}
            {getButtonIcon()}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
