// components/PlaybackModal.tsx

import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Session } from "../types";

interface PlaybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const PlaybackModal: React.FC<PlaybackModalProps> = React.memo(
  ({ isOpen, onClose, session }) => {
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
  }
);

PlaybackModal.displayName = "PlaybackModal";

export default PlaybackModal;