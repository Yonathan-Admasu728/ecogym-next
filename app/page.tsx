'use client';

import React, { useEffect, useState } from 'react';
import { HeroSection, FeaturedPrograms, Testimonials, CallToAction, SEO } from './components';
import Image from 'next/image';
import { FaLeaf, FaHeart, FaSpa, FaDumbbell, FaBrain } from 'react-icons/fa';
import { Program } from './types';
import { ProgramService } from './services/ProgramService';

const HomePage = () => {
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedPrograms = async () => {
      try {
        const programs = await ProgramService.getFeaturedPrograms();
        setFeaturedPrograms(programs);
        setError(null);
      } catch (error) {
        console.error('Error fetching featured programs:', error);
        setError('Failed to load featured programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPrograms();
  }, []);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality here
  };

  return (
    <>
      <SEO
        title="EcoGym - Transform Your Mind and Body"
        description="Join EcoGym for expert-led meditation, mindfulness practices, and effective home workouts. Transform your mind and body, anytime, anywhere."
        url="https://www.ecogym.space"
      />
      <div className="flex flex-col min-h-screen bg-darkBlue-900 text-white">
        <main className="flex-grow">
          <HeroSection onSearch={handleSearch} />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise-400"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lightBlue-100">{error}</p>
            </div>
          ) : (
            <FeaturedPrograms programs={featuredPrograms} />
          )}
          
          <section id="about-us" className="py-20 bg-darkBlue-800 relative overflow-hidden">
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
              <h2 className="section-title">About EcoGym</h2>
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="lg:w-1/2 mb-8 lg:mb-0">
                  <Image 
                    src="/images/about-hero.jpg" 
                    alt="About EcoGym" 
                    width={500} 
                    height={300} 
                    className="rounded-xl shadow-lg"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
                <div className="lg:w-1/2 lg:pl-12">
                  <p className="text-lg mb-6 text-lightBlue-100">
                    EcoGym is a revolutionary wellness platform that combines mindfulness practices, guided meditations, and effective home workouts. We believe in nurturing both the mind and body for overall well-being.
                  </p>
                  <p className="text-lg mb-6 text-lightBlue-100">
                    Our comprehensive approach includes:
                  </p>
                  <ul className="list-none mb-6">
                    {[
                      { text: 'Guided meditation sessions for mental clarity', icon: FaSpa },
                      { text: 'Mindfulness exercises for stress reduction', icon: FaBrain },
                      { text: 'Home workout programs for physical fitness', icon: FaDumbbell },
                      { text: 'Expert-led sessions for all experience levels', icon: FaLeaf },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center mb-3 transform hover:translate-x-2 transition-transform duration-300">
                        <item.icon className="text-turquoise-400 mr-3 w-5 h-5" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-lg text-lightBlue-100">
                    Join EcoGym today and embark on a journey to a healthier, more balanced you!
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section id="how-it-works" className="py-20 bg-gradient-to-b from-darkBlue-900 to-darkBlue-800">
            <div className="container mx-auto px-4">
              <h2 className="section-title">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[
                  { title: 'Choose Your Program', description: 'Browse our wide range of mindfulness, meditation, and workout programs tailored to your goals.' },
                  { title: 'Practice Anytime, Anywhere', description: 'Access our guided sessions and workouts from the comfort of your home or on-the-go.' },
                  { title: 'Track Your Progress', description: 'Monitor your mental and physical well-being as you consistently engage with our programs.' }
                ].map((step, index) => (
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
          
          <section id="benefits" className="py-20 bg-darkBlue-800 relative overflow-hidden">
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
              <h2 className="section-title">Benefits of EcoGym</h2>
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="lg:w-1/2 mb-8 lg:mb-0">
                  <Image 
                    src="/images/med1.png" 
                    alt="Benefits of EcoGym" 
                    width={500} 
                    height={300} 
                    className="rounded-xl shadow-lg"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
                <div className="lg:w-1/2 lg:pl-12">
                  <p className="text-lg mb-6 text-lightBlue-100">
                    At EcoGym, we're committed to helping you achieve holistic well-being. Here's how our approach benefits you:
                  </p>
                  <ul className="list-none mb-6">
                    {[
                      'Reduced stress and anxiety through regular mindfulness practice',
                      'Improved focus and productivity with guided meditation',
                      'Enhanced physical fitness with our home workout programs',
                      'Greater overall well-being by nurturing both mind and body'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center mb-3 transform hover:translate-x-2 transition-transform duration-300">
                        <FaHeart className="text-turquoise-400 mr-3 w-5 h-5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-lg text-lightBlue-100">
                    By choosing EcoGym, you're investing in a healthier, more balanced lifestyle.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <Testimonials />
          <CallToAction />
        </main>
      </div>
    </>
  );
};

export default HomePage;
