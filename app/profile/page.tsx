// app/profile/page.tsx

'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(false);
  }, [user, loading, router]);

  if (loading || isLoading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <UserProfile user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
