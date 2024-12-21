'use client';

import Image from 'next/image';
import React from 'react';
import type { IconType } from 'react-icons';
import { FaLeaf, FaSpa, FaDumbbell, FaBrain } from 'react-icons/fa';

import CallToAction from '../components/CallToAction';
import FeaturedPrograms from '../components/FeaturedPrograms';
import HeroSection from '../components/HeroSection';
import Testimonials from '../components/Testimonials';
import type { Program } from '../types';

interface InteractiveHomeWrapperProps {
  featuredPrograms: Program[];
}

interface FeatureItem {
  text: string;
  icon: IconType;
  color: string;
}

interface HowItWorksStep {
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  { text: 'Expert-Led Programs', icon: FaSpa, color: 'bg-emerald-400' },
  { text: 'Mindful Movement', icon: FaBrain, color: 'bg-purple-400' },
  { text: 'Holistic Approach', icon: FaLeaf, color: 'bg-blue-400' },
  { text: 'Sustainable Progress', icon: FaDumbbell, color: 'bg-pink-400' },
];

const steps: HowItWorksStep[] = [
  { 
    title: 'Choose Your Program', 
    description: 'Browse our wide range of mindfulness, meditation, and workout programs tailored to your goals.' 
  },
  { 
    title: 'Practice Anytime, Anywhere', 
    description: 'Access our guided sessions and workouts from the comfort of your home or on-the-go.' 
  },
  { 
    title: 'Track Your Progress', 
    description: 'Monitor your mental and physical well-being as you consistently engage with our programs.' 
  }
];

const InteractiveHomeWrapper: React.FC<InteractiveHomeWrapperProps> = ({ 
  featuredPrograms 
}): JSX.Element => {
  const handleSearch = (_query: string): void => {
    // TODO: Implement search functionality when needed
  };

  return (
    <>
      <HeroSection onSearch={handleSearch} />
      <FeaturedPrograms programs={featuredPrograms} />
        
      <section id="about-us" className="py-24 bg-darkBlue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image 
            src="/images/pattern.svg" 
            alt="Background pattern" 
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 font-heading">About EcoGym</h2>
            <div className="w-24 h-1 bg-turquoise-400 mx-auto mb-8" />
            <p className="text-xl text-lightBlue-100 max-w-3xl mx-auto">
              Transforming lives through the perfect harmony of mindfulness and movement
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <div className="relative">
                <Image 
                  src="/images/about-hero.jpg" 
                  alt="About EcoGym" 
                  width={600} 
                  height={400} 
                  className="rounded-2xl shadow-2xl"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <div className="absolute -bottom-6 -right-6 bg-turquoise-400 text-darkBlue-900 rounded-lg p-4 shadow-xl">
                  <p className="text-2xl font-bold">5000+</p>
                  <p className="text-sm">Active Members</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <h3 className="text-3xl font-bold mb-6 text-turquoise-400">Our Vision</h3>
              <p className="text-lg mb-8 text-lightBlue-100 leading-relaxed">
                EcoGym is revolutionizing wellness by seamlessly integrating mindfulness practices, meditation, and physical fitness. We believe in nurturing both mind and body to achieve true well-being.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-darkBlue-700 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className={`${item.color} p-3 rounded-lg mr-4`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
        
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-darkBlue-900 to-darkBlue-800">
        <div className="container mx-auto px-4">
          <h2 className="section-title">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="card text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-turquoise-500 text-darkBlue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-lightBlue-100">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <CallToAction />
    </>
  );
};

export default InteractiveHomeWrapper;
