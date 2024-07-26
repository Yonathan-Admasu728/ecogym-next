// app/components/ProgramDetail.tsx

import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  FaStar,
  FaPlay,
  FaArrowLeft,
  FaInfoCircle,
  FaHeart,
  FaClock,
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";
import { User, Program, Session } from "../types";
import { useAuth } from "../context/AuthContext";
import { trackSessionPlay } from "../utils/analytics";
import { cacheGet, cacheSet } from "../utils/cache";
import { PaymentService } from "../services/PaymentService";
import { useProgramActions } from '../hooks/useProgramActions';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, FacebookIcon, TwitterIcon, EmailIcon } from "react-share";

const InstructorModal = lazy(() => import("./InstructorModal"));
const PlaybackModal = lazy(() => import("./PlaybackModal"));
const SignInModal = lazy(() => import("./SignInModal"));

interface ProgramDetailProps {
  program: Program;
  onBack: () => void;
  onEnroll: () => void;
  isPurchased?: boolean;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({
  program,
  onBack,
  onEnroll,
  isPurchased,
}) => {
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isPlaybackModalOpen, setIsPlaybackModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(program.thumbnail || "/placeholder-image.jpg");
  const { user } = useAuth() as { user: User | null };

  const { isFavorite, isWatchLater, handleToggleFavorite, handleToggleWatchLater } = useProgramActions(program.id);

  const shareUrl = `${window.location.origin}/programs/${program.id}`;
  const shareTitle = `Check out this program: ${program.title}`;

  const checkPurchaseStatus = useCallback(async () => {
    if (!user || !user.id) {
      console.log("User not authenticated");
      return false;
    }

    const cacheKey = `purchase_${user.id}_${program.id}`;
    const cachedStatus = cacheGet<boolean>(cacheKey);
    if (cachedStatus !== null) return cachedStatus;

    setIsLoading(true);
    try {
      const purchased = await PaymentService.checkPurchaseStatus(program.id);
      cacheSet(cacheKey, purchased);
      return purchased;
    } catch (error) {
      console.error("Error checking purchase status:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, program.id]);

  const handlePlaySession = useCallback(async (session: Session) => {
    setError(null);

    if (!user) {
      setSelectedSession(session);
      setIsSignInModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const isFirstSession = session.order === 1;
      const isSingleSessionProgram = program.sessions.length === 1;

      if (isFirstSession || isSingleSessionProgram) {
        setSelectedSession(session);
        setIsPlaybackModalOpen(true);
        trackSessionPlay(user.id, program.id, session.id);
      } else {
        const isPurchased = await checkPurchaseStatus();
        if (isPurchased) {
          setSelectedSession(session);
          setIsPlaybackModalOpen(true);
          trackSessionPlay(user.id, program.id, session.id);
        } else {
          onEnroll();
        }
      }
    } catch (error) {
      console.error("Error playing session:", error);
      setError("An error occurred while trying to play the session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user, program, checkPurchaseStatus, onEnroll]);

  const handlePurchase = useCallback(async () => {
    if (!user || !user.id) {
      setIsSignInModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await PaymentService.createCheckoutSession(program.id);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Purchase error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, program.id]);

  const handleSignInSuccess = useCallback(() => {
    setIsSignInModalOpen(false);
    if (selectedSession) {
      handlePlaySession(selectedSession);
    }
  }, [selectedSession, handlePlaySession]);

  const toggleFavoriteHandler = handleToggleFavorite;
  const toggleWatchLaterHandler = handleToggleWatchLater;

  useEffect(() => {
    if (user && selectedSession && !isPlaybackModalOpen) {
      handlePlaySession(selectedSession);
    }
  }, [user, selectedSession, isPlaybackModalOpen, handlePlaySession]);

  const handleClosePlaybackModal = useCallback(() => {
    setIsPlaybackModalOpen(false);
    setSelectedSession(null);
  }, []);

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch(err => {
        toast.error('Failed to copy the link.');
      });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-turquoise hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Featured Programs
        </button>

        <div className="mb-8">
          {program.preview_video_url ? (
            <video
              src={program.preview_video_url}
              controls
              className="w-full max-h-[70vh] object-cover rounded-lg"
            />
          ) : (
            <Image
              src={imgSrc}
              alt={program.title}
              width={1200}
              height={675}
              className="w-full max-h-[70vh] object-cover rounded-lg"
              onError={() => setImgSrc("/placeholder-image.jpg")}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{program.title}</h1>
            <p className="text-xl text-gray-300 mb-6">{program.tagline}</p>
            <div className="flex items-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`${
                    star <= program.average_rating
                      ? "text-yellow-400"
                      : "text-gray-600"
                  } w-5 h-5`}
                />
              ))}
              <span className="ml-2 text-gray-300">
                ({program.review_count} reviews)
              </span>
            </div>
            <p className="text-gray-300 mb-8">{program.full_description}</p>

            <div className="flex space-x-4 mb-6">
            <button 
      onClick={handleToggleFavorite}
      className={`p-2 rounded-full transition duration-300 ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-700 text-turquoise hover:bg-gray-600'}`}
      aria-label="Toggle Favorite"
    >
      <FaHeart className="text-xl" />
    </button>
    <button 
      onClick={handleToggleWatchLater}
      className={`p-2 rounded-full transition duration-300 ${isWatchLater ? 'bg-blue-500 text-white' : 'bg-gray-700 text-turquoise hover:bg-gray-600'}`}
      aria-label="Toggle Watch Later"
    >
      <FaClock className="text-xl" />
    </button>
              <div className="relative">
                <button 
                  onClick={toggleShareMenu}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-300"
                  aria-label="Share Program"
                >
                  <FaShareAlt className="text-xl text-turquoise" />
                </button>
                {isShareMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2">
                    <FacebookShareButton url={shareUrl}>
                      <div className="flex items-center">
                        <FacebookIcon size={32} round />
                        <span className="ml-2">Facebook</span>
                      </div>
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl}>
                      <div className="flex items-center">
                        <TwitterIcon size={32} round />
                        <span className="ml-2">Twitter</span>
                      </div>
                    </TwitterShareButton>
                    <EmailShareButton url={shareUrl}>
                      <div className="flex items-center">
                        <EmailIcon size={32} round />
                        <span className="ml-2">Email</span>
                      </div>
                    </EmailShareButton>
                    <button 
                      onClick={handleCopyLink} 
                      className="flex items-center p-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition duration-300 w-full"
                    >
                      <FaCopy className="mr-2" />
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">About the Instructor</h2>
            <div className="flex items-center mb-4">
              <Image
                src={program.trainer.profile_picture || "/placeholder-avatar.jpg"}
                alt={`${program.trainer.user.first_name} ${program.trainer.user.last_name}`}
                width={60}
                height={60}
                className="rounded-full mr-4 cursor-pointer"
                onClick={() => setIsInstructorModalOpen(true)}
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {program.trainer.user.first_name} {program.trainer.user.last_name}
                </h3>
                <button
                  onClick={() => setIsInstructorModalOpen(true)}
                  className="text-turquoise hover:text-white transition-colors duration-300 flex items-center"
                >
                  View Profile <FaInfoCircle className="ml-2" />
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Program Sessions</h2>
            <ul className="space-y-4 mb-8">
              {program.sessions.map((session, index) => (
                <li key={session.id} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">
                    Session {index + 1}: {session.title}
                  </h3>
                  <p className="text-gray-300">{session.description}</p>
                  <button
                    onClick={() => handlePlaySession(session)}
                    className="mt-2 bg-turquoise text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all duration-300"
                  >
                    <FaPlay className="inline mr-2" /> Play Session
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {!program.purchased_by_user && (
            <div className="md:col-span-1">
              <div className="bg-gray-800 p-6 rounded-lg sticky top-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
                <p className="text-gray-300 mb-6">
                  Join now to get access to this program and many more!
                </p>
                <button
                  onClick={handlePurchase}
                  className="w-full bg-turquoise text-gray-900 py-3 rounded-full font-semibold hover:bg-white transition-colors duration-300 flex items-center justify-center"
                >
                  <FaPlay className="mr-2" /> Purchase Program
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {isInstructorModalOpen && (
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
            onSignInSuccess={handleSignInSuccess}
          />
        )}

        {isPlaybackModalOpen && (
          <PlaybackModal
            isOpen={isPlaybackModalOpen}
            onClose={handleClosePlaybackModal}
            session={selectedSession}
          />
        )}
      </Suspense>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise"></div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProgramDetail;