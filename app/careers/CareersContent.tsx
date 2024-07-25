// app/careers/CareersContent.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaHeart, FaUsers, FaRocket } from 'react-icons/fa';

const CareersContent = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1 
          className="text-5xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Join the Ecogym Revolution
        </motion.h1>
        
        <motion.p 
          className="text-xl text-center mb-12 text-gray-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We&apos;re on a mission to transform the world of fitness and wellness. 
          While we don&apos;t have any open positions right now, we&apos;re always on the lookout for passionate individuals to join our team.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            { icon: FaLightbulb, title: "Innovation", description: "Push the boundaries of fitness technology" },
            { icon: FaHeart, title: "Passion", description: "Dedication to health and wellness" },
            { icon: FaUsers, title: "Community", description: "Foster a supportive, inclusive environment" },
            { icon: FaRocket, title: "Growth", description: "Continuous learning and development" }
          ].map((value, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <value.icon className="text-4xl text-teal-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-400">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-3xl font-semibold mb-4">Stay Connected</h2>
          <p className="text-xl mb-8">
            Be the first to know about new opportunities at Ecogym.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none" type="email" placeholder="Enter your email" aria-label="Email" />
              <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                Notify Me
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CareersContent;