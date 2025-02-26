import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";
import { BlogPost as BlogPostType } from "@shared/schema";
import ProgressTracker from "@/components/blog/ProgressTracker";
import EnhancedBlogContent from "@/components/blog/EnhancedBlogContent";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, Share2, Calendar, Clock, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const BlogPost = () => {
  const { id } = useParams();
  const postId = parseInt(id);
  
  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog-posts/${postId}`],
  });
  
  if (isLoading) {
    return (
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="h-10 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-8 w-1/2"></div>
            <div className="aspect-video bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-overlay mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20"
    >
      <ProgressTracker postId={postId} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-clash font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-overlay mb-6">{post.excerpt}</p>
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <div className="flex items-center">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-secondary/10 text-secondary">
                    {getInitials(post.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{post.authorName}</p>
                  <div className="flex items-center text-sm text-overlay">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Headphones className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              </div>
            </div>
          </header>
          
          {post.imageUrl && (
            <div className="mb-8">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto rounded-xl"
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-secondary/10 text-secondary">
                    {getInitials(post.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">Written by {post.authorName}</p>
                  <p className="text-sm text-overlay">AI Transformation Expert</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPost;
