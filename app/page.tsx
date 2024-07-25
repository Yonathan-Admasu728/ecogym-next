// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import Banner from './components/Banner';
import FeaturedPrograms from './components/FeaturedPrograms';
import { fetchFeaturedPrograms, fetchUserPrograms } from './utils/api';
import { Program } from './types';

export default function Home() {
  const { user, getIdToken } = useAuth();
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [purchasedPrograms, setPurchasedPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setIsLoading(true);
        const programs = await fetchFeaturedPrograms();
        setFeaturedPrograms(programs);

        if (user) {
          const token = await getIdToken();
          if (token) {
            const userProgramsData = await fetchUserPrograms(token, getIdToken);
            setPurchasedPrograms(userProgramsData.purchased_programs);
          } else {
            console.warn('Failed to retrieve authentication token.');
          }
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, [user, getIdToken]);

  return (
    <>
      <Banner />
      {isLoading ? (
        <div>Loading featured programs...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <FeaturedPrograms purchasedPrograms={purchasedPrograms} />
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
