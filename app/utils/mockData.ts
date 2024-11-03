import { Program } from '../types';

export const mockPrograms: Program[] = [
  {
    id: '1',
    title: 'Mindful Meditation',
    description: 'A beginner-friendly meditation program to reduce stress and improve focus.',
    thumbnail: '/images/med1.png',
    duration: '30 minutes',
    level: 'Beginner',
    category: 'Meditation',
    isFree: true,
    trainer: {
      profile_picture: '/images/trainer-sarah.png',
      user: {
        first_name: 'Sarah',
        last_name: 'Johnson'
      }
    },
    sessions: [
      { id: '1-1', title: 'Introduction to Mindfulness', duration: '10 minutes' },
      { id: '1-2', title: 'Breath Awareness', duration: '10 minutes' },
      { id: '1-3', title: 'Body Scan', duration: '10 minutes' },
    ],
  },
  {
    id: '2',
    title: 'High-Intensity Interval Training',
    description: 'An advanced HIIT workout to boost metabolism and burn fat.',
    thumbnail: '/images/hiit.png',
    duration: '45 minutes',
    level: 'Advanced',
    category: 'Workout',
    isFree: false,
    price: 9.99,
    stripe_price_id: 'price_HIIT001',
    trainer: {
      profile_picture: '/images/trainer-michael.png',
      user: {
        first_name: 'Michael',
        last_name: 'Chen'
      }
    },
    sessions: [
      { id: '2-1', title: 'Warm-up', duration: '5 minutes' },
      { id: '2-2', title: 'HIIT Circuit', duration: '30 minutes' },
      { id: '2-3', title: 'Cool-down', duration: '10 minutes' },
    ],
  },
  {
    id: '3',
    title: 'Yoga for Beginners',
    description: 'A gentle introduction to yoga poses and breathing techniques.',
    thumbnail: '/images/pilates.png',
    duration: '60 minutes',
    level: 'Beginner',
    category: 'Yoga',
    isFree: true,
    trainer: {
      profile_picture: '/images/trainer-emily.png',
      user: {
        first_name: 'Emily',
        last_name: 'Rodriguez'
      }
    },
    sessions: [
      { id: '3-1', title: 'Introduction to Yoga', duration: '10 minutes' },
      { id: '3-2', title: 'Basic Poses', duration: '40 minutes' },
      { id: '3-3', title: 'Relaxation', duration: '10 minutes' },
    ],
  },
];
