// app/components/ProgramList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePrograms } from '../context/ProgramContext';
import { ProgramCard } from './';
import ProgramDetail from './ProgramDetail';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { AnimatePresence } from 'framer-motion';
import { Program } from '../types';
import { fetchPrograms, fetchProgramsByCategory } from '../utils/api';
import 'swiper/css';
import 'swiper/css/pagination';

interface ProgramListProps {
  category?: string;
  title: string;
}

const ProgramList: React.FC<ProgramListProps> = ({ category, title }) => {
  const { isLoading: contextLoading, error: contextError } = usePrograms();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPrograms = category
          ? await fetchProgramsByCategory(category)
          : await fetchPrograms();
        setPrograms(fetchedPrograms);
      } catch (err) {
        setError('Failed to load programs. Please try again.');
        console.error('Error loading programs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, [category]);

  const handleExplore = (program: Program) => {
    setSelectedProgram(program);
  };

  const handleEnroll = () => {
    // Implement enrollment logic here
    console.log('Enrolling in program:', selectedProgram?.title);
    setSelectedProgram(null);
  };

  if (isLoading || contextLoading) return <div>Loading...</div>;
  if (error || contextError) return <div>Error: {error || contextError}</div>;
  if (programs.length === 0) return <div>No programs available.</div>;

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
        onEnroll={handleEnroll}
      />
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">{title}</h1>
        
        <AnimatePresence>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <ProgramCard 
                key={program.id}
                program={program}
                isFeatured={index === 0}
                onExplore={handleExplore}
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
            {programs.map((program) => (
              <SwiperSlide key={program.id}>
                <ProgramCard 
                  program={program}
                  isFeatured={false}
                  onExplore={handleExplore}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ProgramList;