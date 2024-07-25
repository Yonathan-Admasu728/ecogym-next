// app/components/Modal.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import SignInModal from './SignInModal';
import { PaymentService } from '../services/PaymentService';

interface Trainer {
  user: {
    first_name: string;
    last_name: string;
  };
  profile_picture?: string;
  bio: string;
}

interface ProgramItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  trainer: Trainer;
}

interface ModalProps {
  item: ProgramItem;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleWatch = async () => {
    if (!user) {
      console.log('User not authenticated, opening sign-in modal');
      setIsSignInModalOpen(true);
    } else {
      console.log('User authenticated, checking purchase status');
      try {
        const purchaseStatus = await PaymentService.checkPurchaseStatus(Number(item.id));
        if (purchaseStatus.purchased) {
          console.log('Program purchased, navigating to session access');
          router.push(`/programs/${item.id}/sessions/access`);
        } else {
          console.log('Program not purchased, navigating to program detail page');
          router.push(`/programs/${item.id}`);
        }
      } catch (error) {
        console.error('Error checking purchase status:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
    router.push(`/programs/${item.id}/sessions/access`);
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white rounded-lg overflow-hidden w-11/12 md:w-3/4 lg:w-1/2 transform transition-transform duration-300 ${visible ? 'scale-100' : 'scale-90'}`}>
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <button onClick={handleClose} className="text-gray-600">&times;</button>
          </div>
          <div className="p-4">
            <Image 
              src={item.thumbnailUrl || '/images/placeholder.png'} 
              alt={item.title} 
              width={500} 
              height={300} 
              className="w-full h-48 object-cover rounded-t" 
            />
            <p className="mt-4">{item.description}</p>
            <h3 className="mt-6 text-xl font-bold text-turquoise">Trainer</h3>
            <div className="flex items-center mt-2 space-x-4">
              <Image 
                src={item.trainer.profile_picture || '/images/placeholder.png'} 
                alt={`${item.trainer.user.first_name} ${item.trainer.user.last_name}`} 
                width={64} 
                height={64} 
                className="w-16 h-16 rounded-full object-cover shadow-md" 
              />
              <div>
                <p className="text-sm font-bold text-turquoise">{`${item.trainer.user.first_name} ${item.trainer.user.last_name}`}</p>
                <p className="text-sm text-gray-500">{item.trainer.bio}</p>
              </div>
            </div>
            <button onClick={handleWatch} className="mt-4 inline-block px-4 py-2 bg-turquoise text-white rounded">
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