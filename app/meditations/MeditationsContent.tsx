'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Program } from '../types';
import ProgramList from '../components/ProgramList';

interface MeditationsContentProps {
  programs: Program[];
}

const moodCategories = [
  { id: 'all', name: 'All Meditations' },
  { id: 'calm', name: 'Calming' },
  { id: 'focus', name: 'Focus' },
  { id: 'sleep', name: 'Sleep' },
  { id: 'stress', name: 'Stress Relief' },
];

export default function MeditationsContent({ programs }: MeditationsContentProps): JSX.Element {
  const [selectedMood, setSelectedMood] = useState('all');

  const filteredPrograms = selectedMood === 'all' 
    ? programs 
    : programs.filter(program => program.tags?.includes(selectedMood));

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px',
        }}
      />
      
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <svg 
                  className="w-10 h-10 text-purple-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 font-heading tracking-tight">
              Find Your Inner Peace
            </h1>
            <p className="text-purple-200 max-w-2xl mx-auto text-lg leading-relaxed">
              Discover a collection of guided meditations designed to help you reduce stress, 
              improve focus, and achieve deeper relaxation.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {moodCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedMood(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedMood === category.id
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-purple-500/10 text-purple-200 hover:bg-purple-500/20'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredPrograms.length > 0 ? (
              <ProgramList 
                title=""
                programs={filteredPrograms}
              />
            ) : (
              <div className="text-center py-16">
                <p className="text-purple-200 text-lg">
                  No meditation programs available for this mood. Please try another category.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
