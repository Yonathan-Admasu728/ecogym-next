'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaHeart, FaClock, FaPlay, FaTimes } from 'react-icons/fa';

import { Program } from '../types';

interface CollectionViewProps {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
  type: 'favorites' | 'watchLater';
  onRemove: (programId: string) => void;
}

const CollectionView: React.FC<CollectionViewProps> = ({
  isOpen,
  onClose,
  programs,
  type,
  onRemove,
}) => {
  const router = useRouter();

  const title = type === 'favorites' ? 'Favorites' : 'Watch Later';
  const icon = type === 'favorites' ? <FaHeart size={24} /> : <FaClock size={24} />;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-darkBlue-900/95 rounded-2xl w-full max-w-6xl mx-4 p-6 shadow-2xl border border-turquoise-400/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-turquoise-400">{icon}</span>
              <h2 className="text-2xl font-bold">{title}</h2>
              <span className="bg-turquoise-400 text-darkBlue-900 px-2 py-1 rounded-full text-sm">
                {programs.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-darkBlue-800 rounded-full transition-colors duration-200"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Grid */}
          {programs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-lightBlue-100">
                {type === 'favorites'
                  ? 'No favorite programs yet'
                  : 'No programs in watch later'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <motion.div
                  key={program.id}
                  className="relative group bg-darkBlue-800 rounded-xl overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48">
                    <Image
                      src={program.thumbnail || '/images/placeholder-program.svg'}
                      alt={program.title}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBlue-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.push(`/programs/${program.id}`)}
                        className="bg-turquoise-400 text-darkBlue-900 p-4 rounded-full shadow-lg"
                      >
                        <FaPlay />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{program.title}</h3>
                    <p className="text-sm text-lightBlue-100 line-clamp-2 mb-4">
                      {program.description}
                    </p>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRemove(program.id)}
                      className="w-full flex items-center justify-center space-x-2 bg-darkBlue-700 hover:bg-darkBlue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      <FaTimes />
                      <span>Remove</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CollectionView;
