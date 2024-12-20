'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

import PlaceholderAvatar from '../../public/images/placeholder-avatar.svg';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { href: '/programs/mindfulness-meditation', label: 'Mindfulness & Meditation' },
    { href: '/programs/workouts', label: 'Workouts' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="bg-darkBlue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <Image
                src="/images/ecogym-logo.png"
                alt="EcoGym Logo"
                fill
                sizes="40px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <span className="text-2xl font-bold text-turquoise-400">EcoGym</span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white hover:text-turquoise-400 transition duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <li>
                  <Link href="/dashboard" className="flex items-center">
                    <div className="relative w-8 h-8 mr-2">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="User Avatar"
                          fill
                          sizes="32px"
                          className="rounded-full"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <PlaceholderAvatar className="rounded-full w-full h-full" />
                      )}
                    </div>
                    <span className="text-white hover:text-turquoise-400 transition duration-300">
                      {user.displayName || 'Dashboard'}
                    </span>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link href="/login" className="bg-turquoise-500 text-white px-4 py-2 rounded-full hover:bg-turquoise-600 transition duration-300">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-darkBlue-800">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block text-white hover:text-turquoise-400 transition duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <li>
                  <Link href="/dashboard" className="flex items-center">
                    <div className="relative w-8 h-8 mr-2">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="User Avatar"
                          fill
                          sizes="32px"
                          className="rounded-full"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <PlaceholderAvatar className="rounded-full w-full h-full" />
                      )}
                    </div>
                    <span className="text-white hover:text-turquoise-400 transition duration-300">
                      {user.displayName || 'Dashboard'}
                    </span>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link href="/login" className="block bg-turquoise-500 text-white px-4 py-2 rounded-full hover:bg-turquoise-600 transition duration-300 text-center">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
