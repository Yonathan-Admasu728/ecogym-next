// app/components/UserProfile.tsx

import React from 'react';
import { User } from '../types';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="user-profile">
      <h1>{user.displayName}</h1>
      <p>Email: {user.email}</p>
      <p>Account Created: {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
      <p>Last Login: {new Date(user.metadata.lastLoginTime).toLocaleDateString()}</p>
      {/* Render other user details as needed */}
    </div>
  );
};

export default UserProfile;
