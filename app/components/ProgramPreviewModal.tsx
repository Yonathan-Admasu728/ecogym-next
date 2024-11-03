import React from 'react';
import { Program } from '../types';
import { FaTimes, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PurchaseStatus from './PurchaseStatus';

interface ProgramPreviewModalProps {
  program: Program;
  onClose: () => void;
  onExplore: () => void;
}

const ProgramPreviewModal: React.FC<ProgramPreviewModalProps> = ({ program, onClose, onExplore }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-darkBlue-800 rounded-lg p-6 max-w-2xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{program.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="mb-4">
          <img src={program.thumbnail} alt={program.title} className="w-full h-48 object-cover rounded-lg" />
        </div>
        <p className="text-lightBlue-100 mb-4">{program.description}</p>
        <PurchaseStatus programId={program.id} />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onExplore}
            className="btn-primary flex items-center justify-center px-6 py-2 rounded-full bg-turquoise-500 text-darkBlue-900 hover:bg-turquoise-400 transition-all duration-300"
          >
            <FaPlay className="mr-2" /> Explore Program
          </button>
          <span className="text-lightBlue-100">{program.duration} | {program.level}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgramPreviewModal;
