'use client';

import React, { useEffect, useState } from 'react';

import { User, Program } from '../types';
import axiosInstance from '../utils/axiosConfig';
import { logger } from '../utils/logger';
import PurchasedPrograms from './PurchasedPrograms';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }): JSX.Element => {
  const [purchasedPrograms, setPurchasedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPrograms = async () => {
      try {
        const response = await axiosInstance.get('/api/user/programs');
        setPurchasedPrograms(response.data.purchased_programs || []);
      } catch (error) {
        logger.error('Failed to fetch user programs:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchUserPrograms();
  }, []);

  const formatDate = (timestamp: string | undefined): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-900 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{user.displayName || 'Anonymous User'}</h1>
        <p className="text-gray-300">Email: {user.email || 'No email provided'}</p>
        <p className="text-gray-300">Account Created: {formatDate(user.metadata?.creationTime)}</p>
        <p className="text-gray-300">Last Login: {formatDate(user.metadata?.lastSignInTime)}</p>
      </div>

      {loading ? (
        <div className="text-center">Loading your programs...</div>
      ) : (
        <PurchasedPrograms programs={purchasedPrograms} />
      )}
    </div>
  );
};

export default UserProfile;
