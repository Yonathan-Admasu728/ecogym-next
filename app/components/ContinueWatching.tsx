'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaPlay, FaClock } from 'react-icons/fa';

import { usePrograms } from '../context/ProgramContext';
import type { Program } from '../types';

const ContinueWatching: React.FC = () => {
  const router = useRouter();
  const { userPrograms } = usePrograms();
  
  // Filter programs that are in progress
  const inProgressPrograms = userPrograms?.purchased_programs?.filter(
    (program: Program) => program.progress?.started && !program.progress?.completed
  ) || [];

  if (inProgressPrograms.length === 0) return null;

  return (
    <section className="py-12 bg-darkBlue-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <FaClock className="text-turquoise-400 mr-3" />
            Continue Your Journey
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressPrograms.map((program: Program) => (
              <motion.div
                key={program.id}
                className="relative bg-darkBlue-700 rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Program Thumbnail */}
                <div className="relative h-48">
                  <Image
                    src={program.thumbnail || '/images/placeholder-program.svg'}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-darkBlue-600">
                    <div
                      className="h-full bg-turquoise-400"
                      style={{ width: `${program.progress?.completion_percentage || 0}%` }}
                    />
                  </div>
                </div>

                {/* Program Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{program.title}</h3>
                  <p className="text-sm text-lightBlue-100 mb-4">
                    {program.progress?.completion_percentage || 0}% Complete
                  </p>

                  {/* Continue Button */}
                  <motion.button
                    onClick={() => router.push(`/programs/${program.id}`)}
                    className="w-full flex items-center justify-center space-x-2 bg-turquoise-400 text-darkBlue-900 py-2 px-4 rounded-lg hover:bg-turquoise-300 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlay />
                    <span>Continue</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContinueWatching;
