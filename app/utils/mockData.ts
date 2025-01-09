import { Program, Trainer } from '../types';
import { logger } from './logger';

export const mockTrainers: Record<string, Trainer> = {
  sarah: {
    id: 'trainer_sarah',
    profile_picture: '/images/trainer-sarah.png',
    user: {
      first_name: 'Sarah',
      last_name: 'Chen'
    },
    specialties: ['Mindfulness', 'Meditation', 'Stress Management'],
    bio: 'Certified mindfulness instructor with 10 years of experience in meditation and stress reduction techniques.'
  },
  michael: {
    id: 'trainer_michael',
    profile_picture: '/images/trainer-michael.png',
    user: {
      first_name: 'Michael',
      last_name: 'Brown'
    },
    specialties: ['Meditation', 'Breathwork', 'Yoga'],
    bio: 'Experienced meditation guide specializing in deep meditation and breathwork practices.'
  },
  emily: {
    id: 'trainer_emily',
    profile_picture: '/images/trainer-emily.png',
    user: {
      first_name: 'Emily',
      last_name: 'Johnson'
    },
    specialties: ['HIIT', 'Strength Training', 'Calisthenics'],
    bio: 'Professional fitness trainer with expertise in high-intensity workouts and body weight exercises.'
  }
};

export const mockPrograms: Program[] = [
  {
    id: '21-day-calisthenics',
    title: '21-Day Calisthenics Challenge',
    description: 'Transform your body using just your bodyweight with this progressive calisthenics program.',
    detailed_description: 'This comprehensive program takes you from basic movements to advanced calisthenics skills over 21 days. Each session builds upon the previous ones, gradually increasing in difficulty while maintaining proper form and technique.',
    category: 'workout',
    subcategories: ['calisthenics', 'strength', 'bodyweight'],
    duration: '21 days',
    total_sessions: 21,
    level: 'All Levels',
    trainer: mockTrainers.emily,
    thumbnail: '/images/strength.png',
    thumbnailUrl: '/images/strength.png',
    price: 49.99,
    isFree: false,
    is_free: false,
    program_type: 'multi_session_linear',
    estimated_completion_days: 21,
    average_rating: 4.8,
    review_count: 156,
    stripe_price_id: 'price_calisthenics21',
    recommended_schedule: {
      sessions_per_week: 6,
      rest_days: [0] // Sunday rest day
    },
    prerequisites: {
      fitness_level: 'No specific level required',
      equipment: ['Pull-up bar (recommended but not required)'],
      prior_experience: []
    },
    features: ['Progressive workouts', 'Form tutorials', 'Mobility work'],
    learning_outcomes: ['Master basic calisthenics', 'Build strength', 'Improve mobility'],
    community_features: {
      has_community_chat: true,
      has_trainer_qa: true,
      has_progress_sharing: true
    },
    sessions: [
      {
        id: 'day1',
        title: 'Foundations of Bodyweight Training',
        description: 'Learn the fundamental movements that will form the basis of your calisthenics journey.',
        duration: '30 minutes',
        duration_seconds: 1800,
        order: 1,
        difficulty_level: 1,
        video_url: '/videos/calisthenics/day1.mp4',
        thumbnail: '/images/calisthenics/day1.jpg',
        equipment_needed: [],
        is_preview: true,
        key_learnings: [
          'Proper push-up form',
          'Squat technique',
          'Core engagement basics'
        ]
      },
      {
        id: 'day2',
        title: 'Building Basic Strength',
        description: 'Focus on building foundational strength through basic calisthenics movements.',
        duration: '35 minutes',
        duration_seconds: 2100,
        order: 2,
        difficulty_level: 2,
        prerequisites: ['day1'],
        video_url: '/videos/calisthenics/day2.mp4',
        thumbnail: '/images/calisthenics/day2.jpg',
        equipment_needed: []
      }
    ]
  },
  {
    id: 'mindfulness-foundations',
    title: 'Mindfulness Foundations',
    description: 'A comprehensive mindfulness program to reduce stress and increase focus.',
    detailed_description: 'Perfect for beginners, this program introduces key mindfulness concepts and meditation techniques that you can practice anywhere, anytime.',
    category: 'meditation',
    subcategories: ['meditation', 'stress-reduction'],
    duration: '4 weeks',
    total_sessions: 8,
    level: 'Beginner',
    trainer: mockTrainers.sarah,
    thumbnail: '/images/med1.png',
    thumbnailUrl: '/images/med1.png',
    price: 29.99,
    isFree: false,
    is_free: false,
    program_type: 'multi_session_flexible',
    estimated_completion_days: 28,
    average_rating: 4.9,
    review_count: 234,
    stripe_price_id: 'price_mindfulness',
    recommended_schedule: {
      sessions_per_week: 2,
      rest_days: [] // Flexible schedule
    },
    features: ['Guided meditations', 'Mindfulness exercises', 'Stress reduction techniques'],
    learning_outcomes: ['Develop mindfulness practice', 'Reduce stress', 'Improve focus'],
    community_features: {
      has_community_chat: true,
      has_trainer_qa: true,
      has_progress_sharing: true
    },
    sessions: [
      {
        id: 'intro-to-mindfulness',
        title: 'Introduction to Mindfulness',
        description: 'Learn the basics of mindfulness meditation and its benefits.',
        duration: '20 minutes',
        duration_seconds: 1200,
        order: 1,
        difficulty_level: 1,
        video_url: '/videos/mindfulness/intro.mp4',
        thumbnail: '/images/mindfulness/intro.jpg',
        is_preview: true,
        key_learnings: [
          'What is mindfulness',
          'Basic breathing techniques',
          'Creating a meditation space'
        ]
      }
    ]
  },
  {
    id: 'quick-hiit',
    title: '30-Minute HIIT Blast',
    description: 'High-intensity interval training for maximum calorie burn.',
    detailed_description: 'A single intense session combining cardio and strength exercises for a full-body workout.',
    category: 'workout',
    subcategories: ['hiit', 'cardio'],
    duration: '30 minutes',
    total_sessions: 1,
    level: 'Intermediate',
    trainer: mockTrainers.emily,
    thumbnail: '/images/hiit.png',
    thumbnailUrl: '/images/hiit.png',
    price: 4.99,
    isFree: false,
    is_free: false,
    program_type: 'single_session',
    average_rating: 4.7,
    review_count: 89,
    stripe_price_id: 'price_hiit30',
    features: ['Full-body workout', 'High-intensity exercises', 'Modifications provided'],
    learning_outcomes: ['Improve cardiovascular fitness', 'Boost metabolism', 'Build endurance'],
    community_features: {
      has_community_chat: false,
      has_trainer_qa: true,
      has_progress_sharing: true
    },
    sessions: [
      {
        id: 'hiit-main',
        title: '30-Minute HIIT Blast',
        description: 'Complete full-body HIIT workout.',
        duration: '30 minutes',
        duration_seconds: 1800,
        order: 1,
        difficulty_level: 7,
        video_url: '/videos/hiit/main.mp4',
        thumbnail: '/images/hiit/main.jpg',
        equipment_needed: ['Mat (optional)'],
        key_learnings: [
          'HIIT principles',
          'Proper form for exercises',
          'Modifications for different fitness levels'
        ]
      }
    ]
  }
];

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/placeholder-avatar.svg'
};

// Log mock data initialization
logger.debug('Mock data initialized', {
  trainersCount: Object.keys(mockTrainers).length,
  programsCount: mockPrograms.length,
  programs: mockPrograms.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    is_free: p.is_free
  }))
});
