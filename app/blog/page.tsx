// app/blog/page.tsx
import { Metadata } from 'next';
import BlogContent from './BlogContent';
import StructuredData from '../components/StructuredData';

export const metadata: Metadata = {
  title: 'Blog | Ecogym',
  description: 'Explore fitness tips, meditation guides, and wellness advice on the Ecogym blog.',
  openGraph: {
    title: 'Blog | Ecogym',
    description: 'Explore fitness tips, meditation guides, and wellness advice on the Ecogym blog.',
    url: 'https://ecogym.space/blog',
    images: [
      {
        url: '/images/blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Ecogym Blog',
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Ecogym Blog",
  "description": "Fitness tips, meditation guides, and wellness advice from Ecogym experts.",
  "url": "https://ecogym.space/blog",
};

export default function BlogPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <BlogContent />
    </>
  );
}