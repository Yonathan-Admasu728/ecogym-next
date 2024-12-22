'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaLeaf, FaFire, FaStar, FaClock, FaUsers, FaHeart, FaGem, FaCrown, FaBell, FaLock } from 'react-icons/fa';
import Image from 'next/image';
import { comingSoonPrograms, ComingSoonProgram } from '../utils/comingSoonPrograms';

const ProgramCard: React.FC<{ program: ComingSoonProgram }> = ({ program }) => {
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
            className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <FaCrown className="text-white" />
            <span>Founder&apos;s Circle</span>
          </motion.div>
        );
      case 'early_access':
        return (
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <FaGem className="text-white" />
            <span>Priority Access</span>
          </motion.div>
        );
      case 'premium_preview':
        return (
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <FaLock className="text-white" />
            <span>Limited Preview</span>
          </motion.div>
        );
    }
  };

  const handleNotify = (e: React.MouseEvent) => {
    e.preventDefault();
    setNotified(true);
    // TODO: Implement push notification signup logic
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
          <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            Coming Soon
          </span>
        </motion.div>

        {/* Exclusive Perk Badge */}
        {getExclusiveTag()}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{program.title}</h3>
        <p className="text-lightBlue-100 mb-4">{program.description}</p>

        {/* Exclusive Perk Tagline */}
        <div className="mb-6">
          <p className="text-center text-turquoise-400 font-semibold text-lg">
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
              <span className="text-lg">
                {getIcon(highlight.icon)}
              </span>
              <span className="text-sm">{highlight.text}</span>
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
              <p className="text-white font-medium">
                {program.trainer?.user?.first_name} {program.trainer?.user?.last_name}
              </p>
              <p className="text-sm text-lightBlue-200">{program.trainer?.specialties?.[0]}</p>
            </div>
          </div>
        </div>

        {/* Notification Button */}
        <motion.button
          onClick={handleNotify}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2 ${
            notified
              ? 'bg-turquoise-700 text-lightBlue-200'
              : 'bg-turquoise-500 hover:bg-turquoise-400 text-darkBlue-900'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaBell className={notified ? 'animate-bounce' : ''} />
          <span>
  {notified ? "You're on the list!" : "Get Exclusive Access"}
</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const ComingSoonPrograms: React.FC = () => {
  return (
    <section 
      className="py-24 bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/pattern.svg')",
        backgroundBlendMode: 'soft-light',
        backgroundSize: '200px',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-white mb-6 font-heading">
            Coming Soon
          </h2>
          <div className="flex items-center justify-center text-turquoise-400 mb-8">
            <FaGem className="w-8 h-8 mr-3" />
            <span className="text-xl">Exclusive Preview Access</span>
          </div>
          <p className="text-lightBlue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Be among the first to experience our transformative programs. 
            Join our exclusive list for special perks and early access.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comingSoonPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <ProgramCard program={program} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonPrograms;
