// app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import SignInModal from '../components/SignInModal';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignInSuccess = () => {
    router.push('/dashboard');
  };

  if (user) {
    return null; // or a loading indicator
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Ecogym</h1>
        <p className="text-center mb-6">Please sign in to access your dashboard</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Sign In
        </button>
      </div>
      <SignInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />
    </div>
  );
};

export default LoginPage;