import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Headphones, ArrowUpRight, Clock, BookOpen, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

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
  
  const { theme } = useTheme();
  
  // Mouse-follow effect with gradient light
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  
  // Create a template for the gradient spotlight effect
  const background = useMotionTemplate`
    radial-gradient(
      320px circle at ${mouseX}px ${mouseY}px,
      var(--spotlight-color) 0%,
      transparent 80%
    )
  `;
  
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
  
  // Animation variants for card
  const cardVariants = {
    initial: { 
      y: 0,
      boxShadow: "0px 0px 0px rgba(0,0,0,0.1)" 
    },
    hover: { 
      y: -8,
      boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)",
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };
  
  const imageVariants = {
    initial: { 
      scale: 1.0 
    },
    hover: { 
      scale: 1.08,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    }
  };
  
  const arrowVariants = {
    initial: { 
      x: 0,
      opacity: 0 
    },
    hover: { 
      x: 5, 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className="relative group"
    >
      <Card className="overflow-hidden h-full border border-border/40 dark:border-border/20 relative bg-card dark:bg-card">
        {/* Spotlight overlay effect */}
        <motion.div 
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition duration-300"
          style={{ 
            background: background as any,
            "--spotlight-color": theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,166,224,0.08)"
          } as React.CSSProperties}
        />
      
        <div className="relative h-44 sm:h-52 overflow-hidden group">
          {imageUrl && (
            <motion.div variants={imageVariants} className="h-full">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          )}
          <Badge className="absolute top-4 right-4 bg-white/90 dark:bg-card/90 text-primary dark:text-secondary hover:bg-white dark:hover:bg-card/80 backdrop-blur-sm shadow-sm">
            {category}
          </Badge>
          <motion.div 
            className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md">
              <Bookmark className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        <CardContent className="p-6">
          <Badge variant="outline" className="mb-3 text-xs font-medium text-secondary bg-secondary/5 border-secondary/20">
            AI Center of Excellence
          </Badge>
          
          <Link href={`/blog/${id}`}>
            <motion.h3 className="font-clash font-bold text-xl mb-2 hover:text-secondary transition-colors cursor-pointer group/title">
              {title}
              <motion.span 
                className="inline-block ml-1 translate-y-px opacity-0 group-hover/title:opacity-100 transition-opacity"
                variants={arrowVariants}
              >
                <ArrowUpRight className="h-4 w-4 inline" />
              </motion.span>
            </motion.h3>
          </Link>
          
          <p className="text-muted-foreground mb-5 line-clamp-2 text-sm">{excerpt}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 border border-border/40">
                {imageUrl ? (
                  <AvatarImage src={imageUrl.replace('blog', 'avatar')} alt={authorName} />
                ) : null}
                <AvatarFallback className="bg-secondary/10 text-secondary text-xs font-medium">
                  {getInitials(authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">{authorName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(publishedAt)}</p>
              </div>
            </div>
            <motion.div 
              className="flex items-center text-xs font-medium text-muted-foreground rounded-full px-2.5 py-1 bg-muted/50 cursor-pointer hover:bg-secondary/10 hover:text-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Headphones className="mr-1 h-3 w-3" />
              <span>Listen</span>
            </motion.div>
          </div>
          
          <div className="pt-4 border-t border-border/40 dark:border-border/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                <span>{readTime} min read</span>
              </div>
              
              <div className="flex items-center">
                <BookOpen className="h-3.5 w-3.5 text-secondary mr-1.5" />
                <div className="bg-muted dark:bg-muted/30 rounded-full h-1.5 w-16 mr-1.5">
                  <motion.div 
                    className="bg-secondary h-1.5 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${readingProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs font-medium">{readingProgress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
