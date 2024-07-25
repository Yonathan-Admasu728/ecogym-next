// app/components/Thumbnails.tsx
'use client';

import { useEffect, useState } from 'react';
import ThumbnailItem from './ThumbnailItem';
import { fetchPrograms, fetchProgramsByCategory } from '../utils/api';
import { ProgramItem } from '../types/ProgramItem';

interface ThumbnailsProps {
  category: 'all' | 'workout' | 'meditation';
}

const Thumbnails: React.FC<ThumbnailsProps> = ({ category }) => {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        let programs;
        if (category === 'all') {
          programs = await fetchPrograms();
        } else {
          programs = await fetchProgramsByCategory(category);
        }
        setItems(programs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, [category]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <ThumbnailItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Thumbnails;