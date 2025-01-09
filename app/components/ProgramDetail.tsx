'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { FaPlay, FaHeart, FaShare, FaBookmark } from 'react-icons/fa';

import { Program, Session } from '../types';
import PlaybackModal from './PlaybackModal';
import PurchaseButton from './PurchaseButton';
import SessionList from './SessionList';
import ShareMenu from './ShareMenu';
import { useAuth } from '../context/AuthContext';
import { useProgramActions } from '../hooks/useProgramActions';

const DEFAULT_THUMBNAIL = '/images/placeholder-program.svg';

interface ProgramDetailProps {
  program: Program;
  onBack: () => void;
  onEnroll: () => void;
  isAuthenticated: boolean;
  isProcessing?: boolean;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({
  program,
  onBack,
  onEnroll,
  isAuthenticated,
  isProcessing = false,
}) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isPlaybackModalOpen, setIsPlaybackModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const { } = useAuth(); // Remove unused auth context
  const { handleToggleFavorite, handleToggleWatchLater, isProgramPurchased } = useProgramActions();

  const handlePlaySession = (session: Session) => {
    setSelectedSession(session);
    setIsPlaybackModalOpen(true);
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      // Handle unauthenticated user
      return;
    }
    onEnroll();
  };

  const renderLearningOutcomes = () => {
    if (!program.learning_outcomes?.length) {
      return (
        <p className="text-lightBlue-100">No learning outcomes specified for this program.</p>
      );
    }

    return (
      <ul className="list-disc list-inside text-lightBlue-100 mb-8">
        {program.learning_outcomes.map((outcome, index) => (
          <li key={index} className="mb-2">{outcome}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-darkBlue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 text-lightBlue-100 hover:text-white transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Program Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={program.thumbnail || DEFAULT_THUMBNAIL}
              alt={program.title}
              className="w-full h-full object-cover"
              width={800}
              height={450}
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button
                onClick={() => program.sessions?.[0] && handlePlaySession(program.sessions[0])}
                className="bg-turquoise-500 text-white p-4 rounded-full hover:bg-turquoise-600 transition-colors"
              >
                <FaPlay className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
            {program.tagline && (
              <p className="text-xl text-turquoise-400 mb-4">{program.tagline}</p>
            )}
            <p className="text-lightBlue-100 mb-6">{program.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-darkBlue-800 px-4 py-2 rounded-lg">
                <span className="text-sm text-lightBlue-100">Duration</span>
                <p className="font-semibold">{program.duration}</p>
              </div>
              <div className="bg-darkBlue-800 px-4 py-2 rounded-lg">
                <span className="text-sm text-lightBlue-100">Level</span>
                <p className="font-semibold">{program.level}</p>
              </div>
              <div className="bg-darkBlue-800 px-4 py-2 rounded-lg">
                <span className="text-sm text-lightBlue-100">Sessions</span>
                <p className="font-semibold">{program.sessions?.length || 0}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => handleToggleFavorite(program.id)}
                className="flex items-center space-x-2 text-lightBlue-100 hover:text-white transition-colors"
              >
                <FaHeart className="w-5 h-5" />
                <span>Add to Favorites</span>
              </button>
              <button
                onClick={() => handleToggleWatchLater(program.id)}
                className="flex items-center space-x-2 text-lightBlue-100 hover:text-white transition-colors"
              >
                <FaBookmark className="w-5 h-5" />
                <span>Watch Later</span>
              </button>
              <button
                onClick={() => setIsShareMenuOpen(true)}
                className="flex items-center space-x-2 text-lightBlue-100 hover:text-white transition-colors"
              >
                <FaShare className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            <PurchaseButton
              program={program}
              isPurchased={isProgramPurchased(program.id)}
              onPurchase={handlePurchase}
              isAuthenticated={isAuthenticated}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Program Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About this Program</h2>
            <p className="text-lightBlue-100 mb-8">{program.detailed_description || program.description}</p>

            <h2 className="text-2xl font-bold mb-4">What You&apos;ll Learn</h2>
            {renderLearningOutcomes()}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Program Sessions</h2>
            <SessionList
              program={program}
              sessions={program.sessions || []}
              onPlaySession={handlePlaySession}
              isPurchased={isProgramPurchased(program.id)}
            />
          </div>
        </div>

        {/* Modals */}
        {selectedSession && (
          <PlaybackModal
            isOpen={isPlaybackModalOpen}
            onClose={() => setIsPlaybackModalOpen(false)}
            session={selectedSession}
            program={program}
            isPurchased={isProgramPurchased(program.id)}
            onPurchase={handlePurchase}
          />
        )}

        <ShareMenu
          isOpen={isShareMenuOpen}
          onClose={() => setIsShareMenuOpen(false)}
          program={program}
        />
      </div>
    </div>
  );
};

export default ProgramDetail;
