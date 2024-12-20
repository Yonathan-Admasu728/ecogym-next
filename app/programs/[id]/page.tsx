import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ProgramDetailClient from '../../components/ProgramDetailClient';
import { mockPrograms } from '../../utils/mockData';

interface Props {
  params: { id: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const program = mockPrograms.find(p => 
    p.id.toLowerCase() === params.id.toLowerCase() || 
    p.category.toLowerCase() === params.id.toLowerCase()
  );

  if (!program) {
    return {
      title: 'Program Not Found | EcoGym',
      description: 'The requested program could not be found.',
    };
  }

  return {
    title: `${program.title} | EcoGym`,
    description: program.description,
    openGraph: {
      title: program.title,
      description: program.description,
      images: [program.thumbnail],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: program.title,
      description: program.description,
      images: [program.thumbnail],
    },
    // Add structured data for rich results
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: program.title,
        description: program.description,
        provider: {
          '@type': 'Organization',
          name: 'EcoGym',
          sameAs: 'https://ecogym.com',
        },
        ...(program.trainer && {
          instructor: {
            '@type': 'Person',
            name: `${program.trainer.user?.first_name} ${program.trainer.user?.last_name}`,
          },
        }),
        courseLevel: program.level,
        numberOfLessons: program.total_sessions,
        ...(program.price && {
          offers: {
            '@type': 'Offer',
            price: program.price,
            priceCurrency: 'USD',
          },
        }),
      }),
    },
  };
}

// Generate static paths for common programs
export async function generateStaticParams() {
  // Pre-render the most popular programs at build time
  const popularProgramIds = mockPrograms
    .filter(program => program.review_count && program.review_count > 100)
    .map(program => ({
      id: program.id,
    }));

  return popularProgramIds;
}

// Enable ISR with revalidation every hour
export const revalidate = 3600;

// Loading component
function ProgramDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-300 rounded-lg mb-4" />
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/3" />
    </div>
  );
}

// Error component
function ProgramError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Program</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default async function ProgramPage({ params }: Props) {
  const program = mockPrograms.find(p => 
    p.id.toLowerCase() === params.id.toLowerCase() || 
    p.category.toLowerCase() === params.id.toLowerCase()
  );

  if (!program) {
    notFound();
  }

  return (
    <Suspense fallback={<ProgramDetailSkeleton />}>
      <ProgramDetailClient program={program} />
    </Suspense>
  );
}
