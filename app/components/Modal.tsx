// app/components/Modal.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { PaymentService } from '../services/PaymentService';
import type { Program } from '../types';
import SignInModal from './SignInModal';
import { logger } from '../utils/logger';

interface ModalProps {
  item: Program;
  onClose: () => void;
}

const DEFAULT_PROFILE_IMAGE = '/images/placeholder-avatar.svg';
const DEFAULT_THUMBNAIL_IMAGE = '/images/placeholder-program.svg';

const Modal: React.FC<ModalProps> = ({ item, onClose }): JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect((): void => {
    setVisible(true);
  }, []);

  const handleClose = (): void => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleWatch = async (): Promise<void> => {
    if (!user) {
      setIsSignInModalOpen(true);
      return;
    }

    try {
      const purchaseStatus = await PaymentService.checkPurchaseStatus(item.id);
      if (purchaseStatus.isPurchased) {
        router.push(`/programs/${item.id}/sessions/access`);
      } else {
        router.push(`/programs/${item.id}`);
      }
    } catch (error) {
      logger.error('Failed to check program purchase status', {
        error,
        programId: item.id,
        userId: user.uid
      });
      
      // Redirect to program detail page on error
      router.push(`/programs/${item.id}`);
    }
  };

  const handleSignInSuccess = (): void => {
    setIsSignInModalOpen(false);
    router.push(`/programs/${item.id}/sessions/access`);
  };

  const getTrainerName = (): string => {
    const firstName = item.trainer?.user?.first_name ?? 'Unknown';
    const lastName = item.trainer?.user?.last_name ?? '';
    return `${firstName} ${lastName}`.trim();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className={`bg-white rounded-lg overflow-hidden w-11/12 md:w-3/4 lg:w-1/2 transform transition-transform duration-300 ${
            visible ? 'scale-100' : 'scale-90'
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <button 
              onClick={handleClose} 
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <div className="p-4">
            <Image 
              src={item.thumbnailUrl || DEFAULT_THUMBNAIL_IMAGE} 
              alt={item.title} 
              width={500} 
              height={300} 
              className="w-full h-48 object-cover rounded-t" 
            />
            <p className="mt-4">{item.description}</p>
            <h3 className="mt-6 text-xl font-bold text-turquoise">Trainer</h3>
            {item.trainer && (
              <div className="flex items-center mt-2 space-x-4">
                <Image 
                  src={item.trainer.profile_picture ?? DEFAULT_PROFILE_IMAGE} 
                  alt={getTrainerName()} 
                  width={64} 
                  height={64} 
                  className="w-16 h-16 rounded-full object-cover shadow-md" 
                />
                <div>
                  <p className="text-sm font-bold text-turquoise">
                    {getTrainerName()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.trainer.bio ?? 'No bio available'}
                  </p>
                </div>
              </div>
            )}
            <button 
              onClick={() => void handleWatch()} 
              className="mt-4 inline-block px-4 py-2 bg-turquoise text-white rounded hover:bg-turquoise-600 transition-colors"
            >
              Watch
            </button>
          </div>
        </div>
      </div>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />
    </>
  );
};

export default Modal;
