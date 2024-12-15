'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import ProgramList from '../../components/ProgramList';
import { Program } from '../../types';
import { fetchPrograms } from '../../utils/api';

const MindfulnessMeditationPage = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mindfulness & Meditation Programs</h1>
      <div className="mb-8">
        <p className="text-lg text-gray-600">
          Discover our collection of mindfulness and meditation programs designed to help you find peace,
          reduce stress, and enhance your mental well-being. From guided meditations to mindfulness
          exercises, our expert instructors will help you develop a stronger mind-body connection.
        </p>
      </div>
      <ProgramList 
        category="mindfulness-meditation"
        title="Featured Programs"
      />
    </div>
  );
};

export default MindfulnessMeditationPage;
