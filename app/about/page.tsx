// app/about/page.tsx
import { Metadata } from 'next';
import Head from 'next/head';

import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About Ecogym | Holistic Fitness and Meditation Platform',
  description: 'Discover Ecogym, your all-in-one platform for expert-led workouts and guided meditations. Elevate your physical and mental wellbeing with our personalized approach to holistic fitness.',
  openGraph: {
    title: 'About Ecogym | Holistic Fitness and Meditation Platform',
    description: 'Discover Ecogym, your all-in-one platform for expert-led workouts and guided meditations. Elevate your physical and mental wellbeing with our personalized approach to holistic fitness.',
    url: 'https://ecogym.space/about',
    images: [
      {
        url: '/images/about-hero.jpg', // Local image
        width: 1200,
        height: 630,
        alt: 'Ecogym - Holistic Fitness and Meditation',
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ecogym",
  "description": "Ecogym is a holistic fitness and meditation platform offering expert-led workouts and guided meditations for physical and mental wellbeing.",
  "url": "https://ecogym.space",
  "logo": "https://ecogym.space/images/logo.png",
  "sameAs": [
    "https://www.facebook.com/ecogym",
    "https://www.instagram.com/ecogym",
    "https://www.twitter.com/ecogym",
    "https://www.youtube.com/ecogym"
  ]
};

export default function AboutPage(): React.JSX.Element {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <AboutContent />
    </>
  );
}
