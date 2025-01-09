// app/blog/[slug]/BlogPostContent.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPostType {
  slug: string;
  title: string;
  author: string;
  date: string;
  content: string;
  image: string;
  tags: string[];
}

interface BlogPostContentProps {
  post: BlogPostType;
  relatedPosts?: BlogPostType[];
}

const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const headings = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g)?.map(heading => {
    const level = heading.charAt(2);
    const text = heading.replace(/<[^>]*>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { level, text, id };
  }) || [];

  const scrollToHeading = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="space-y-2 text-sm">
      {headings.map((heading, index) => (
        <a
          key={index}
          href={`#${heading.id}`}
          onClick={scrollToHeading(heading.id)}
          className={`block hover:text-blue-600 transition-colors ${
            heading.level === '3' ? 'pl-4 text-gray-500' : 'font-medium text-gray-700'
          }`}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
};

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post, relatedPosts }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Handle copy URL toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Process content to add IDs to headings for table of contents
  const processedContent = post.content.replace(
    /<h([23])(.*?)>(.*?)<\/h\1>/g,
    (match, level, attrs, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (articleRef.current) {
        const element = articleRef.current;
        const totalHeight = element.clientHeight - window.innerHeight;
        const windowScrollTop = window.scrollY || document.documentElement.scrollTop;
        if (windowScrollTop === 0) {
          setReadingProgress(0);
        } else if (windowScrollTop > totalHeight) {
          setReadingProgress(100);
        } else {
          setReadingProgress((windowScrollTop / totalHeight) * 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate reading time
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(post.content);
  
  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen" ref={articleRef}>
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50"
        style={{ transform: `translateZ(0)` }}
      >
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.date,
            "image": post.image,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "EcoGym",
              "logo": {
                "@type": "ImageObject",
                "url": "https://ecogym.com/logo.png"
              }
            }
          })
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <article 
            className="lg:col-span-8 bg-white rounded-xl shadow-lg overflow-hidden"
            itemScope 
            itemType="http://schema.org/BlogPosting"
          >
            {/* Hero Image */}
            <div className="relative h-[400px]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Article Content */}
            <div className="p-8 lg:p-12">
              {/* Header */}
              <header className="mb-12">
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 
                  className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900"
                  itemProp="headline"
                >
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span itemProp="author">{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={post.date} itemProp="datePublished">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </header>

              {/* Article Body */}
              <div 
                className="prose prose-lg max-w-none mb-12 text-gray-700
                  prose-headings:text-gray-900 prose-headings:font-semibold
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-lg prose-p:leading-relaxed prose-p:my-6
                  prose-ul:my-6 prose-ol:my-6
                  prose-li:my-2
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                  prose-blockquote:pl-6 prose-blockquote:my-8
                  prose-blockquote:text-gray-700 prose-blockquote:italic
                  prose-blockquote:text-lg prose-blockquote:font-medium
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-12"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Share Section */}
              <div className="flex items-center justify-between py-8 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Share this article
                </div>
                <div className="relative">
                  <div className="flex gap-4">
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`, '_blank')}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`, '_blank')}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: post.title,
                            url: shareUrl
                          });
                        } else {
                          navigator.clipboard.writeText(shareUrl)
                            .then(() => setShowToast(true))
                            .catch(console.error);
                        }
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Share link"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <section className="mt-12 border-t pt-12">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src="/images/blog/resilience.png"
                      alt={post.author}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      quality={90}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
                    <p className="text-gray-600">
                      Certified fitness trainer and nutrition specialist with over 10 years of experience helping clients achieve their health goals.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8">
              {/* Table of Contents */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Table of Contents
                </h2>
                <TableOfContents content={post.content} />
              </div>

              {/* Related Posts */}
              {(relatedPosts && relatedPosts.length > 0) && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Related Articles
                  </h2>
                  <div className="space-y-6">
                    {relatedPosts.map(relatedPost => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}`}
                        className="block group"
                      >
                        <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                          {calculateReadingTime(relatedPost.content)} min read
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      {/* Toast Notification */}
      {showToast && (
        <div 
          role="alert"
          aria-live="polite"
          className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Link copied to clipboard!</span>
        </div>
      )}
    </main>
  );
};

export default BlogPostContent;
