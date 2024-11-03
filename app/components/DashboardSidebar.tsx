import React from 'react';
import { FaHome, FaHeart, FaClock, FaDumbbell, FaUser, FaTimes, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeSection, setActiveSection, isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Overview', icon: FaHome, id: 'overview' },
    { name: 'Programs', icon: FaDumbbell, id: 'programs' },
    { name: 'Favorites', icon: FaHeart, id: 'favorites' },
    { name: 'Watch Later', icon: FaClock, id: 'watchLater' },
    { name: 'Progress', icon: FaChartLine, id: 'progress' },
    { name: 'Profile', icon: FaUser, id: 'profile' },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-70 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
      <aside className={`bg-darkBlue-800 text-white w-64 min-h-screen fixed left-0 top-0 z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex justify-between items-center p-4 border-b border-darkBlue-700 md:hidden">
          <h2 className="text-xl font-semibold text-white">Menu</h2>
          <button onClick={toggleSidebar} className="text-white hover:text-turquoise-400 focus:outline-none">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
                activeSection === item.id
                  ? 'bg-darkBlue-700 text-turquoise-400'
                  : 'hover:bg-darkBlue-700 text-white hover:text-turquoise-400'
              }`}
              onClick={() => {
                setActiveSection(item.id);
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
            >
              <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-turquoise-400' : 'text-white'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
