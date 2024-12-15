'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProgramDetail from '../../components/ProgramDetail';
import { Program } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ProgramPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`/api/programs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch program');
        }
        const data = await response.json();
        setProgram(data);
      } catch (error) {
        console.error('Error fetching program:', error);
        setError('Failed to load program. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white">Program not found</div>
      </div>
    );
  }

  return (
    <ProgramDetail
      program={program}
      onBack={() => router.back()}
      onEnroll={() => router.push(`/purchase/${program.id}`)}
      isAuthenticated={!!user}
    />
  );
};

export default ProgramPage;
