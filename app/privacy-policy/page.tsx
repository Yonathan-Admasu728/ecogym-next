// app/privacy-policy/page.tsx
import { Metadata } from 'next';

import PrivacyPolicyContent from './PrivacyPolicyContent';
import StructuredData from '../components/StructuredData';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ecogym',
  description: 'Learn about Ecogym\'s privacy practices. Understand how we collect, use, and protect your personal information on our holistic fitness and meditation platform.',
  openGraph: {
    title: 'Privacy Policy | Ecogym',
    description: 'Learn about Ecogym\'s privacy practices. Understand how we collect, use, and protect your personal information on our holistic fitness and meditation platform.',
    url: 'https://ecogym.space/privacy-policy',
    images: [
      {
        url: '/images/privacy-policy.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecogym Privacy Policy',
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Ecogym Privacy Policy",
  "description": "Privacy Policy for Ecogym, a holistic fitness and meditation platform.",
  "url": "https://ecogym.space/privacy-policy",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <PrivacyPolicyContent />
    </>
  );
}