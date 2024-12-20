// app/faq/page.tsx
import { Metadata } from 'next';

import FAQContent from './FAQContent';
import StructuredData from '../components/StructuredData';
import { SchemaOrg } from '../types';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Ecogym',
  description: 'Find answers to common questions about Ecogym, our fitness programs, meditation sessions, and platform features.',
  openGraph: {
    title: 'Frequently Asked Questions | Ecogym',
    description: 'Find answers to common questions about Ecogym, our fitness programs, meditation sessions, and platform features.',
    url: 'https://ecogym.space/faq',
    images: [
      {
        url: '/images/faq.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecogym FAQ',
      },
    ],
  },
};

const SCHEMA_CONTEXT = "https://schema.org" as const;

const structuredData: SchemaOrg = {
  "@context": SCHEMA_CONTEXT,
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Ecogym?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ecogym is a holistic fitness and meditation platform that offers personalized workout programs and mindfulness sessions to help you achieve your wellness goals."
      }
    },
    // Add more FAQ items here
  ]
};

export default function FAQPage(): JSX.Element {
  return (
    <>
      <StructuredData data={structuredData} />
      <FAQContent />
    </>
  );
}
