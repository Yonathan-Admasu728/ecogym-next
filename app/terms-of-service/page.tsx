// app/terms-of-service/page.tsx
import { Metadata } from 'next';

import TermsOfServiceContent from './TermsOfServiceContent';
import StructuredData from '../components/StructuredData';
import type { SchemaOrg } from '../types/schema';

export const metadata: Metadata = {
  title: 'Terms of Service | Ecogym',
  description: 'Read and understand the Terms of Service for Ecogym, your holistic fitness and meditation platform. Learn about user responsibilities, content guidelines, and legal terms.',
  openGraph: {
    title: 'Terms of Service | Ecogym',
    description: 'Read and understand the Terms of Service for Ecogym, your holistic fitness and meditation platform. Learn about user responsibilities, content guidelines, and legal terms.',
    url: 'https://ecogym.space/terms-of-service',
    images: [
      {
        url: '/images/terms-of-service.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecogym Terms of Service',
      },
    ],
  },
};

const structuredData: SchemaOrg = {
  "@context": "https://schema.org" as const,
  "@type": "WebPage",
  "name": "Ecogym Terms of Service",
  "description": "Terms of Service for Ecogym, a holistic fitness and meditation platform.",
  "url": "https://ecogym.space/terms-of-service",
};

export default function TermsOfServicePage(): JSX.Element {
  return (
    <>
      <StructuredData data={structuredData} />
      <TermsOfServiceContent />
    </>
  );
}
