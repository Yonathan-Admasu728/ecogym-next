'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaClock, FaSignal, FaYinYang, FaDumbbell, FaBrain } from 'react-icons/fa';
import ProgramPurchase from '../../components/ProgramPurchase';
import PurchaseStatus from '../../components/PurchaseStatus';
import { Program } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ProgramDetail = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
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

  const getProgramIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'meditation':
        return <FaYinYang className="text-turquoise-400" />;
      case 'workout':
        return <FaDumbbell className="text-turquoise-400" />;
      case 'mindfulness':
        return <FaBrain className="text-turquoise-400" />;
      default:
        return null;
    }
  };

  const handlePurchaseStatusChange = (purchased: boolean) => {
    setIsPurchased(purchased);
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!program) return <div className="flex justify-center items-center h-screen">Program not found</div>;

  return (
    <div className="bg-darkBlue-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-turquoise-400 hover:text-turquoise-300 transition-colors duration-300 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Featured Programs
        </button>
        <div className="bg-darkBlue-800 rounded-xl shadow-lg overflow-hidden">
          <div className="relative pt-[56.25%]">
            <Image
              src={program.thumbnail || "/images/placeholder-program.svg"}
              alt={program.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              {getProgramIcon(program.category)}
              <h1 className="text-3xl font-bold ml-2">{program.title}</h1>
            </div>
            <p className="text-lightBlue-100 mb-6">{program.description}</p>
            <div className="flex justify-between items-center text-sm text-lightBlue-200 mb-6">
              <div className="flex items-center">
                <FaClock className="mr-1 text-turquoise-400" />
                <span>{program.duration}</span>
              </div>
              <div className="flex items-center">
                <FaSignal className="mr-1 text-turquoise-400" />
                <span>{program.level}</span>
              </div>
            </div>
            {user && (
              <div className="mb-6">
                <PurchaseStatus programId={program.id} onPurchaseStatusChange={handlePurchaseStatusChange} />
              </div>
            )}
            {user && !isPurchased && program.price !== undefined && program.stripe_price_id && (
              <ProgramPurchase
                programId={program.id}
                price={program.price}
                title={program.title}
                stripePriceId={program.stripe_price_id}
              />
            )}
            {!user && (
              <div className="bg-turquoise-500 text-darkBlue-900 p-4 rounded-lg">
                <p className="font-bold mb-2">Sign in to purchase this program</p>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-darkBlue-900 text-white px-4 py-2 rounded hover:bg-darkBlue-800 transition-colors duration-300"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
