// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import PurchasedPrograms from '../components/PurchasedPrograms';
import Favorites from '../components/Favorites';
import WatchLater from '../components/WatchLater';
import FeaturedPrograms from '../components/FeaturedPrograms';
import { fetchUserPrograms, fetchFeaturedPrograms } from '../utils/api';
import { Program } from '../types';
import { FaClock, FaShoppingCart, FaHeart, FaClock as FaWatchLater, FaUser } from 'react-icons/fa';

const DashboardPage = () => {
  const { user, loading, getIdToken } = useAuth();
  const router = useRouter();
  const [userPrograms, setUserPrograms] = useState<{
    purchased_programs: Program[];
    favorite_programs: Program[];
    watch_later_programs: Program[];
  } | null>(null);
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = await getIdToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        const userProgramsData = await fetchUserPrograms(token, getIdToken);
        setUserPrograms(userProgramsData);

        const featuredProgramsData = await fetchFeaturedPrograms();
        setFeaturedPrograms(featuredProgramsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, loading, router, getIdToken]);

  if (loading) return <div>Loading auth state...</div>;
  if (!user) return null;
  if (isLoading) return <div>Loading dashboard data...</div>;
  if (error) return <div>{error}</div>;
  if (!userPrograms) return <div>No user programs found.</div>;

  // Extract first name from user's display name
  const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Links */}
      <nav className="flex justify-around mb-8 bg-gray-900 p-4 rounded-lg shadow-md">
        <a href="#purchased" className="flex flex-col items-center text-turquoise hover:text-white transition duration-300">
          <FaShoppingCart className="mr-2 text-green-500" />
          <span className="mt-1 text-sm">Purchased</span>
        </a>
        <a href="#favorites" className="flex flex-col items-center text-turquoise hover:text-white transition duration-300">
          <FaHeart className="text-2xl" />
          <span className="mt-1 text-sm">Favorites</span>
        </a>
        <a href="#watchlater" className="flex flex-col items-center text-turquoise hover:text-white transition duration-300">
          <FaWatchLater className="text-2xl" />
          <span className="mt-1 text-sm">Watch Later</span>
        </a>
        <a href="/profile" className="flex flex-col items-center text-turquoise hover:text-white transition duration-300">
          <FaUser className="text-2xl" />
          <span className="mt-1 text-sm">Profile</span>
        </a>
      </nav>

      {/* Welcome Message */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-turquoise">Welcome back, <span className="text-purple-500">{firstName}</span>!</h1>
      </div>

      {/* Featured Programs Carousel */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Programs</h2>
        <FeaturedPrograms purchasedPrograms={userPrograms.purchased_programs} />
      </div>

      {/* User's Purchased Programs */}
      <div id="purchased" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Programs You Own</h2>
        <PurchasedPrograms programs={userPrograms.purchased_programs} />
      </div>

      {/* User's Favorite Programs */}
      <div id="favorites" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
        <Favorites programs={userPrograms.favorite_programs} />
      </div>

      {/* Watch Later Programs */}
      <div id="watchlater">
        <h2 className="text-2xl font-bold mb-4">Watch Later</h2>
        <WatchLater programs={userPrograms.watch_later_programs} />
      </div>
    </div>
  );
};

export default DashboardPage;
