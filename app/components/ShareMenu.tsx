'use client';

import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaLink,
  FaCheck,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Program } from '../types';
import { logger } from '../utils/logger';


interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ isOpen, onClose, program }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/programs/${program.id}`
    : '';

  const shareText = `Check out ${program.title} on EcoGym!`;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: FaFacebookF,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877f2] hover:bg-[#0d65d9]',
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#1da1f2] hover:bg-[#0c85d0]',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#0a66c2] hover:bg-[#084e96]',
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: `mailto:?subject=${encodeURIComponent(`Check out ${program.title}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy to clipboard', err);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-darkBlue-900/80 backdrop-blur-md" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-gradient-to-b from-darkBlue-800 to-darkBlue-900 p-6 shadow-2xl border border-turquoise-400/20 transition-all">
          <Dialog.Title className="text-2xl font-bold mb-2 text-white">
            Share {program.title}
          </Dialog.Title>
          
          <p className="text-turquoise-400/80 mb-6">
            Share this program with your friends and family
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} text-white p-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darkBlue-800 focus:ring-turquoise-400`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
          </div>

          <div className="relative">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-darkBlue-700/50 text-white px-4 py-4 rounded-xl border-2 border-turquoise-400/30 focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:border-transparent"
              />
              <button
                onClick={copyToClipboard}
                className={`p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darkBlue-800 focus:ring-turquoise-400 ${
                  isCopied 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-turquoise-500 hover:bg-turquoise-400'
                }`}
                title="Copy link to clipboard"
              >
                {isCopied ? (
                  <FaCheck className="w-5 h-5 text-white" />
                ) : (
                  <FaLink className="w-5 h-5 text-darkBlue-900" />
                )}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShareMenu;
