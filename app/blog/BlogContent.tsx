'use client';

import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { blogPosts } from './blogData';
import { useState, type JSX, type FunctionComponent } from 'react';

interface BlogPostProps {
  post: {
    title: string;
    content: string;
    image: string;
    tags: string[];
    author: string;
    date: string;
    slug: string;
    description?: string;
    featured?: boolean;
  };
  featured?: boolean;
}

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const BlogPost: FunctionComponent<BlogPostProps> = (props: BlogPostProps): JSX.Element => {
  const { post, featured } = props;
  const readingTime = calculateReadingTime(post.content);
  const previewText = post.content.replace(/<[^>]*>/g, '').slice(0, featured ? 300 : 150) + '...';

  return (
    <article className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${featured ? 'lg:col-span-2 lg:grid lg:grid-cols-2' : ''}`}>
      <div className={`relative ${featured ? 'h-96 lg:h-full' : 'h-48'}`}>
        <Image
          src={post.image}
          alt={`${post.title} - Ecogym Blog Post`}
          fill
          className="object-cover"
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={featured}
          loading={featured ? "eager" : "lazy"}
          quality={90}
        />
        {featured && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        )}
      </div>
      <div className={`p-6 flex flex-col flex-grow ${featured ? 'lg:p-8' : ''}`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(tag => (
            <span 
              key={tag} 
              className="bg-[#EEF2FF] text-[#4F46E5] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className={`font-bold mb-4 ${featured ? 'text-3xl lg:text-4xl' : 'text-2xl'} line-clamp-2`}>
          {post.title}
        </h2>
        <p className="text-gray-600 mb-6 line-clamp-2 text-base leading-relaxed">{previewText}</p>
        <div className="flex items-center gap-8 text-base text-gray-500 mb-6 mt-auto">
          <span className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author}
          </span>
          <span className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min read
          </span>
          <time dateTime={post.date} className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          Read Article
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default function BlogContent(): JSX.Element {
  const pageTitle = "Ecogym Blog - Fitness Tips & Wellness Insights";
  const pageDescription = "Explore our collection of fitness articles, wellness tips, and expert advice to enhance your health journey with Ecogym.";
  const canonicalUrl = "https://ecogym.com/blog";
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique tags from all posts
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  // Filter posts based on search term and selected tags
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => post.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Featured post is the first one marked as featured
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="fitness, wellness, health, exercise, nutrition, mindfulness" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="/images/blog/daily-compass.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="/images/blog/daily-compass.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "headline": pageTitle,
            "description": pageDescription,
            "url": canonicalUrl,
            "image": "/images/blog/daily-compass.png",
            "publisher": {
              "@type": "Organization",
              "name": "Ecogym",
              "logo": {
                "@type": "ImageObject",
                "url": "/images/logo.png"
              }
            }
          })}
        </script>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Ecogym Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover insights, tips, and inspiration for your fitness journey. 
              Expert advice to enhance your physical and mental well-being.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-[#EEF2FF] text-[#4F46E5] hover:bg-indigo-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && !searchTerm && selectedTags.length === 0 && (
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Featured Article</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                  />
                </div>
                <div className="p-8">
                  <div className="flex gap-4 mb-6">
                    {featuredPost.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-[#EEF2FF] text-[#4F46E5] px-4 py-1.5 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="max-w-3xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {featuredPost.content.replace(/<[^>]*>/g, '').slice(0, 200)}...
                    </p>
                    <div className="flex items-center gap-8 text-base text-gray-500 mb-6">
                        <span className="flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {featuredPost.author}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {calculateReadingTime(featuredPost.content)} min read
                        </span>
                        <time dateTime={featuredPost.date} className="flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(featuredPost.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read Article
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <BlogPost key={post.slug} post={post} />
            ))}
          </div>

          {/* No Results Message */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
