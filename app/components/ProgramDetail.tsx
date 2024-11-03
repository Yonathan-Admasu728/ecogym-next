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
  FaLock,
} from "react-icons/fa";
import { User, Program, Session } from "../types";
import { useAuth } from "../context/AuthContext";
import { trackSessionPlay } from "../utils/analytics";
import { useProgramActions } from '../hooks/useProgramActions';
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

  const { isFavorite, isWatchLater, handleToggleFavorite, handleToggleWatchLater } = useProgramActions();

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/programs/${program.id}`;
  const shareTitle = `Check out this program: ${program.title}`;

  const handlePlaySession = useCallback(async (session: Session, index: number) => {
    setError(null);

    if (!isAuthenticated) {
      setSelectedSession(session);
      setIsSignInModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const isFirstSession = index === 0;
      const isSingleSessionProgram = program.sessions?.length === 1;

      if (program.isFree || isPurchased || isFirstSession) {
        setSelectedSession(session);
        setIsPlaybackModalOpen(true);
        if (user && (user as any).id) {
          trackSessionPlay((user as any).id.toString(), parseInt(program.id), parseInt(session.id));
        }
      } else if (isSingleSessionProgram && !isPurchased) {
        // For single-session programs, require purchase for repeated access
        onEnroll();
      } else {
        // For multi-session programs, require purchase for non-first sessions
        onEnroll();
      }
    } catch (error) {
      console.error("Error playing session:", error);
      setError("An error occurred while trying to play the session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, program, isPurchased, user, onEnroll]);

  const handlePurchase = useCallback(() => {
    if (!isAuthenticated) {
      setIsSignInModalOpen(true);
      return;
    }
    onEnroll();
  }, [isAuthenticated, onEnroll]);

  const handleSignInSuccess = useCallback(() => {
    setIsSignInModalOpen(false);
    if (selectedSession) {
      handlePlaySession(selectedSession, program.sessions?.findIndex(s => s.id === selectedSession.id) || 0);
    }
  }, [selectedSession, handlePlaySession, program.sessions]);

  const handleClosePlaybackModal = useCallback(() => {
    setIsPlaybackModalOpen(false);
    setSelectedSession(null);
  }, []);

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success('Link copied to clipboard!');
        })
        .catch(err => {
          toast.error('Failed to copy the link.');
        });
    }
  };

  const handlePurchaseStatusChange = (purchased: boolean) => {
    setIsPurchased(purchased);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* ... (rest of the component remains the same) ... */}

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
            onSignInSuccess={handleSignInSuccess}
          />
        )}

        {isPlaybackModalOpen && selectedSession && (
          <PlaybackModal
            isOpen={isPlaybackModalOpen}
            onClose={handleClosePlaybackModal}
            session={selectedSession}
            program={program}
            isPurchased={isPurchased}
            onPurchase={handlePurchase}
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
