// app/components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black bg-opacity-75 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo.png" alt="Ecogym Logo" width={40} height={40} className="h-10 w-auto" priority />
          <span className="text-white text-xl font-bold">Ecogym</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <button 
              onClick={() => setIsProgramsOpen(!isProgramsOpen)}
              className={`text-white hover:text-turquoise transition-colors duration-300 ${isActive('/programs') ? 'text-turquoise' : ''}`}
              aria-haspopup="true"
              aria-expanded={isProgramsOpen}
            >
              Programs
            </button>
            {isProgramsOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <Link href="/programs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All Programs</Link>
                <Link href="/workouts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Workouts</Link>
                <Link href="/meditations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meditations</Link>
              </div>
            )}
          </div>
          <Link href="/dashboard" className="text-white hover:text-turquoise transition-colors duration-300">
              Dashboard
            </Link>
          <Link href="/about" className={`text-white hover:text-turquoise transition-colors duration-300 ${isActive('/about') ? 'text-turquoise' : ''}`}>
            About
          </Link>
          <form className="relative">
            <input 
              type="search" 
              placeholder="Search..." 
              className="py-1 px-3 rounded-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-turquoise"
            />
          </form>
          <Link href="/login" className={`text-white hover:text-turquoise transition-colors duration-300 ${isActive('/login') ? 'text-turquoise' : ''}`}>
            Login
          </Link>
        </nav>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-black bg-opacity-95 p-4">
          <Link href="/programs" className={`block text-white py-2 hover:text-turquoise transition-colors duration-300 ${isActive('/programs') ? 'text-turquoise' : ''}`}>
            Programs
          </Link>
          <Link href="/workouts" className={`block text-white py-2 hover:text-turquoise transition-colors duration-300 ${isActive('/workouts') ? 'text-turquoise' : ''}`}>
            Workouts
          </Link>
          <Link href="/meditations" className={`block text-white py-2 hover:text-turquoise transition-colors duration-300 ${isActive('/meditations') ? 'text-turquoise' : ''}`}>
            Meditations
          </Link>
          <Link href="/dashboard" className="text-white hover:text-turquoise transition-colors duration-300">
              Dashboard
            </Link>
          <Link href="/about" className={`block text-white py-2 hover:text-turquoise transition-colors duration-300 ${isActive('/about') ? 'text-turquoise' : ''}`}>
            About
          </Link>
          <form className="mt-2">
            <input 
              type="search" 
              placeholder="Search..." 
              className="w-full py-1 px-3 rounded-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-turquoise"
            />
          </form>
          <Link href="/login" className={`block text-white py-2 hover:text-turquoise transition-colors duration-300 ${isActive('/login') ? 'text-turquoise' : ''}`}>
            Login
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;