import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ProgramDetailClient from '../../components/ProgramDetailClient';
import { mockPrograms } from '../../utils/mockData';
import { toString } from '../../types';
import { logger } from '../../utils/logger';

interface Props {
  params: { id: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const program = mockPrograms.find(p => 
    toString(p.id).toLowerCase() === params.id.toLowerCase() || 
    p.category.toLowerCase() === params.id.toLowerCase()
  );

  if (!program) {
    logger.debug('Program not found for metadata', { id: params.id });
    return {
      title: 'Program Not Found | EcoGym',
      description: 'The requested program could not be found.',
    };
  }

  logger.debug('Generating metadata for program', { id: params.id, title: program.title });
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
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  // Pre-render the most popular programs at build time
  const popularProgramIds = mockPrograms
    .filter(program => program.review_count && program.review_count > 100)
    .map(program => ({
      id: toString(program.id),
    }));

  logger.debug('Generated static paths', { count: popularProgramIds.length });
  return popularProgramIds;
}

// Enable ISR with revalidation every hour
export const revalidate = 3600;

// Loading component
function ProgramDetailSkeleton(): JSX.Element {
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

export default async function ProgramPage({ params }: Props): Promise<JSX.Element> {
  const program = mockPrograms.find(p => 
    toString(p.id).toLowerCase() === params.id.toLowerCase() || 
    p.category.toLowerCase() === params.id.toLowerCase()
  );

  if (!program) {
    logger.debug('Program not found', { id: params.id });
    notFound();
  }

  logger.debug('Rendering program page', { id: params.id, title: program.title });
  return (
    <Suspense fallback={<ProgramDetailSkeleton />}>
      <ProgramDetailClient program={program} />
    </Suspense>
  );
}
