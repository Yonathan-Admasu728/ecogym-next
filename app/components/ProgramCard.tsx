// app/components/ProgramCard.tsx
"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  FaStar,
  FaBookmark,
  FaInfoCircle,
  FaClock,
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Program, ProgramCardProps } from "../types";
import InstructorModal from "./InstructorModal";
import { useProgramActions } from '../hooks/useProgramActions';
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from "react-share";

const ProgramCard: React.FC<ProgramCardProps> = memo(
  ({ program, isFeatured, onExplore, isPurchased })  => {
    const [isHovered, setIsHovered] = useState(false);
    const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState(() => {
      if (program.thumbnailUrl) return program.thumbnailUrl;
      if (program.thumbnail) return program.thumbnail;
      return "/placeholder-image.jpg";
    });
   
    const { isFavorite, isWatchLater, handleToggleFavorite, handleToggleWatchLater } = useProgramActions(program.id);

    const shareUrl = `${window.location.origin}/programs/${program.id}`;
    const shareTitle = `Check out this program: ${program.title}`;

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
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`program-card bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-lg shadow-xl relative transition-all duration-300 ${
          isFeatured ? "md:col-span-2 md:row-span-2" : ""
        } ${isHovered ? "scale-105 z-10" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full aspect-video mb-4">
          <Image
            src={imgSrc}
            alt={program.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            loading="lazy"
            onError={() => {
              console.error(`Failed to load image: ${imgSrc}`);
              setImgSrc("/placeholder-image.jpg");
            }}
          />
          <div className="absolute top-2 left-2 bg-turquoise text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
            {program.category}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-turquoise">
          {program.title}
        </h3>
        <p className="text-sm font-semibold mb-2 text-gray-300">
          {program.tagline}
        </p>

        <div className="flex items-center mb-2">
          <Image
            src={program.trainer.profile_picture || "/placeholder-avatar.jpg"}
            alt={`${program.trainer.user.first_name} ${program.trainer.user.last_name}`}
            width={24}
            height={24}
            className="rounded-full mr-2 cursor-pointer"
            onClick={() => setIsInstructorModalOpen(true)}
          />
          <span className="text-xs">
            {program.trainer.user.first_name} {program.trainer.user.last_name}
          </span>
          <button
            onClick={() => setIsInstructorModalOpen(true)}
            className="ml-2 text-turquoise hover:text-white transition-colors duration-300"
            aria-label="View instructor details"
          >
            <FaInfoCircle />
          </button>
        </div>

        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`${
                star <= program.average_rating
                  ? "text-yellow-400"
                  : "text-gray-400"
              } text-xs mr-1`}
            />
          ))}
          <span className="text-xs ml-1">({program.review_count})</span>
        </div>

        {isHovered && (
          <>
            <p className="text-sm mb-4">{program.description}</p>
            <div className="absolute bottom-4 right-4 flex space-x-2">
            <button 
        onClick={handleToggleFavorite}
        className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FaBookmark className={`${isFavorite ? 'text-yellow-400' : 'text-turquoise'} text-sm`} />
      </button>
      <button 
        onClick={handleToggleWatchLater}
        className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300"
        aria-label={isWatchLater ? "Remove from watch later" : "Add to watch later"}
      >
        <FaClock className={`${isWatchLater ? 'text-yellow-400' : 'text-turquoise'} text-sm`} />
      </button>
              <div className="relative">
                <button 
                  onClick={toggleShareMenu}
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300"
                  aria-label="Share Program"
                >
                  <FaShareAlt className="text-turquoise text-sm" />
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
          </>
        )}

        <button
          onClick={() => onExplore(program)}
          className="mt-2 bg-turquoise text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-turquoise transition-all duration-300"
          aria-label={`Explore ${program.title} program`}
        >
          Explore Program
        </button>

        <InstructorModal
          isOpen={isInstructorModalOpen}
          onClose={() => setIsInstructorModalOpen(false)}
          trainer={program.trainer}
        />
      </motion.div>
    );
  }
);

ProgramCard.displayName = "ProgramCard";

export default ProgramCard;