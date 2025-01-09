'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import Breadcrumb from './Breadcrumb';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { href: '/programs/mindfulness-meditation', label: 'Mindfulness & Meditation' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/blog', label: 'Blog' },
  ];

  const authenticatedMenuItems = [
    { href: '/#daily-compass', label: 'Daily Compass', requiresAuth: true },
  ];

  const allMenuItems = [
    ...menuItems,
    ...(user ? authenticatedMenuItems : []),
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="bg-[#0B1120] text-white border-b border-white/5 relative z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center group">
              <div className="relative w-10 h-10 mr-2 transform transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/ecogym-logo.png"
                  alt="EcoGym Logo"
                  fill
                  sizes="40px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-turquoise-400 to-turquoise-300 bg-clip-text text-transparent">
                EcoGym
              </span>
            </Link>
            <nav className="hidden md:block relative">
              <ul className="flex items-center space-x-8">
                {allMenuItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className={`relative py-2 px-1 group inline-block ${
                        isActive(item.href) 
                          ? 'text-turquoise-400' 
                          : 'text-gray-300 hover:text-white'
                      } transition-colors duration-300`}
                      onClick={(e) => {
                        // Ensure the link is clickable
                        e.stopPropagation();
                        if (isMenuOpen) setIsMenuOpen(false);
                      }}
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-turquoise-500 to-turquoise-300 transform origin-left transition-transform duration-300 ${
                          isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </Link>
                  </li>
                ))}
                {user ? (
                  <li>
                    <motion.div 
                      className="relative w-9 h-9"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={user.photoURL || '/images/placeholder-avatar.svg'}
                        alt="User Avatar"
                        fill
                        sizes="36px"
                        className="rounded-full cursor-pointer ring-2 ring-transparent hover:ring-turquoise-400 transition-all duration-300"
                        style={{ objectFit: 'cover' }}
                      />
                    </motion.div>
                  </li>
                ) : (
                  <li>
                    <Link 
                      href="/login" 
                      className="relative overflow-hidden px-6 py-2 rounded-full group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-turquoise-500 to-turquoise-400 transition-transform duration-300 transform group-hover:scale-105" />
                      <span className="relative text-white font-medium">Login</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <button 
              className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors duration-200" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden bg-[#0F172A]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="container mx-auto px-4 py-4">
                <ul className="space-y-4">
                  {allMenuItems.map((item) => (
                    <motion.li 
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link 
                        href={item.href} 
                        className={`block py-2 ${
                          isActive(item.href)
                            ? 'text-turquoise-400'
                            : 'text-gray-300 hover:text-white'
                        } transition-colors duration-300`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                  {!user && (
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                    >
                      <Link 
                        href="/login" 
                        className="block bg-gradient-to-r from-turquoise-500 to-turquoise-400 text-white px-4 py-2 rounded-full text-center font-medium hover:from-turquoise-600 hover:to-turquoise-500 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.li>
                  )}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <Breadcrumb />
    </>
  );
};

export default Header;
