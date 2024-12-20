// app/components/purchasedprograms.tsx
'use client';

import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

import { Program } from '../types';
import ProgramCard from './ProgramCard';
import ProgramDetail from './ProgramDetail';

interface PurchasedProgramsProps {
  programs: Program[];
}

const PurchasedPrograms: React.FC<PurchasedProgramsProps> = ({ programs }) => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleExplore = (program: Program) => {
    setSelectedProgram(program);
  };

  const handleBack = () => {
    setSelectedProgram(null);
  };

  const handleEnroll = () => {
    console.log('Enrolling in program:', selectedProgram?.title);
    setSelectedProgram(null);
  };

  if (selectedProgram) {
    return (
      <ProgramDetail 
        program={selectedProgram} 
        onBack={handleBack}
        onEnroll={handleEnroll}
        isPurchased={true}  // This will ensure that the purchase button is not shown for purchased programs
      />
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FaShoppingCart className="mr-2 text-green-500" />
         Programs You Own
      </h2>
      {programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isFeatured={false}
              onExplore={handleExplore}
              isPurchased={true}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">You haven&apos;t purchased any programs yet.</p>
      )}
    </div>
  );
};

export default PurchasedPrograms;
