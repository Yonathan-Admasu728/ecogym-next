// app/contact/page.tsx
import { Metadata } from 'next';

import ContactContent from './ContactContent';
import StructuredData from '../components/StructuredData';

export const metadata: Metadata = {
  title: 'Contact Us | Ecogym',
  description: 'Get in touch with Ecogym for any questions, feedback, or support. We\'re here to help you on your fitness journey.',
  openGraph: {
    title: 'Contact Us | Ecogym',
    description: 'Get in touch with Ecogym for any questions, feedback, or support. We\'re here to help you on your fitness journey.',
    url: 'https://ecogym.space/contact',
    images: [
      {
        url: '/images/contact-us.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecogym Contact Us',
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Ecogym Contact Page",
  "description": "Contact Ecogym for support, feedback, or inquiries about our fitness and wellness services.",
  "url": "https://ecogym.space/contact",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer support",
    "email": "support@ecogym.space",
    "areaServed": "US",
    "availableLanguage": ["English"]
  }
};

export default function ContactPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <ContactContent />
    </>
  );
}