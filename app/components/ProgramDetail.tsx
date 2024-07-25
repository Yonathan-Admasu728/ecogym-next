// app/components/ProgramDetail.tsx

import React, { useState, useCallback, useEffect } from "react";
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
import { Dialog, DialogTitle, DialogPanel } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import SignInModal from "./SignInModal";
import { trackSessionPlay } from "../utils/analytics";
import { cacheGet, cacheSet } from "../utils/cache";
import { PaymentService } from "../services/PaymentService";
import { loadStripe } from "@stripe/stripe-js";
import { toggleFavorite, toggleWatchLater } from "../utils/api";

import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from "react-share";

interface ProgramDetailProps {
  program: Program;
  onBack: () => void;
  onEnroll: () => void;
  isPurchased?: boolean;
}

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Program["trainer"];
}

const InstructorModal: React.FC<InstructorModalProps> = ({
  isOpen,
  onClose,
  trainer,
}) => (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="mx-auto max-w-sm rounded bg-gray-800 p-6 text-white">
        <Dialog.Title className="text-lg font-medium leading-6 text-white">
          {trainer.user.first_name} {trainer.user.last_name}
        </Dialog.Title>
        <div className="mt-2">
          <Image
            src={trainer.profile_picture || "/placeholder-avatar.jpg"}
            alt={`${trainer.user.first_name} ${trainer.user.last_name}`}
            width={100}
            height={100}
            className="rounded-full mx-auto mb-4"
          />
          <p className="text-sm text-gray-300">{trainer.bio}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-turquoise px-4 py-2 text-sm font-medium text-white hover:bg-turquoise-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise-light focus-visible:ring-offset-2"
        >
          Close
        </button>
      </Dialog.Panel>
    </div>
  </Dialog>
);

const PlaybackModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}> = React.memo(({ isOpen, onClose, session }) => {
  console.log("Rendering PlaybackModal", { isOpen, session });

  if (!session) {
    return null; // Don't render anything if there's no session
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-3xl w-full bg-gray-800 rounded-lg p-6">
          <DialogTitle className="text-2xl font-bold text-white mb-4">
            {session.title}
          </DialogTitle>
          {session.video_url ? (
            <video
              key={session.id}
              src={session.video_url}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          ) : (
            <p className="text-white">No video available for this session.</p>
          )}
          <button
            onClick={onClose}
            className="mt-4 bg-turquoise text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-white transition-all duration-300"
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
});

PlaybackModal.displayName = "PlaybackModal";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

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
  const [isFavorite, setIsFavorite] = useState<boolean>(
    program.isFavorite || false
  );
  const [isWatchLater, setIsWatchLater] = useState<boolean>(
    program.isWatchLater || false
  );
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    program.thumbnail || "/placeholder-image.jpg"
  );
  const { user } = useAuth() as { user: User | null };

  // Define share URL and title
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

  const handlePlaySession = useCallback(
    async (session: Session) => {
      console.log("handlePlaySession called", { session, user });
      setError(null);

      if (!user) {
        console.log("User not authenticated, opening sign-in modal");
        setSelectedSession(session);
        setIsSignInModalOpen(true);
        return;
      }

      setIsLoading(true);

      try {
        const isFirstSession = session.order === 1;
        const isSingleSessionProgram = program.sessions.length === 1;

        if (isFirstSession || isSingleSessionProgram) {
          console.log("Playing session", session);
          setSelectedSession(session);
          setIsPlaybackModalOpen(true);
          trackSessionPlay(user.id, program.id, session.id);
        } else {
          const isPurchased = await checkPurchaseStatus();
          if (isPurchased) {
            console.log("Playing purchased session", session);
            setSelectedSession(session);
            setIsPlaybackModalOpen(true);
            trackSessionPlay(user.id, program.id, session.id);
          } else {
            console.log("Redirecting to purchase for locked session");
            onEnroll();
          }
        }
      } catch (error) {
        console.error("Error playing session:", error);
        setError(
          "An error occurred while trying to play the session. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user, program, checkPurchaseStatus, onEnroll]
  );

  const handlePurchase = useCallback(async () => {
    if (!user || !user.id) {
      setIsSignInModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await PaymentService.createCheckoutSession(program.id);
      // The redirect to Stripe should be handled within the PaymentService
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Purchase error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, program.id]);

  const handleSignInSuccess = useCallback(() => {
    console.log("Sign-in successful, retrying last action");
    setIsSignInModalOpen(false);
    if (selectedSession) {
      handlePlaySession(selectedSession);
    }
  }, [selectedSession, handlePlaySession]);

  const toggleFavoriteHandler = useCallback(async () => {
    try {
      await toggleFavorite(program.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }, [program.id, isFavorite]);

  const toggleWatchLaterHandler = useCallback(async () => {
    try {
      await toggleWatchLater(program.id);
      setIsWatchLater(!isWatchLater);
    } catch (error) {
      console.error("Error toggling watch later:", error);
    }
  }, [program.id, isWatchLater]);

  useEffect(() => {
    if (user && selectedSession && !isPlaybackModalOpen) {
      console.log("User authenticated and session selected, playing session");
      handlePlaySession(selectedSession);
    }
  }, [user, selectedSession, isPlaybackModalOpen, handlePlaySession]);

  useEffect(() => {
    console.log("selectedSession changed:", selectedSession);
  }, [selectedSession]);

  const handleClosePlaybackModal = useCallback(() => {
    console.log("Closing playback modal");
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

  console.log("Rendering ProgramDetail", {
    isPlaybackModalOpen,
    selectedSession,
  });

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
      onClick={toggleFavoriteHandler}
      className={`p-2 rounded-full transition duration-300 ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-700 text-turquoise hover:bg-gray-600'}`}
      aria-label="Toggle Favorite"
    >
      <FaHeart className="text-xl" />
    </button>
    <button 
      onClick={toggleWatchLaterHandler}
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
                src={
                  program.trainer.profile_picture || "/placeholder-avatar.jpg"
                }
                alt={`${program.trainer.user.first_name} ${program.trainer.user.last_name}`}
                width={60}
                height={60}
                className="rounded-full mr-4 cursor-pointer"
                onClick={() => setIsInstructorModalOpen(true)}
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {program.trainer.user.first_name}{" "}
                  {program.trainer.user.last_name}
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

      <InstructorModal
        isOpen={isInstructorModalOpen}
        onClose={() => setIsInstructorModalOpen(false)}
        trainer={program.trainer}
      />

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />

      <PlaybackModal
        isOpen={isPlaybackModalOpen}
        onClose={handleClosePlaybackModal}
        session={selectedSession}
      />

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
