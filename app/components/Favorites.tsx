// app/components/Favorites.tsx
'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaHeart } from 'react-icons/fa';

import { Program } from '../types';
import ProgramCard from './ProgramCard';
import ProgramDetail from './ProgramDetail';
import { toggleFavorite } from '../utils/api';
import { logger } from '../utils/logger';

interface FavoritesProps {
  programs: Program[];
}

const Favorites: React.FC<FavoritesProps> = ({ programs: initialPrograms }) => {
  const [favorites, setFavorites] = useState<Program[]>(initialPrograms);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const { user } = useAuth();
  const handleToggleFavorite = async (programId: string) => {
    try {
      await toggleFavorite(Number(programId));
      setFavorites(favorites.filter(program => program.id !== programId));
    } catch (error) {
      logger.error('Error toggling favorite', { error });
    }
  };

  const handleExplore = useCallback((programId: string) => {
    const program = favorites.find(p => p.id === programId);
    if (program) {
      setSelectedProgram(program);
    }
  }, [favorites]);

  const handleBack = () => {
    setSelectedProgram(null);
  };

  const handleEnroll = useCallback(() => {
    if (selectedProgram) {
      logger.info('Enrolling in program', { title: selectedProgram.title });
    }
    setSelectedProgram(null);
  }, [selectedProgram]);

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        onBack={handleBack}
        onEnroll={handleEnroll}
        isAuthenticated={!!user}
        isProcessing={false}
      />
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FaHeart className="mr-2 text-red-500" />
        Your Favorite Programs
      </h2>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isFeatured={false}
              isAuthenticated={!!user}
              onExplore={handleExplore}
              onQuickAddToFavorites={() => handleToggleFavorite(program.id)}
              onSignIn={() => {}} // No-op since we're already authenticated
              isPurchased={false}  // Default to false since we don't have this info
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">You haven&apos;t added any programs to your favorites yet.</p>
      )}
    </div>
  );
};

export default Favorites;
