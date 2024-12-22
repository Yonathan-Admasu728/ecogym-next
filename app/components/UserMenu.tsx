'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaHeart, FaClock, FaBars, FaTimes } from 'react-icons/fa';

import CollectionView from './CollectionView';
import { useAuth } from '../context/AuthContext';
import { usePrograms } from '../context/ProgramContext';
import { useProgramActions } from '../hooks/useProgramActions';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  count?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick, count }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center w-full p-4 rounded-lg bg-darkBlue-800 hover:bg-darkBlue-700 transition-colors duration-200"
    onClick={onClick}
  >
    <span className="text-turquoise-400 mr-3">{icon}</span>
    <span className="flex-grow text-left">{label}</span>
    {count !== undefined && (
      <span className="bg-turquoise-400 text-darkBlue-900 px-2 py-1 rounded-full text-sm">
        {count}
      </span>
    )}
  </motion.button>
);

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { userPrograms } = usePrograms();
  const { handleToggleFavorite, handleToggleWatchLater } = useProgramActions();
  const [activeView, setActiveView] = useState<'favorites' | 'watchLater' | null>(null);

  if (!user) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleRemove = async (programId: string) => {
    if (activeView === 'favorites') {
      await handleToggleFavorite(programId);
    } else if (activeView === 'watchLater') {
      await handleToggleWatchLater(programId);
    }
  };

  const menuItems = [
    {
      icon: <FaHeart size={20} />,
      label: 'Favorites',
      onClick: () => {
        setActiveView('favorites');
        setIsOpen(false);
      },
      count: userPrograms?.favorite_programs?.length || 0,
    },
    {
      icon: <FaClock size={20} />,
      label: 'Watch Later',
      onClick: () => {
        setActiveView('watchLater');
        setIsOpen(false);
      },
      count: userPrograms?.watch_later_programs?.length || 0,
    },
  ];

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          className="p-4 rounded-full bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-darkBlue-900 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </motion.button>
      </motion.div>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={toggleMenu}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-8 bottom-24 w-80 bg-darkBlue-900/95 backdrop-blur-sm rounded-2xl shadow-2xl z-50 p-6 border border-turquoise-400/20"
            >
              {/* User Profile Section */}
              <div className="flex items-center mb-8">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={user.photoURL || '/images/placeholder-avatar.svg'}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.displayName || 'User'}</h3>
                  <p className="text-sm text-lightBlue-100">{user.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                {menuItems.map((item, index) => (
                  <MenuItem key={index} {...item} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Collection Views */}
      <CollectionView
        isOpen={activeView === 'favorites'}
        onClose={() => setActiveView(null)}
        programs={userPrograms?.favorite_programs || []}
        type="favorites"
        onRemove={handleRemove}
      />
      <CollectionView
        isOpen={activeView === 'watchLater'}
        onClose={() => setActiveView(null)}
        programs={userPrograms?.watch_later_programs || []}
        type="watchLater"
        onRemove={handleRemove}
      />
    </>
  );
};

export default UserMenu;
