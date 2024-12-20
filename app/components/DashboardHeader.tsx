import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaBell, FaBars, FaLeaf } from 'react-icons/fa';

import { User } from '../types';

interface DashboardHeaderProps {
  user: User | null;
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, toggleSidebar }) => {
  return (
    <header className="bg-gradient-to-r from-green-50 to-blue-50 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="mr-4 text-green-600 hover:text-green-800 focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <FaBars className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-center">
            <Image
              src="/images/ecogym-logo.png"
              alt="EcoGym Logo"
              width={48}
              height={48}
              className="mr-3"
            />
            <span className="text-2xl font-bold text-green-800">EcoGym</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-green-600 hover:text-green-800 focus:outline-none relative">
            <FaBell className="h-6 w-6" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </button>
          <div className="relative group">
            <button className="flex items-center focus:outline-none" id="user-menu" aria-haspopup="true">
              <Image
                className="h-10 w-10 rounded-full border-2 border-green-500"
                src={user?.photoURL || "/images/placeholder-avatar.svg"}
                alt=""
                width={40}
                height={40}
              />
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-green-800 hidden sm:inline-block">{user?.displayName || user?.email || 'User'}</span>
              <FaLeaf className="ml-2 h-4 w-4 text-green-500" />
            </button>
            {/* Add dropdown menu here if needed */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;