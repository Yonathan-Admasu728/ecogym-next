// app/components/UserProfile.tsx

import React from 'react';

import { User } from '../types';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }): JSX.Element => {
  const formatDate = (timestamp: string | undefined): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="user-profile">
      <h1>{user.displayName || 'Anonymous User'}</h1>
      <p>Email: {user.email || 'No email provided'}</p>
      <p>Account Created: {formatDate(user.metadata?.creationTime)}</p>
      <p>Last Login: {formatDate(user.metadata?.lastSignInTime)}</p>
      {/* Render other user details as needed */}
    </div>
  );
};

export default UserProfile;
