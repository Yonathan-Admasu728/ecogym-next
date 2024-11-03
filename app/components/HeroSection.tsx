'use client';

import React from 'react';
import SearchBar from './SearchBar';
import { FaPlay } from 'react-icons/fa';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-darkBlue-900 to-darkBlue-800">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-heading">
          Transform Your
          <span className="text-turquoise-400 block mt-2 animate-pulse-slow">Mind and Body</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-lightBlue-100 font-sans">
          Join EcoGym for mindfulness practices, guided meditations, and effective home workouts
        </p>
        <div className="mb-10">
          <SearchBar onSearch={onSearch} />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a
            href="#featured-programs"
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto flex items-center justify-center"
          >
            <FaPlay className="mr-2" /> Explore Programs
          </a>
          <a
            href="#about-us"
            className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
          >
            Our Approach
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-darkBlue-800 to-transparent z-20"></div>
    </section>
  );
};

export default HeroSection;