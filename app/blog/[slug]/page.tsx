// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';
import StructuredData from '../../components/StructuredData';

export const metadata: Metadata = {
  title: 'Blog Post | Ecogym',
  description: 'Read our latest blog post on fitness, meditation, and wellness.',
};

// This is a placeholder. In a real application, you'd fetch the blog post data here.
const getBlogPost = (slug: string) => {
  return {
    title: "Sample Blog Post",
    content: "This is a sample blog post content.",
    date: "2023-07-20",
    author: "Jane Doe",
  };
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    }
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <BlogPostContent post={post} />
    </>
  );
}