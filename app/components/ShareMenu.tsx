// app/components/ShareMenu.tsx

import React from 'react';
import { FaCopy } from 'react-icons/fa';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, FacebookIcon, TwitterIcon, EmailIcon } from "react-share";
import { toast } from 'react-toastify';

interface ShareMenuProps {
  shareUrl: string;
  shareTitle: string;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ shareUrl, shareTitle }) => {
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
  );
};

export default ShareMenu;