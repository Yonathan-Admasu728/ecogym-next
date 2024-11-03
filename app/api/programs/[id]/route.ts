import { NextResponse } from 'next/server';
import { Program } from '../../../types';

// Simulated database of programs
const programsDatabase: Program[] = [
  {
    id: '1',
    title: 'Mindfulness Meditation',
    description: 'A 30-day program to develop mindfulness and reduce stress.',
    thumbnail: '/images/mindfulness-meditation.jpg',
    duration: '30 days',
    level: 'Beginner',
    category: 'Meditation',
    price: 49.99,
    stripe_price_id: 'price_1234567890',
    isFree: false,
    sessions: [
      { id: '1-1', title: 'Introduction to Mindfulness', duration: '15 minutes' },
      { id: '1-2', title: 'Breath Awareness', duration: '20 minutes' },
      { id: '1-3', title: 'Body Scan Meditation', duration: '25 minutes' },
    ]
  },
  {
    id: '2',
    title: 'Yoga for Beginners',
    description: 'Start your yoga journey with this 4-week introductory program.',
    thumbnail: '/images/yoga-beginners.jpg',
    duration: '28 days',
    level: 'Beginner',
    category: 'Yoga',
    price: 39.99,
    stripe_price_id: 'price_2345678901',
    isFree: false,
    sessions: [
      { id: '2-1', title: 'Basic Yoga Poses', duration: '30 minutes' },
      { id: '2-2', title: 'Sun Salutations', duration: '25 minutes' },
      { id: '2-3', title: 'Yoga for Flexibility', duration: '35 minutes' },
    ]
  },
  {
    id: '3',
    title: 'High-Intensity Interval Training',
    description: 'Boost your fitness with this intense 6-week HIIT program.',
    thumbnail: '/images/hiit-program.jpg',
    duration: '42 days',
    level: 'Advanced',
    category: 'Workout',
    price: 59.99,
    stripe_price_id: 'price_3456789012',
    isFree: false,
    sessions: [
      { id: '3-1', title: 'HIIT Basics', duration: '20 minutes' },
      { id: '3-2', title: 'Full Body HIIT', duration: '30 minutes' },
      { id: '3-3', title: 'HIIT Cardio Blast', duration: '25 minutes' },
    ]
  },
  {
    id: '4',
    title: 'Introduction to Meditation',
    description: 'A free program to get you started with meditation basics.',
    thumbnail: '/images/intro-meditation.jpg',
    duration: '7 days',
    level: 'Beginner',
    category: 'Meditation',
    isFree: true,
    sessions: [
      { id: '4-1', title: 'What is Meditation?', duration: '10 minutes' },
      { id: '4-2', title: 'Simple Breathing Techniques', duration: '15 minutes' },
      { id: '4-3', title: 'Guided Relaxation', duration: '20 minutes' },
    ]
  },
  {
    id: '5',
    title: 'Quick Home Workout',
    description: 'A free, no-equipment workout you can do at home.',
    thumbnail: '/images/home-workout.jpg',
    duration: '20 minutes',
    level: 'Intermediate',
    category: 'Workout',
    isFree: true,
    sessions: [
      { id: '5-1', title: 'Full Body Home Workout', duration: '20 minutes' },
    ]
  }
];

// Simulated API call to fetch a program by ID
const getProgramById = async (id: string): Promise<Program | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return programsDatabase.find(program => program.id === id) || null;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const program = await getProgramById(id);

  if (!program) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  return NextResponse.json(program);
}
