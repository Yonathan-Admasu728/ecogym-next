'use client';

import React from 'react';
import { FaYinYang, FaHeartbeat, FaPrayingHands, FaDumbbell } from 'react-icons/fa';

const CategoryIcons = (): JSX.Element => {
  return (
    <div className="flex justify-center items-center py-4 sm:py-6">
      <div className="flex flex-row items-center gap-4 sm:gap-16">
        <div className="flex flex-col items-center group">
          <FaYinYang 
            className="w-6 h-6 sm:w-10 sm:h-10 text-teal-300 hover:text-teal-200 transition-all duration-300 group-hover:rotate-180" 
            title="Balance"
          />
          <span className="text-[10px] sm:text-sm text-teal-200 mt-2 sm:mt-3 font-medium">Balance</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaHeartbeat 
            className="w-6 h-6 sm:w-10 sm:h-10 text-teal-300 hover:text-teal-200 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse" 
            title="Wellness"
          />
          <span className="text-[10px] sm:text-sm text-teal-200 mt-2 sm:mt-3 font-medium">Wellness</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaPrayingHands 
            className="w-6 h-6 sm:w-10 sm:h-10 text-teal-300 hover:text-teal-200 transition-all duration-300 group-hover:translate-y-[-4px]" 
            title="Mindfulness"
          />
          <span className="text-[10px] sm:text-sm text-teal-200 mt-2 sm:mt-3 font-medium">Mindfulness</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaDumbbell 
            className="w-6 h-6 sm:w-10 sm:h-10 text-teal-300 hover:text-teal-200 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" 
            title="Strength"
          />
          <span className="text-[10px] sm:text-sm text-teal-200 mt-2 sm:mt-3 font-medium">Strength</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryIcons;
