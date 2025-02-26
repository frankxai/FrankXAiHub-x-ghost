import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BlogCardProps {
  post: BlogPost;
  readingProgress?: number;
}

const BlogCard = ({ post, readingProgress = 0 }: BlogCardProps) => {
  const { 
    id, 
    title, 
    excerpt, 
    imageUrl, 
    category, 
    authorName, 
    publishedAt,
    readTime 
  } = post;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full">
        <div className="relative h-48 overflow-hidden">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
          <Badge className="absolute top-4 right-4 bg-white text-primary hover:bg-white/90">
            {category}
          </Badge>
        </div>
        <CardContent className="p-6">
          <Link href={`/blog/${id}`}>
            <h3 className="font-clash font-bold text-xl mb-2 hover:text-secondary transition-colors cursor-pointer">
              {title}
            </h3>
          </Link>
          <p className="text-overlay mb-4 line-clamp-2">{excerpt}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-200 text-gray-500 text-xs">
                  {getInitials(authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">{authorName}</p>
                <p className="text-xs text-overlay">{formatDate(publishedAt)}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-overlay cursor-pointer hover:text-secondary transition-colors">
              <Headphones className="mr-1 h-4 w-4" />
              <span>Listen</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span>{readTime} min read</span>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-1.5 w-16">
                  <div 
                    className="bg-secondary h-1.5 rounded-full" 
                    style={{ width: `${readingProgress}%` }}
                  ></div>
                </div>
                <span className="ml-2">{readingProgress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
