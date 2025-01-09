'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Program } from '../types';
import ProgramList from '../components/ProgramList';

interface WorkoutsContentProps {
  programs: Program[];
}

const workoutCategories = [
  { id: 'all', name: 'All Workouts', icon: '💪' },
  { id: 'strength', name: 'Strength', icon: '🏋️‍♂️' },
  { id: 'cardio', name: 'Cardio', icon: '🏃‍♂️' },
  { id: 'hiit', name: 'HIIT', icon: '⚡' },
  { id: 'yoga', name: 'Yoga', icon: '🧘‍♂️' },
  { id: 'pilates', name: 'Pilates', icon: '🤸‍♂️' },
];

const stats = [
  { label: 'Active Users', value: '10K+' },
  { label: 'Workouts Completed', value: '500K+' },
  { label: 'Expert Trainers', value: '50+' },
  { label: 'Success Stories', value: '1000+' },
];

export default function WorkoutsContent({ programs }: WorkoutsContentProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(program => program.tags?.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-[#0B1120]">
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
                <div className="absolute inset-0 rounded-full border-2 border-cyan-300"></div>
              </div>
              <div className="absolute inset-4 animate-ping-slow animation-delay-300 opacity-20">
                <div className="absolute inset-0 rounded-full border-2 border-blue-300"></div>
              </div>
              <div className="absolute inset-8 animate-ping-slow animation-delay-600 opacity-20">
                <div className="absolute inset-0 rounded-full border-2 border-teal-300"></div>
              </div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center"
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
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 mb-8 font-heading tracking-tight">
              Transform Your Body
            </h1>
            <p className="text-blue-100/90 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Discover expert-led workout programs designed to help you achieve your fitness goals. 
              Whether you&apos;re looking to build strength, improve endurance, or enhance flexibility, 
              we have the perfect program for you.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {/* Gradient border effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-20 group-hover:opacity-30 transition duration-300 blur"></div>
                  
                  {/* Content */}
                  <div className="relative bg-[#0F172A]/50 backdrop-blur-xl rounded-lg p-6 h-full text-center">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200 mb-2">{stat.value}</div>
                    <div className="text-blue-100/70 text-sm">{stat.label}</div>
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
            {workoutCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 text-blue-100/90 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10'
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
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-blue-900/5 to-[#0B1120] -mx-4 sm:-mx-6 lg:-mx-8"></div>
            {filteredPrograms.length > 0 ? (
              <ProgramList 
                title=""
                programs={filteredPrograms}
              />
            ) : (
              <div className="text-center py-16">
                <p className="text-blue-100 text-lg">
                  No workout programs available for this category. Please try another category.
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
              <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl opacity-20 blur-sm"></div>
              
              {/* Content */}
              <div className="relative bg-[#0F172A]/40 rounded-2xl p-10 backdrop-blur-xl border border-white/5">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-4">
                  Ready to Start Your Fitness Journey?
                </h3>
                <p className="text-blue-100/90 text-lg mb-8">
                  Join thousands of others who have transformed their lives through our expert-led programs.
                </p>
                <button className="relative group overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Get Started Today</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
