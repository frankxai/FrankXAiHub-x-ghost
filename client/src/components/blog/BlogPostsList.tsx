import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Search } from 'lucide-react';
import { BlogPost, fetchAllBlogPosts, fetchFeaturedPosts } from '../../lib/blogApi';
import { ErrorBoundary } from '../ErrorBoundary';
import { BlogPostCardSkeleton, FeaturedPostCardSkeleton, GridLoadingSkeleton } from '../ui/loading-states';

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
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>
      
      {/* Featured Posts Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
        {isFeaturedLoading ? (
          <GridLoadingSkeleton 
            count={3} 
            component={FeaturedPostCardSkeleton} 
            columns={3} 
          />
        ) : featuredPosts && featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post: BlogPost) => (
              <FeaturedPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </div>
      
      {/* Category Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            <GridLoadingSkeleton 
              count={4} 
              component={BlogPostCardSkeleton} 
              columns={2} 
            />
          ) : (
            <>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No blog posts found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post: BlogPost) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const FeaturedPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
    {post.imageUrl && (
      <div className="h-48 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
    )}
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary">{post.category}</Badge>
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Featured</Badge>
      </div>
      <CardTitle className="text-xl">
        <Link href={`/blog/${post.id}`} className="hover:text-primary">
          {post.title}
        </Link>
      </CardTitle>
    </CardHeader>
    <CardContent className="pb-2 flex-grow">
      <CardDescription className="line-clamp-3">
        {post.excerpt}
      </CardDescription>
    </CardContent>
    <CardFooter className="flex flex-col items-start space-y-2 pt-2 text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <Calendar size={14} />
        <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{post.readTime} min read</span>
        </div>
        <div className="text-right">By {post.authorName}</div>
      </div>
    </CardFooter>
  </Card>
);

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary">{post.category}</Badge>
      </div>
      <CardTitle className="text-xl">
        <Link href={`/blog/${post.id}`} className="hover:text-primary">
          {post.title}
        </Link>
      </CardTitle>
    </CardHeader>
    <CardContent className="pb-2 flex-grow">
      <CardDescription className="line-clamp-3">
        {post.excerpt}
      </CardDescription>
    </CardContent>
    <CardFooter className="pt-2 text-sm text-gray-500">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.readTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-right">By {post.authorName}</div>
      </div>
    </CardFooter>
  </Card>
);

const BlogPostsListWithErrorBoundary = () => (
  <ErrorBoundary>
    <BlogPostsList />
  </ErrorBoundary>
);

export default BlogPostsListWithErrorBoundary;