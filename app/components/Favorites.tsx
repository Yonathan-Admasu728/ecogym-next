// app/components/Favorites.tsx
'use client';

import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

import { Program } from '../types';
import ProgramCard from './ProgramCard';
import ProgramDetail from './ProgramDetail';
import { toggleFavorite } from '../utils/api';

interface FavoritesProps {
  programs: Program[];
}

const Favorites: React.FC<FavoritesProps> = ({ programs: initialPrograms }) => {
  const [favorites, setFavorites] = useState<Program[]>(initialPrograms);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleToggleFavorite = async (programId: number) => {
    try {
      await toggleFavorite(programId);
      setFavorites(favorites.filter(program => program.id !== programId));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

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
              onExplore={handleExplore}
              onToggleFavorite={() => handleToggleFavorite(program.id)}
              isFavorite={true}
              isPurchased={program.purchased_by_user}  // Pass isPurchased prop
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
