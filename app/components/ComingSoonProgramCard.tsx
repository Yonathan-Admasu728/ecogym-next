'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaLeaf, FaFire, FaStar, FaClock, FaUsers, FaHeart, FaGem, FaCrown, FaBell, FaLock } from 'react-icons/fa';
import Image from 'next/image';
import { ComingSoonProgram } from '../utils/comingSoonPrograms';

const ComingSoonProgramCard: React.FC<{ program: ComingSoonProgram }> = ({ program }) => {
  const [notified, setNotified] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fire': return <FaFire className="text-orange-400" />;
      case 'star': return <FaStar className="text-yellow-400" />;
      case 'clock': return <FaClock className="text-blue-400" />;
      case 'users': return <FaUsers className="text-purple-400" />;
      case 'heart': return <FaHeart className="text-red-400" />;
      case 'leaf': return <FaLeaf className="text-green-400" />;
      case 'gem': return <FaGem className="text-cyan-400" />;
      case 'crown': return <FaCrown className="text-amber-400" />;
      default: return <FaStar className="text-yellow-400" />;
    }
  };

  const getExclusiveTag = () => {
    switch (program.exclusivePerks.type) {
      case 'founder_member':
        return (
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold shadow-lg flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
          >
            <FaCrown className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Founder&apos;s Circle</span>
          </motion.div>
        );
      case 'early_access':
        return (
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold shadow-lg flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
          >
            <FaGem className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Priority Access</span>
          </motion.div>
        );
      case 'premium_preview':
        return (
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold shadow-lg flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
          >
            <FaLock className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Limited Preview</span>
          </motion.div>
        );
    }
  };

  const handleNotify = (e: React.MouseEvent) => {
    e.preventDefault();
    setNotified(true);
  };

  return (
    <motion.div
      className="relative rounded-xl bg-darkBlue-800 shadow-xl overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-64">
        <Image
          src={program.thumbnail}
          alt={program.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue-900 via-darkBlue-900/60 to-transparent" />
        
        {/* Coming Soon Badge */}
        <motion.div 
          className="absolute top-4 right-4"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: -12 }}
        >
          <span className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full font-semibold shadow-lg">
            Coming Soon
          </span>
        </motion.div>

        {/* Exclusive Perk Badge */}
        {getExclusiveTag()}
      </div>

      <div className="p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{program.title}</h3>
        <p className="text-sm sm:text-base text-lightBlue-100 mb-4">{program.description}</p>

        {/* Exclusive Perk Tagline */}
        <div className="mb-6">
          <p className="text-center text-turquoise-400 font-semibold text-base sm:text-lg">
            {program.exclusivePerks.tagline}
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {program.highlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2 text-lightBlue-100"
              whileHover={{ x: 5 }}
            >
              <span className="text-base sm:text-lg">
                {getIcon(highlight.icon)}
              </span>
              <span className="text-xs sm:text-sm">{highlight.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Instructor */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={program.trainer?.profile_picture || '/images/placeholder-avatar.svg'}
                alt={`${program.trainer?.user?.first_name} ${program.trainer?.user?.last_name}`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm sm:text-base text-white font-medium">
                {program.trainer?.user?.first_name} {program.trainer?.user?.last_name}
              </p>
              <p className="text-xs sm:text-sm text-lightBlue-200">{program.trainer?.specialties?.[0]}</p>
            </div>
          </div>
        </div>

        {/* Notification Button */}
        <motion.button
          onClick={handleNotify}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold
            transition-all duration-300
            flex items-center justify-center space-x-2
            ${notified
              ? 'bg-darkBlue-700/80 text-teal-200/90 border border-teal-200/20'
              : `
                bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400
                text-white
                hover-lift hover-scale
                shadow-lg hover:shadow-xl hover:shadow-teal-500/10
                border border-teal-200/20
                backdrop-blur-sm
              `
            }
          `}
          whileHover={{ scale: notified ? 1 : 1.02 }}
          whileTap={{ scale: notified ? 1 : 0.98 }}
        >
          <FaBell className={`transform transition-all duration-300 ${notified ? 'text-teal-200/90 animate-bounce' : 'group-hover:scale-110'}`} />
          <span className="transform transition-transform duration-300 group-hover:translate-x-1">
            {notified ? "You're on the list!" : "Get Exclusive Access"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ComingSoonProgramCard;
