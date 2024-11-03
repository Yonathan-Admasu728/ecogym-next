'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { DashboardSidebar, PurchasedPrograms, Favorites, WatchLater, FeaturedPrograms, RecommendedPrograms } from '../components';
import { usePrograms } from '../context/ProgramContext';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { 
    userPrograms, 
    featuredPrograms,
    isLoading, 
    error, 
    fetchUserPrograms, 
    fetchFeaturedPrograms 
  } = usePrograms();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchUserPrograms();
    fetchFeaturedPrograms();
  }, [user, authLoading, router, fetchUserPrograms, fetchFeaturedPrograms]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RecommendedPrograms />
            </motion.div>
            <motion.div 
              className="mt-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise-400"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-8 bg-darkBlue-800 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2">Error</h3>
                  <p>{error}</p>
                </div>
              ) : (
                <FeaturedPrograms programs={featuredPrograms} />
              )}
            </motion.div>
          </>
        );
      case 'favorites':
        return (
          <motion.div 
            className="card bg-darkBlue-800 rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Your Favorites</h2>
            <Favorites programs={userPrograms?.favorite_programs || []} />
          </motion.div>
        );
      case 'watchLater':
        return (
          <motion.div 
            className="card bg-darkBlue-800 rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Watch Later</h2>
            <WatchLater programs={userPrograms?.watch_later_programs || []} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-darkBlue-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-turquoise-400"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-darkBlue-900 to-darkBlue-800">
      <div className="flex flex-1">
        <DashboardSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
