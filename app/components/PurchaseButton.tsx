'use client';

import React from 'react';
import { FaSpinner, FaLock, FaCheckCircle, FaUserCircle, FaPlay } from 'react-icons/fa';

import { Program } from '../types';
import { getFreeSessionCount } from '../types/program';

interface PurchaseButtonProps {
  program: Program;
  isPurchased: boolean;
  onPurchase: () => void;
  isAuthenticated: boolean;
  isProcessing?: boolean;
}

const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  program,
  isPurchased,
  onPurchase,
  isAuthenticated,
  isProcessing = false,
}) => {
  const getButtonContent = () => {
    // Not authenticated
    if (!isAuthenticated) {
      return (
        <>
          <FaUserCircle className="h-5 w-5 mr-2" />
          <span>Sign in to {program.isFree ? 'Start' : 'Purchase'}</span>
        </>
      );
    }

    // Processing state
    if (isProcessing) {
      return (
        <>
          <FaSpinner className="h-5 w-5 animate-spin mr-2" />
          <span>Processing...</span>
        </>
      );
    }

    // Already purchased
    if (isPurchased) {
      return (
        <>
          <FaCheckCircle className="h-5 w-5 mr-2" />
          <span>Continue Program</span>
        </>
      );
    }

    // Completely free program
    if (program.isFree) {
      return (
        <>
          <FaPlay className="h-5 w-5 mr-2" />
          <span>Start Free Program</span>
        </>
      );
    }

    // Has free sessions
    const freeCount = getFreeSessionCount(program);
    if (freeCount > 0) {
      const icon = program.program_type === 'single_session' ? FaPlay : FaCheckCircle;
      const Icon = icon;
      return (
        <>
          <Icon className="h-5 w-5 mr-2" />
          <span>
            {program.program_type === 'single_session' 
              ? 'Start Free Session'
              : `Start (${freeCount} Free Sessions)`}
          </span>
        </>
      );
    }

    // Paid program
    return (
      <>
        <FaLock className="h-5 w-5 mr-2" />
        <span>Purchase for ${program.price}</span>
      </>
    );
  };

  return (
    <button
      onClick={onPurchase}
      disabled={isProcessing || (isPurchased && !program.isFree)}
      aria-busy={isProcessing}
      aria-label={
        isProcessing 
          ? 'Processing purchase' 
          : isPurchased 
          ? 'Already purchased' 
          : isAuthenticated 
          ? `Purchase ${program.title} for $${program.price}${program.isFree ? ' (Free)' : ''}`
          : 'Sign in to purchase'
      }
      className={`
        w-full px-6 py-4 rounded-xl font-semibold 
        flex items-center justify-center
        transition-all duration-300 transform
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darkBlue-900
        ${
          program.isFree || getFreeSessionCount(program) > 0
            ? 'bg-gradient-to-r from-green-500 to-green-400 text-white hover:from-green-400 hover:to-green-300'
            : isPurchased
            ? 'bg-gradient-to-r from-green-500 to-green-400 text-white cursor-default'
            : isProcessing
            ? 'bg-gradient-to-r from-turquoise-400 to-turquoise-300 text-darkBlue-900 cursor-wait'
            : 'bg-gradient-to-r from-turquoise-500 to-turquoise-400 hover:from-turquoise-400 hover:to-turquoise-300 text-darkBlue-900 hover:-translate-y-0.5 active:translate-y-0'
        }
        ${!isAuthenticated && !program.isFree && getFreeSessionCount(program) === 0 && 'hover:bg-turquoise-400'}
        disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none
        shadow-lg hover:shadow-xl
      `}
    >
      {getButtonContent()}
    </button>
  );
};

export default PurchaseButton;
