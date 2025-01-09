'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGem } from 'react-icons/fa';
import { comingSoonPrograms } from '../utils/comingSoonPrograms';
import ComingSoonCarousel from './ComingSoonCarousel';

const ComingSoonPrograms: React.FC = () => {
  return (
    <section 
      className="py-24 bg-[#0B1120] relative overflow-hidden"
    >
      {/* Ambient background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-40 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Subtle pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("/images/pattern.svg")`,
          backgroundSize: '24px',
        }}
      />
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
