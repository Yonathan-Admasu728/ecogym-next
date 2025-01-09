'use client';

import { useState } from 'react';
import { FaClock } from 'react-icons/fa';

import { Program, toString } from '../types';
import ProgramCard from './ProgramCard';
import ProgramDetail from './ProgramDetail';
import { toggleWatchLater } from '../utils/api';
import { logger } from '../utils/logger';

interface WatchLaterProps {
  programs: Program[];
}

const WatchLater: React.FC<WatchLaterProps> = ({ programs: initialPrograms }) => {
  const [watchLaterPrograms, setWatchLaterPrograms] = useState<Program[]>(initialPrograms);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleToggleWatchLater = async (programId: string | number) => {
    try {
      await toggleWatchLater(parseInt(toString(programId), 10));
      setWatchLaterPrograms(watchLaterPrograms.filter(program => toString(program.id) !== toString(programId)));
    } catch (error) {
      logger.error('Error toggling watch later', { error });
    }
  };

  const handleExplore = (program: Program) => {
    setSelectedProgram(program);
  };

  const handleBack = () => {
    setSelectedProgram(null);
  };

  const handleEnroll = () => {
    logger.info('Enrolling in program', { title: selectedProgram?.title });
    setSelectedProgram(null);
  };

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        onBack={handleBack}
        onEnroll={handleEnroll}
        isAuthenticated={true}
        isProcessing={false}
      />
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FaClock className="mr-2 text-blue-500" />
        Your Watch Later List
      </h2>
      {watchLaterPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchLaterPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isFeatured={false}
              onExplore={(id) => {
                const prog = watchLaterPrograms.find(p => toString(p.id) === toString(id));
                if (prog) handleExplore(prog);
              }}
              isPurchased={false}
              isAuthenticated={true}
              onQuickAddToFavorites={() => handleToggleWatchLater(toString(program.id))}
              onSignIn={() => {}}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">You haven&apos;t added any programs to your watch later list yet.</p>
      )}
    </div>
  );
};

export default WatchLater;
