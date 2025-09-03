import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost, fetchAllBlogPosts, fetchFeaturedPosts } from '../../lib/blogApi';
import { ErrorBoundary } from '../ErrorBoundary';
import { ModernBlogLayout } from '../ui/modern-blog-layout';

const BlogPostsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch blog posts from both file-based and Sanity CMS systems
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchAllBlogPosts
  });

  // Fetch featured blog posts from both systems
  const { data: featuredPosts, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: fetchFeaturedPosts
  });

  // Filter posts based on search term and active tab
  const filteredPosts = blogPosts ? blogPosts.filter((post: BlogPost) => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return post.category === activeTab && matchesSearch;
  }) : [];

  // Extract unique categories for tabs
  const categories = blogPosts 
    ? Array.from(new Set(blogPosts.map((post: BlogPost) => post.category))) as string[]
    : [];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-500 mb-6">Failed to load blog posts. Please try again later.</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ModernBlogLayout
      posts={filteredPosts}
      featuredPosts={featuredPosts || []}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      categories={categories}
    />
  );
};

const BlogPostsListWithErrorBoundary = () => (
  <ErrorBoundary>
    <BlogPostsList />
  </ErrorBoundary>
);

export default BlogPostsListWithErrorBoundary;