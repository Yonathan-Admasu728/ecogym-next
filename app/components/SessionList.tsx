import React from 'react';
import Image from 'next/image';
import { Session } from '../types';
import { FaPlay, FaLock, FaClock, FaChevronRight } from 'react-icons/fa';

interface SessionListProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
  isAuthenticated: boolean;
  isPurchased: boolean;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onSessionClick,
  isAuthenticated,
  isPurchased,
}) => {
  // Grid view for larger screens
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => onSessionClick(session)}
        >
          <div className="relative aspect-video">
            <Image
              src={session.thumbnail || '/images/placeholder-program.svg'}
              alt={session.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform hover:scale-105"
            />
            {(!isAuthenticated || !isPurchased) && !session.is_preview && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <FaLock className="text-white text-2xl" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              {session.title}
            </h3>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <FaClock className="mr-1" />
                {session.duration}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${session.difficulty_level <= 3 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  session.difficulty_level <= 7 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
              >
                {session.difficulty_level <= 3 ? 'Newbie' :
                 session.difficulty_level <= 7 ? 'Medium' : 'Advanced'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // List view for mobile
  const ListView = () => (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer flex"
          onClick={() => onSessionClick(session)}
        >
          <div className="relative w-32 h-24">
            <Image
              src={session.thumbnail || '/images/placeholder-program.svg'}
              alt={session.title}
              layout="fill"
              objectFit="cover"
            />
            {(!isAuthenticated || !isPurchased) && !session.is_preview && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <FaLock className="text-white text-lg" />
              </div>
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {session.title}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <FaClock className="mr-1" />
                  {session.duration}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${session.difficulty_level <= 3 ? 'bg-green-100 text-green-800' :
                  session.difficulty_level <= 7 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}
              >
                {session.difficulty_level <= 3 ? 'Newbie' :
                 session.difficulty_level <= 7 ? 'Medium' : 'Advanced'}
              </span>
              {(!isAuthenticated || !isPurchased) && !session.is_preview ? (
                <FaLock className="text-gray-400" />
              ) : (
                <FaChevronRight className="text-gray-400" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Session count */}
      <div className="text-lg font-semibold text-gray-900 dark:text-white">
        {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'}
      </div>

      {/* Responsive layout */}
      <div className="hidden md:block">
        <GridView />
      </div>
      <div className="md:hidden">
        <ListView />
      </div>
    </div>
  );
};

export default SessionList;
