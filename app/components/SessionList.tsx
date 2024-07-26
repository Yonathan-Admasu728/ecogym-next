// app/components/SessionList.tsx:

import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { Session } from '../types';

interface SessionListProps {
  sessions: Session[];
  onPlaySession: (session: Session) => void;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onPlaySession }) => {
  return (
    <ul className="space-y-4 mb-8">
      {sessions.map((session, index) => (
        <li key={session.id} className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Session {index + 1}: {session.title}
          </h3>
          <p className="text-gray-300">{session.description}</p>
          <button
            onClick={() => onPlaySession(session)}
            className="mt-2 bg-turquoise text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all duration-300"
          >
            <FaPlay className="inline mr-2" /> Play Session
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SessionList;