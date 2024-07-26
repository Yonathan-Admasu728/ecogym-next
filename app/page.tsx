// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import Banner from './components/Banner';
import FeaturedPrograms from './components/FeaturedPrograms';
import { usePrograms } from './context/ProgramContext';

export default function Home() {
  const { user } = useAuth();
  const { isLoading, error, fetchFeaturedPrograms, fetchUserPrograms } = usePrograms();

  useEffect(() => {
    fetchFeaturedPrograms();
    if (user) {
      fetchUserPrograms();
    }
  }, [user, fetchFeaturedPrograms, fetchUserPrograms]);

  return (
    <>
      <Banner />
      {isLoading ? (
        <div>Loading featured programs...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <FeaturedPrograms />
      )}
      {user && (
        <div className="text-center mt-8">
          <Link 
            href="/dashboard" 
            className="bg-turquoise text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-turquoise transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
           Go to Dashboard
          </Link>
        </div>
      )}
      {/* Other components */}
    </>
  );
}