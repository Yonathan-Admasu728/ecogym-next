// app/components/InstructorModal.tsx

import React from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { Program } from "../types";

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Program["trainer"];
}

const InstructorModal: React.FC<InstructorModalProps> = ({
  isOpen,
  onClose,
  trainer,
}) => (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="mx-auto max-w-sm rounded bg-gray-800 p-6 text-white">
        <Dialog.Title className="text-lg font-medium leading-6 text-white">
          {trainer.user.first_name} {trainer.user.last_name}
        </Dialog.Title>
        <div className="mt-2">
          <Image
            src={trainer.profile_picture || "/placeholder-avatar.jpg"}
            alt={`${trainer.user.first_name} ${trainer.user.last_name}`}
            width={100}
            height={100}
            className="rounded-full mx-auto mb-4"
          />
          <p className="text-sm text-gray-300">{trainer.bio}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-turquoise px-4 py-2 text-sm font-medium text-white hover:bg-turquoise-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise-light focus-visible:ring-offset-2"
        >
          Close
        </button>
      </Dialog.Panel>
    </div>
  </Dialog>
);

export default InstructorModal;