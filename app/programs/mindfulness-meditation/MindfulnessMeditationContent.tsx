'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Program } from '../../types';
import ProgramList from '../../components/ProgramList';

interface MindfulnessMeditationContentProps {
  programs: Program[];
}

const meditationCategories = [
  { id: 'all', name: 'All Meditations', icon: '🧘‍♂️' },
  { id: 'mindfulness', name: 'Mindfulness', icon: '🌿' },
  { id: 'breathing', name: 'Breathing', icon: '💨' },
  { id: 'sleep', name: 'Sleep', icon: '🌙' },
  { id: 'stress', name: 'Stress Relief', icon: '🌊' },
  { id: 'focus', name: 'Focus', icon: '🎯' },
];

const benefits = [
  { title: 'Reduced Stress', description: 'Lower anxiety and stress levels' },
  { title: 'Better Sleep', description: 'Improve sleep quality and duration' },
  { title: 'Enhanced Focus', description: 'Increase concentration and clarity' },
  { title: 'Emotional Balance', description: 'Better emotional regulation' },
];

export default function MindfulnessMeditationContent({ programs }: MindfulnessMeditationContentProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(program => program.tags?.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-40 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Subtle pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width=&apos;100&apos; height=&apos;100&apos; viewBox=&apos;0 0 100 100&apos; xmlns=&apos;http://www.w3.org/2000/svg&apos;%3E%3Cpath d=&apos;M50 50 L50 0 A50 50 0 0 1 100 50 Z&apos; fill=&apos;%23A78BFA&apos; fill-opacity=&apos;0.5&apos;/%3E%3C/svg%3E")`,
          backgroundSize: '24px',
        }}
      />
      
      <section className="relative py-32 overflow-hidden z-0">
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative w-32 h-32 mx-auto mb-12"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Animated rings */}
              <div className="absolute inset-0 animate-ping-slow opacity-20">
                <div className="absolute inset-0 rounded-full border-2 border-teal-300"></div>
              </div>
              <div className="absolute inset-4 animate-ping-slow animation-delay-300 opacity-20">
                <div className="absolute inset-0 rounded-full border-2 border-purple-300"></div>
              </div>
              <div className="absolute inset-8 animate-ping-slow animation-delay-600 opacity-20">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-300"></div>
              </div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 backdrop-blur-sm flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <svg 
                    className="w-8 h-8 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.5" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-teal-200 to-purple-200 mb-8 font-heading tracking-tight">
              Mindfulness & Meditation
            </h1>
            <p className="text-purple-100/90 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Discover peace of mind through our guided meditation programs. 
              From mindfulness practices to sleep meditation, find your path to inner calm.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {/* Gradient border effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg opacity-20 group-hover:opacity-30 transition duration-300 blur"></div>
                  
                  {/* Content */}
                  <div className="relative bg-[#0F172A]/50 backdrop-blur-xl rounded-lg p-6 h-full">
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-teal-200 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-purple-100/70 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {meditationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white/5 text-purple-100/90 hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/10'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </motion.div>

          <motion.div
            className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Programs section background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-purple-900/5 to-[#0B1120] -mx-4 sm:-mx-6 lg:-mx-8"></div>
            {filteredPrograms.length > 0 ? (
              <ProgramList 
                title=""
                programs={filteredPrograms}
              />
            ) : (
              <div className="text-center py-16">
                <p className="text-purple-100 text-lg">
                  No meditation programs available for this category. Please try another category.
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            className="mt-24 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="relative">
              {/* Gradient border */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 via-teal-500 to-purple-500 rounded-2xl opacity-20 blur-sm"></div>
              
              {/* Content */}
              <div className="relative bg-[#0F172A]/40 rounded-2xl p-10 backdrop-blur-xl border border-white/5">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-teal-200 mb-4">
                  Begin Your Meditation Journey
                </h3>
                <p className="text-purple-100/90 text-lg mb-8">
                  Take the first step towards a calmer, more focused mind with our expert-guided programs.
                </p>
                <button className="relative group overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transform hover:-translate-y-0.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Start Meditating Today</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
