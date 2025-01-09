// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostContent from './BlogPostContent';
import StructuredData from '../../components/StructuredData';
import { SchemaOrg } from '../../types/schema';
import { blogPosts } from '../blogData';

// Get blog post and related posts
const getBlogPost = (slug: string): { post: (typeof blogPosts)[0]; relatedPosts: (typeof blogPosts) } | null => {
  const post = blogPosts.find(post => post.slug === slug);
  if (!post) return null;

  // Get related posts based on shared tags
  const relatedPosts = blogPosts
    .filter(p => 
      p.slug !== slug && 
      p.tags.some(tag => post.tags.includes(tag))
    )
    .slice(0, 3);

  return { post, relatedPosts };
};

// Calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = getBlogPost(params.slug);
  if (!data) return notFound();
  
  const { post } = data;
  const readingTime = calculateReadingTime(post.content);
  const description = post.description || post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...';
  const url = `https://ecogym.com/blog/${params.slug}`;
  
  return {
    title: `${post.title} | Ecogym Blog`,
    description,
    keywords: [...post.tags, 'fitness', 'wellness', 'health', 'ecogym'],
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description,
      url,
      images: [{
        url: post.image,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.image],
      creator: '@ecogym',
    },
    alternates: {
      canonical: url,
    },
    other: {
      'reading-time': `${readingTime} minutes`,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }): JSX.Element {
  const data = getBlogPost(params.slug);
  if (!data) {
    return notFound();
  }

  const { post, relatedPosts = [] } = data;
  const readingTime = calculateReadingTime(post.content);
  const url = `https://ecogym.com/blog/${params.slug}`;

  const structuredData: SchemaOrg = {
    "@context": "https://schema.org" as const,
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": post.title,
    "description": post.description,
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://ecogym.com/trainers"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ecogym",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ecogym.com/images/logo.png"
      }
    },
    "keywords": post.tags.join(", "),
    "timeRequired": `PT${readingTime}M`,
    "isAccessibleForFree": "true",
    "inLanguage": "en-US"
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <BlogPostContent 
        post={post} 
        relatedPosts={relatedPosts}
      />
    </>
  );
}

// Generate static paths for all blog posts
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
