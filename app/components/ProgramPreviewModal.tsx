// This component has been deprecated in favor of direct routing to the program page.
// The file is kept temporarily for reference but should be removed in the next cleanup.

import React from 'react';

import { Program } from '../types';

interface ProgramPreviewModalProps {
  program: Program;
  onClose: () => void;
  onExplore: () => void;
}

const ProgramPreviewModal: React.FC<ProgramPreviewModalProps> = () => {
  return null;
};

export default ProgramPreviewModal;
