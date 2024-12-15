import React, { useState, useCallback, lazy, Suspense } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  FaStar,
  FaArrowLeft,
  FaHeart,
  FaClock,
  FaShareAlt,
  FaCopy,
  FaCheckCircle,
} from "react-icons/fa";
import { Program, Session } from "../types";
import { useAuth } from "../context/AuthContext";
import { trackSessionPlay } from "../utils/analytics";
import { useProgramActions } from '../hooks/useProgramActions';
import SessionList from './SessionList';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, FacebookIcon, TwitterIcon, EmailIcon } from "react-share";
import PurchaseStatus from "./PurchaseStatus";

const InstructorModal = lazy(() => import("./InstructorModal"));
const PlaybackModal = lazy(() => import("./PlaybackModal"));
const SignInModal = lazy(() => import("./SignInModal"));

interface ProgramDetailProps {
  program: Program;
  onBack: () => void;
  onEnroll: () => void;
  isAuthenticated: boolean;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({
  program,
  onBack,
  onEnroll,
  isAuthenticated,
}) => {
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isPlaybackModalOpen, setIsPlaybackModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(program.thumbnail || "/placeholder-image.jpg");
  
  const { user } = useAuth();
  const { isFavorite, handleToggleFavorite } = useProgramActions();

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/programs/${program.id}`;
  const shareTitle = `Check out this program: ${program.title}`;

  const handleSessionClick = useCallback((session: Session) => {
    if (!isAuthenticated) {
      setSelectedSession(session);
      setIsSignInModalOpen(true);
      return;
    }

    if (program.program_type === 'multi_session_linear' && !isSessionAvailable(session)) {
      toast.error('Please complete the prerequisite sessions first.');
      return;
    }

    if (program.isFree || isPurchased || session.is_preview) {
      setSelectedSession(session);
      setIsPlaybackModalOpen(true);
      if (user && (user as any).id) {
        trackSessionPlay(
          (user as any).id.toString(),
          typeof program.id === 'string' ? parseInt(program.id, 10) || 0 : program.id,
          typeof session.id === 'string' ? parseInt(session.id, 10) || 0 : session.id
        );
      }
    } else {
      onEnroll();
    }
  }, [isAuthenticated, program, isPurchased, user, onEnroll]);

  const isSessionAvailable = useCallback((session: Session) => {
    if (!session.prerequisites?.length) return true;
    if (!program.progress) return false;
    
    return session.prerequisites.every(prereqId => {
      const prereqSession = program.sessions.find(s => s.id === prereqId);
      return prereqSession?.progress?.completed;
    });
  }, [program]);

  const handlePurchaseStatusChange = (purchased: boolean) => {
    setIsPurchased(purchased);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleToggleFavorite(program.id)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite(program.id)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <FaHeart />
              </button>
              <button
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="relative aspect-video">
                <Image
                  src={imgSrc}
                  alt={program.title}
                  layout="fill"
                  objectFit="cover"
                  onError={() => setImgSrc("/placeholder-image.jpg")}
                  priority
                />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {program.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <span className="flex items-center">
                    <FaClock className="mr-2" />
                    {program.duration}
                  </span>
                  <span className="flex items-center">
                    <FaStar className="mr-2 text-yellow-500" />
                    {program.average_rating || "Not rated"} ({program.review_count || 0} reviews)
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {program.level}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {program.detailed_description || program.description}
                </p>
              </div>
            </div>

            {/* Sessions */}
            <SessionList
              sessions={program.sessions}
              onSessionClick={handleSessionClick}
              isAuthenticated={isAuthenticated}
              isPurchased={isPurchased}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress or Purchase Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                {program.progress ? (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Your Progress
                    </h3>
                    <div className="space-y-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {Math.round(program.progress.completion_percentage)}% Complete
                          </span>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                          <div
                            style={{ width: `${program.progress.completion_percentage}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Sessions Completed</span>
                        <span>{program.progress.sessions_completed}/{program.total_sessions}</span>
                      </div>
                      {program.progress.startedAt && (
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Started</span>
                          <span>{new Date(program.progress.startedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {program.isFree ? "Free Program" : `$${program.price}`}
                    </h3>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          setIsSignInModalOpen(true);
                        } else {
                          onEnroll();
                        }
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      {program.isFree ? "Start Now" : "Purchase Program"}
                    </button>
                  </div>
                )}
              </div>

              {/* Instructor Card */}
              {program.trainer && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Your Instructor
                  </h3>
                  <button
                    onClick={() => setIsInstructorModalOpen(true)}
                    className="w-full flex items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                  >
                    <Image
                      src={program.trainer.profile_picture || "/placeholder-avatar.svg"}
                      alt={`${program.trainer.user?.first_name} ${program.trainer.user?.last_name}`}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {program.trainer.user?.first_name} {program.trainer.user?.last_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        View Profile
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Suspense fallback={<div>Loading...</div>}>
        {isInstructorModalOpen && program.trainer && (
          <InstructorModal
            isOpen={isInstructorModalOpen}
            onClose={() => setIsInstructorModalOpen(false)}
            trainer={program.trainer}
          />
        )}

        {isSignInModalOpen && (
          <SignInModal
            isOpen={isSignInModalOpen}
            onClose={() => setIsSignInModalOpen(false)}
            onSignInSuccess={() => {
              setIsSignInModalOpen(false);
              if (selectedSession) {
                handleSessionClick(selectedSession);
              }
            }}
          />
        )}

        {isPlaybackModalOpen && selectedSession && (
          <PlaybackModal
            isOpen={isPlaybackModalOpen}
            onClose={() => {
              setIsPlaybackModalOpen(false);
              setSelectedSession(null);
            }}
            session={selectedSession}
            program={program}
            isPurchased={isPurchased}
            onPurchase={onEnroll}
          />
        )}
      </Suspense>

      {/* Share Menu */}
      {isShareMenuOpen && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg z-50">
          <div className="flex gap-4">
            <FacebookShareButton url={shareUrl} hashtag="#EcoGym">
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <EmailShareButton url={shareUrl} subject={shareTitle}>
              <EmailIcon size={32} round />
            </EmailShareButton>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied to clipboard!');
              }}
              className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FaCopy />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-xl shadow-lg">
          {error}
        </div>
      )}

      {/* Purchase Status */}
      <PurchaseStatus
        programId={program.id}
        onPurchaseStatusChange={handlePurchaseStatusChange}
      />
    </div>
  );
};

export default ProgramDetail;
