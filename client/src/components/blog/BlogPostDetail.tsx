import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { TextSelectionProvider } from '../social/TextSelectionShareProvider';
import SelectionToolbar from '../social/SelectionToolbar';
import { fetchBlogPostById } from '../../lib/blogApi';

const BlogPostDetail: React.FC = () => {
  const { id } = useParams();
  const postId = parseInt(id || '0');

  // Fetch post from both systems using our unified API
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', postId],
    queryFn: () => fetchBlogPostById(postId),
    enabled: !!postId
  });

  // Calculate the post URL for sharing
  const postUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${postId}` 
    : '';

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">Oops! Post not found</h2>
        <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <TextSelectionProvider>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
        
        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime} min read</span>
            </div>
            <Badge variant="outline">{post.category}</Badge>
          </div>
          
          {/* Author Info */}
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`} />
                <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.authorName}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Featured Image */}
          {post.imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Post Content */}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
        
        {/* Text selection toolbar */}
        <SelectionToolbar 
          postTitle={post.title} 
          postUrl={postUrl} 
        />
      </div>
    </TextSelectionProvider>
  );
};

const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <Skeleton className="h-10 w-32 mb-6" />
    <Skeleton className="h-12 w-3/4 mb-4" />
    <div className="flex flex-wrap gap-4 mb-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-28" />
    </div>
    <Skeleton className="h-20 w-full mb-6" />
    <Skeleton className="h-64 w-full mb-8" />
    <div className="space-y-4">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-5/6" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-4/5" />
    </div>
  </div>
);

export default BlogPostDetail;