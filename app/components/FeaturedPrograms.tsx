// app/components/FeaturedPrograms.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePrograms } from '../context/ProgramContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { AnimatePresence } from 'framer-motion';
import SEO from './SEO';
import { ProgramCard } from './';
import ProgramDetail from './ProgramDetail';
import StructuredData from './StructuredData';
import { Program } from '../types';
import 'swiper/css';
import 'swiper/css/pagination';
import { useAuth } from '../context/AuthContext';

const SkeletonLoader: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-gray-800 p-4 rounded-lg">
        <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
        <div className="bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
        <div className="bg-gray-700 h-4 w-1/2 rounded"></div>
      </div>
    ))}
  </div>
);

const ErrorMessage: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="text-center py-8 text-red-500">
    {error}
    <button 
      onClick={onRetry}
      className="mt-4 bg-turquoise text-white px-4 py-2 rounded"
    >
      Retry
    </button>
  </div>
);

const NoPrograms: React.FC = () => (
  <div className="text-center py-8">No featured programs available at the moment.</div>
);

interface FeaturedProgramsProps {
  purchasedPrograms?: Program[];
}

const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ purchasedPrograms = [] }) => {
  const { featuredPrograms, isLoading, error, fetchFeaturedPrograms, userPrograms } = usePrograms();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (featuredPrograms.length === 0) {
      fetchFeaturedPrograms();
    }
  }, [featuredPrograms, fetchFeaturedPrograms]);

  const categories = ['All', ...Array.from(new Set(featuredPrograms.map(program => program.category)))];

  const filteredPrograms = activeCategory === 'All' 
    ? featuredPrograms 
    : featuredPrograms.filter(program => program.category === activeCategory);

  const handleExplore = (program: Program) => {
    if (!user) {
      alert('Please log in to explore the program.');
      return;
    }
    setSelectedProgram({
      ...program,
      purchased_by_user: userPrograms.purchased_programs.some(p => p.id === program.id)
    });
  };

  const handleEnroll = () => {
    console.log('Enrolling in program:', selectedProgram?.title);
    setSelectedProgram(null);
  };

  const isProgramPurchased = (programId: number) => {
    return purchasedPrograms.some(p => p.id === programId) || 
           userPrograms.purchased_programs.some(p => p.id === programId);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorMessage error={error} onRetry={fetchFeaturedPrograms} />;
  if (featuredPrograms.length === 0) return <NoPrograms />;

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
        onEnroll={handleEnroll}
        isPurchased={selectedProgram.purchased_by_user}
      />
    );
  }

  return (
    <>
      <SEO 
        title="Featured Programs | Ecogym"
        description="Discover our featured fitness and wellness programs at Ecogym. Transform your body and mind with our expert-led sessions."
        url="https://ecogym.space/featured-programs"
        image="https://ecogym.space/images/featured-programs.jpg"
      />
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">    
          <h2 className="text-4xl font-bold mb-8 text-center">Featured Programs</h2>
          
          <div className="flex justify-center mb-8 space-x-4 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  activeCategory === category 
                    ? 'bg-turquoise text-gray-900' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <AnimatePresence>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, index) => (
               <ProgramCard 
               key={program.id} 
               program={program} 
               isFeatured={index === 0}
               onExplore={handleExplore} 
               isPurchased={isProgramPurchased(program.id)}
             />
              ))}
            </div>
          </AnimatePresence>

          <div className="md:hidden">
            <Swiper
              spaceBetween={30}
              pagination={{ clickable: true }}
              modules={[Pagination, Autoplay]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
            >
              {filteredPrograms.map((program) => (
                <SwiperSlide key={program.id}>
                  <ProgramCard 
                    program={program} 
                    isFeatured={false} 
                    onExplore={handleExplore}
                    isPurchased={isProgramPurchased(program.id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <StructuredData programs={featuredPrograms} />
    </>
  );
};

export default FeaturedPrograms;
