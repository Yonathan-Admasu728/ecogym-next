'use client';

import React from 'react';
import { FaYinYang, FaHeartbeat, FaPrayingHands, FaDumbbell } from 'react-icons/fa';

const CategoryIcons = (): JSX.Element => {
  return (
    <div className="flex justify-center items-center gap-8 py-2">
      <div className="flex items-center gap-8">
        <div className="group flex flex-col items-center">
          <FaYinYang 
            className="w-8 h-8 text-teal-200/80 transform transition-all duration-300 group-hover:scale-110 group-hover:text-teal-200 hover:rotate-180" 
            title="Balance"
          />
          <span className="text-xs text-teal-200/70 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:text-teal-100">Balance</span>
        </div>
        <div className="group flex flex-col items-center">
          <FaHeartbeat 
            className="w-8 h-8 text-teal-200/80 transform transition-all duration-300 group-hover:scale-110 group-hover:text-teal-200 group-hover:animate-pulse" 
            title="Wellness"
          />
          <span className="text-xs text-teal-200/70 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:text-teal-100">Wellness</span>
        </div>
        <div className="group flex flex-col items-center">
          <FaPrayingHands 
            className="w-8 h-8 text-teal-200/80 transform transition-all duration-300 group-hover:scale-110 group-hover:text-teal-200 hover:translate-y-[-2px]" 
            title="Mindfulness"
          />
          <span className="text-xs text-teal-200/70 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:text-teal-100">Mindfulness</span>
        </div>
        <div className="group flex flex-col items-center">
          <FaDumbbell 
            className="w-8 h-8 text-teal-200/80 transform transition-all duration-300 group-hover:scale-110 group-hover:text-teal-200 hover:rotate-12" 
            title="Strength"
          />
          <span className="text-xs text-teal-200/70 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:text-teal-100">Strength</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryIcons;
