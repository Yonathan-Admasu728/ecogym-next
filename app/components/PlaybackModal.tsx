// components/PlaybackModal.tsx

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Session, Program } from "../types";

interface PlaybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  program: Program;
  isPurchased: boolean;
  onPurchase: () => void;
}

const PlaybackModal: React.FC<PlaybackModalProps> = React.memo(
  ({ isOpen, onClose, session, program, isPurchased, onPurchase }) => {
    const [videoTime, setVideoTime] = useState(0);
    const previewTime = 300; // 5 minutes in seconds

    useEffect(() => {
      const video = document.getElementById("session-video") as HTMLVideoElement;
      if (video) {
        const handleTimeUpdate = () => {
          setVideoTime(video.currentTime);
          if (!isPurchased && !program.isFree && video.currentTime >= previewTime) {
            video.pause();
            video.currentTime = previewTime;
          }
        };
        video.addEventListener("timeupdate", handleTimeUpdate);
        return () => video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }, [isPurchased, program.isFree]);

    if (!session) {
      return null;
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
              <div className="relative">
                <video
                  id="session-video"
                  key={session.id}
                  src={session.video_url}
                  controls
                  className="w-full rounded-lg"
                />
                {!isPurchased && !program.isFree && videoTime >= previewTime && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white text-xl mb-4">
                        Preview ended. Purchase the program to continue watching.
                      </p>
                      <button
                        onClick={onPurchase}
                        className="bg-turquoise text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-white transition-all duration-300"
                      >
                        Purchase Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white">No video available for this session.</p>
            )}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={onClose}
                className="bg-turquoise text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-white transition-all duration-300"
              >
                Close
              </button>
              {!isPurchased && !program.isFree && (
                <p className="text-white">
                  {videoTime < previewTime
                    ? `Preview: ${Math.floor((previewTime - videoTime) / 60)}:${String(
                        Math.floor((previewTime - videoTime) % 60)
                      ).padStart(2, "0")} remaining`
                    : "Preview ended"}
                </p>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    );
  }
);

PlaybackModal.displayName = "PlaybackModal";

export default PlaybackModal;
