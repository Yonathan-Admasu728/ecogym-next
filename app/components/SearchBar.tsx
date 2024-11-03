import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full px-6 py-4 rounded-full border-2 border-lightBlue-200 focus:outline-none focus:border-turquoise-400 focus:ring-2 focus:ring-turquoise-400 focus:ring-opacity-50 bg-white bg-opacity-20 backdrop-filter backdrop-blur-md text-white placeholder-lightBlue-100 text-base sm:text-lg transition duration-300 ease-in-out"
          placeholder="Search for mindfulness programs, workouts, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-turquoise-500 text-white rounded-full p-3 hover:bg-turquoise-600 focus:outline-none transition duration-300 ease-in-out shadow-glow hover:shadow-lg hover:scale-105"
          aria-label="Search"
        >
          <FaSearch className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;