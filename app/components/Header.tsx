'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import PlaceholderAvatar from '../../public/images/placeholder-avatar.svg';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { href: '/programs/meditation', label: 'Meditation' },
    { href: '/programs/mindfulness', label: 'Mindfulness' },
    { href: '/programs/workouts', label: 'Workouts' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="bg-darkBlue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/ecogym-logo.png" alt="EcoGym Logo" width={40} height={40} className="mr-2" />
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
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                      />
                    ) : (
                      <PlaceholderAvatar width={32} height={32} className="rounded-full mr-2" />
                    )}
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
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                      />
                    ) : (
                      <PlaceholderAvatar width={32} height={32} className="rounded-full mr-2" />
                    )}
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