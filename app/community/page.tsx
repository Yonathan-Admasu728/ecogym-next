// app/community/page.tsx
import { Metadata } from 'next';

import CommunityContent from './CommunityContent';
import StructuredData from '../components/StructuredData';

export const metadata: Metadata = {
  title: 'Community | Ecogym',
  description: 'Join the Ecogym community. Share your fitness journey, participate in events, and connect with like-minded individuals passionate about holistic wellness.',
  openGraph: {
    title: 'Community | Ecogym',
    description: 'Join the Ecogym community. Share your fitness journey, participate in events, and connect with like-minded individuals passionate about holistic wellness.',
    url: 'https://ecogym.space/community',
    images: [
      {
        url: '/images/community.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecogym Community',
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Ecogym Community",
  "description": "Join the Ecogym community and connect with fitness enthusiasts.",
  "url": "https://ecogym.space/community",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Event",
        "name": "Monthly Fitness Challenge",
        "description": "Join our monthly fitness challenge and push your limits!",
        "startDate": "2023-09-01T09:00",
        "endDate": "2023-09-30T18:00",
        "location": {
          "@type": "Place",
          "name": "Ecogym",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Wellness City",
            "addressRegion": "WC",
            "postalCode": "12345",
            "addressCountry": "US"
          }
        }
      }
    ]
  }
};

export default function CommunityPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <CommunityContent />
    </>
  );
}