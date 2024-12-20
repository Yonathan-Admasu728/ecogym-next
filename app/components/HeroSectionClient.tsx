'use client';

import React from 'react';

import SearchBar from './SearchBar';

interface HeroSectionClientProps {
  onSearch: (query: string) => void;
}

const HeroSectionClient: React.FC<HeroSectionClientProps> = ({ onSearch }) => {
  return (
    <div className="mb-10">
      <SearchBar onSearch={onSearch} />
    </div>
  );
};

export default HeroSectionClient;