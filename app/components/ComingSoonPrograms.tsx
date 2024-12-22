'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGem } from 'react-icons/fa';
import { comingSoonPrograms } from '../utils/comingSoonPrograms';
import ComingSoonCarousel from './ComingSoonCarousel';

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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 font-heading tracking-tight">
            Coming Soon
          </h2>
          <div className="flex items-center justify-center text-turquoise-400 mb-6 sm:mb-8">
            <FaGem className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
            <span className="text-lg sm:text-xl">Exclusive Preview Access</span>
          </div>
          <p className="text-lightBlue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Be among the first to experience our transformative programs. 
            Join our exclusive list for special perks and early access.
          </p>
        </motion.div>

        <ComingSoonCarousel programs={comingSoonPrograms} />
      </div>
    </section>
  );
};

export default ComingSoonPrograms;
