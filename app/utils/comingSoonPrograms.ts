import { Program } from '../types';

export interface ComingSoonProgram extends Program {
  exclusivePerks: {
    type: 'founder_member' | 'early_access' | 'premium_preview';
    tagline: string;
  };
  highlights: {
    icon: 'fire' | 'star' | 'clock' | 'users' | 'heart' | 'leaf' | 'gem' | 'crown';
    text: string;
  }[];
  previewVideoUrl?: string;
}

export const comingSoonPrograms: ComingSoonProgram[] = [
  {
    id: 'hiit-revolution',
    title: 'Advanced HIIT Revolution',
    description: 'Transform your fitness with our revolutionary high-intensity program.',
    thumbnail: '/images/hiit.png',
    duration: '45 mins',
    level: 'Advanced',
    category: 'Workout',
    trainer: {
      id: 'trainer-1',
      profile_picture: '/images/trainer-michael.png',
      user: {
        first_name: 'Michael',
        last_name: 'Chen'
      },
      bio: 'Elite fitness trainer specializing in HIIT',
      specialties: ['HIIT', 'Strength Training', 'Cardio']
    },
    isFree: false,
    sessions: [],
    program_type: 'multi_session_linear',
    total_sessions: 12,
    estimated_completion_days: 30,
    exclusivePerks: {
      type: 'founder_member',
      tagline: 'Join the Founders Circle'
    },
    highlights: [
      { icon: 'fire', text: 'Revolutionary Training Methods' },
      { icon: 'star', text: 'Expert-Crafted Workouts' },
      { icon: 'crown', text: 'Exclusive Member Benefits' },
      { icon: 'gem', text: 'Premium Early Access' }
    ]
  },
  {
    id: 'mindful-flow',
    title: 'Mindful Flow Yoga',
    description: 'A unique blend of traditional yoga and mindfulness practices.',
    thumbnail: '/images/med2.png',
    duration: '60 mins',
    level: 'Intermediate',
    category: 'Yoga',
    trainer: {
      id: 'trainer-2',
      profile_picture: '/images/trainer-sarah.png',
      user: {
        first_name: 'Sarah',
        last_name: 'Johnson'
      },
      bio: 'Certified yoga instructor and mindfulness coach',
      specialties: ['Yoga', 'Meditation', 'Mindfulness']
    },
    isFree: false,
    sessions: [],
    program_type: 'multi_session_flexible',
    total_sessions: 8,
    estimated_completion_days: 28,
    exclusivePerks: {
      type: 'premium_preview',
      tagline: 'Limited Preview Access'
    },
    highlights: [
      { icon: 'leaf', text: 'Holistic Wellness Journey' },
      { icon: 'heart', text: 'Mind-Body Integration' },
      { icon: 'users', text: 'Exclusive Community' },
      { icon: 'gem', text: 'Members-Only Content' }
    ]
  },
  {
    id: 'power-pilates',
    title: 'Power Pilates Plus',
    description: 'Advanced Pilates techniques for core strength and flexibility.',
    thumbnail: '/images/pilates.png',
    duration: '50 mins',
    level: 'Intermediate',
    category: 'Pilates',
    trainer: {
      id: 'trainer-3',
      profile_picture: '/images/trainer-emily.png',
      user: {
        first_name: 'Emily',
        last_name: 'Rodriguez'
      },
      bio: 'Expert Pilates instructor with 10+ years experience',
      specialties: ['Pilates', 'Core Training', 'Flexibility']
    },
    isFree: false,
    sessions: [],
    program_type: 'multi_session_linear',
    total_sessions: 10,
    estimated_completion_days: 35,
    exclusivePerks: {
      type: 'early_access',
      tagline: 'Priority Access List'
    },
    highlights: [
      { icon: 'star', text: 'Innovative Core Training' },
      { icon: 'clock', text: 'Optimized Routines' },
      { icon: 'crown', text: 'VIP Member Benefits' },
      { icon: 'heart', text: 'Personalized Journey' }
    ]
  }
];
