// app/blog/[slug]/BlogPostContent.tsx
'use client';

import React from 'react';

// Define the type for a blog post
interface BlogPostType {
  title: string;
  author: string;
  date: string;
  content: string;
}

// Define props type for BlogPostContent component
interface BlogPostContentProps {
  post: BlogPostType;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="mb-8 text-gray-400">
          <span>{post.author}</span> • <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default BlogPostContent;