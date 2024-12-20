// app/careers/page.tsx
import { Metadata } from 'next';

import CareersContent from './CareersContent';
import StructuredData from '../components/StructuredData';

export const metadata: Metadata = {
  title: 'Careers | Ecogym',
  description: 'Join the Ecogym team and help shape the future of fitness and wellness. Check back for exciting job opportunities.',
  openGraph: {
    title: 'Careers | Ecogym',
    description: 'Join the Ecogym team and help shape the future of fitness and wellness. Check back for exciting job opportunities.',
    url: 'https://ecogym.space/careers',
    images: [
      {
        url: '/images/careers.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecogym Careers',
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Join the Ecogym Team",
  "description": "We're always looking for passionate individuals to join our team. Check back for upcoming opportunities.",
  "datePosted": new Date().toISOString(),
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Ecogym",
    "sameAs": "https://ecogym.space"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  },
  "employmentType": "FULL_TIME"
};

export default function CareersPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <CareersContent />
    </>
  );
}