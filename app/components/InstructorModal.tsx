// app/components/InstructorModal.tsx

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogTitle, DialogPanel } from '@headlessui/react';
import { Program } from '../types';

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Program['trainer'];
}

export const InstructorModal: React.FC<InstructorModalProps> = ({ isOpen, onClose, trainer }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-sm rounded bg-white p-6">
          <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
            {trainer.user.first_name} {trainer.user.last_name}
          </DialogTitle>
          <div className="mt-2">
            <Image
              src={trainer.profile_picture || '/placeholder-avatar.jpg'}
              alt={`${trainer.user.first_name} ${trainer.user.last_name}`}
              width={100}
              height={100}
              className="rounded-full mx-auto mb-4"
            />
            <p className="text-sm text-gray-500">{trainer.bio}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-turquoise px-4 py-2 text-sm font-medium text-white hover:bg-turquoise-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise-light focus-visible:ring-offset-2"
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};