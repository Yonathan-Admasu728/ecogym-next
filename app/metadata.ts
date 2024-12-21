import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoGym - Premium Fitness & Wellness Platform',
  description: 'Access cutting-edge home workouts, mindfulness practices, and guided meditations. Join EcoGym for both free and premium fitness and wellness content.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'EcoGym',
    title: 'EcoGym - Premium Fitness & Wellness Platform',
    description: 'Access cutting-edge home workouts, mindfulness practices, and guided meditations. Join EcoGym for both free and premium fitness and wellness content.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoGym - Premium Fitness & Wellness Platform',
    description: 'Access cutting-edge home workouts, mindfulness practices, and guided meditations. Join EcoGym for both free and premium fitness and wellness content.',
  },
};
