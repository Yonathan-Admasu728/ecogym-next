'use client';

import { Dialog } from "@headlessui/react";
import React, { useState, useEffect, useCallback } from "react";
import { FaPlay, FaPause, FaExpand, FaCompress, FaLock } from "react-icons/fa";

import { Session, Program } from "../types";
import { isSessionFree } from '../types/program';
import { logger } from '../utils/logger';

interface PlaybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  program: Program;
  isPurchased: boolean;
  onPurchase: () => void;
}

const PlaybackModal: React.FC<PlaybackModalProps> = ({
  isOpen,
  onClose,
  session,
  program,
  isPurchased,
  onPurchase,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTimeUpdate = useCallback(() => {
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
      // Log progress for analytics
      if (videoElement.currentTime > 0) {
        logger.debug('Video playback progress', {
          sessionId: session.id,
          programId: program.id,
          currentTime: videoElement.currentTime,
          percentComplete: (videoElement.currentTime / videoElement.duration) * 100
        });
      }
    }
  }, [videoElement, session.id, program.id]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoElement) {
      setDuration(videoElement.duration);
      logger.info('Video loaded', {
        sessionId: session.id,
        programId: program.id,
        duration: videoElement.duration
      });
    }
  }, [videoElement, session.id, program.id]);

  const handleVideoError = useCallback((e: Event) => {
    const videoError = (e.target as HTMLVideoElement).error;
    logger.error('Video playback error', {
      sessionId: session.id,
      programId: program.id,
      error: videoError
    });
    setError('Failed to load video. Please try again.');
  }, [session.id, program.id]);

  useEffect(() => {
    const video = document.getElementById("video-player") as HTMLVideoElement;
    if (video) {
      setVideoElement(video);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("error", handleVideoError);
      
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("error", handleVideoError);
      };
    }
  }, [isOpen, handleTimeUpdate, handleLoadedMetadata, handleVideoError]);

  const togglePlay = () => {
    if (!isPurchased && !isSessionFree(program, session)) {
      onPurchase();
      return;
    }
    
    if (videoElement) {
      try {
        if (isPlaying) {
          videoElement.pause();
        } else {
          videoElement.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        logger.error('Error toggling video playback', error);
        setError('Failed to control video playback');
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPurchased && !isSessionFree(program, session)) {
      onPurchase();
      return;
    }

    const time = parseFloat(e.target.value);
    if (videoElement) {
      try {
        videoElement.currentTime = time;
        setCurrentTime(time);
      } catch (error) {
        logger.error('Error seeking video', error);
        setError('Failed to seek video');
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isPurchased && !isSessionFree(program, session)) {
      onPurchase();
      return;
    }

    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      logger.error('Error toggling fullscreen', error);
      setError('Failed to toggle fullscreen mode');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const defaultThumbnail = '/images/fallback.png';
  const videoUrl = session.video_url || '';
  const thumbnailUrl = session.thumbnail || defaultThumbnail;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-darkBlue-900/90 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 rounded-2xl max-w-4xl w-full mx-4 shadow-2xl border border-turquoise-400/20">
          <Dialog.Title className="text-2xl font-bold p-6 text-white">
            {session.title}
          </Dialog.Title>

          <div className="relative aspect-video rounded-lg overflow-hidden">
            <video
              id="video-player"
              className="w-full h-full"
              src={videoUrl}
              poster={thumbnailUrl}
              aria-label={`Video player for ${session.title}`}
            >
              Your browser does not support the video tag.
            </video>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-turquoise-400 transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise-400 rounded-lg p-2"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                </button>

                <div className="flex-1 flex items-center space-x-3">
                  <span className="text-white text-sm font-medium">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-2 bg-darkBlue-700/50 rounded-lg appearance-none cursor-pointer accent-turquoise-400 hover:accent-turquoise-300"
                    aria-label="Video progress"
                  />
                  <span className="text-white text-sm font-medium">
                    {formatTime(duration)}
                  </span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-turquoise-400 transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise-400 rounded-lg p-2"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <FaCompress size={20} />
                  ) : (
                    <FaExpand size={20} />
                  )}
                </button>
              </div>
            </div>

            {!isPurchased && !isSessionFree(program, session) && (
              <div className="absolute inset-0 bg-darkBlue-900/80 backdrop-blur-sm flex items-center justify-center">
                <button
                  onClick={onPurchase}
                  className="bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900 px-8 py-4 rounded-xl font-semibold hover:from-turquoise-400 hover:to-turquoise-300 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 focus:ring-offset-darkBlue-900 flex items-center space-x-2"
                >
                  <FaLock className="h-5 w-5" />
                  <span>Purchase to Watch</span>
                </button>
              </div>
            )}

            {error && (
              <div className="absolute top-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                {error}
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-3">
              {program.title}
            </h3>
            <p className="text-lightBlue-100 leading-relaxed">
              {session.description}
            </p>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PlaybackModal;
