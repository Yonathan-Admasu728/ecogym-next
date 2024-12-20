// app/components/InstructorModal.tsx

import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { Fragment } from "react";
import { FaTimes } from "react-icons/fa";

import { Trainer } from "../types";

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Trainer;
}

const InstructorModal: React.FC<InstructorModalProps> = ({
  isOpen,
  onClose,
  trainer,
}) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-75" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-2xl font-bold leading-6 text-turquoise mb-4"
              >
                {trainer.user?.first_name || 'Unknown'} {trainer.user?.last_name || ''}
              </Dialog.Title>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={trainer.profile_picture || "/placeholder-avatar.jpg"}
                  alt={`${trainer.user?.first_name || 'Unknown'} ${trainer.user?.last_name || ''}`}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-6 border-4 border-turquoise"
                />
                <p className="text-md text-gray-300 mb-6">{trainer.bio}</p>
                {trainer.specialties && trainer.specialties.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-turquoise mb-2">Specialties</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {trainer.specialties.map((specialty: string, index: number) => (
                        <li key={index}>{specialty}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="inline-flex justify-center rounded-full border border-transparent bg-turquoise px-4 py-2 text-sm font-medium text-white hover:bg-turquoise-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise-light focus-visible:ring-offset-2 transition-colors duration-200"
                >
                  Close
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-6 w-6" />
              </motion.button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default InstructorModal;
