import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { pageVariants, containerVariants, itemVariants } from "@/lib/animations";
import { BlogPost as BlogPostType } from "@shared/schema";
import ProgressTracker from "@/components/blog/ProgressTracker";
import EnhancedBlogContent from "@/components/blog/EnhancedBlogContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Headphones, 
  Share2, 
  Calendar, 
  Clock, 
  ChevronUp, 
  ChevronLeft, 
  Bookmark,
  ThumbsUp,
  Copy,
  Twitter,
  Linkedin,
  ArrowRight,
  Users,
  BarChart2,
  Code,
  Zap,
  Lightbulb
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { getPersonaById, AI_PERSONAS } from "@/lib/ai-personas";

const BlogPost = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const postId = id ? parseInt(id) : 0;
  
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Query for current blog post
  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog-posts/${postId}`],
  });
  
  // Query for all blog posts (for related posts)
  const { data: allPosts } = useQuery<BlogPostType[]>({
    queryKey: ['/api/blog-posts'],
    enabled: !isLoading && !!post,
  });
  
  // Check for scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      
      // Calculate reading progress
      if (contentRef.current) {
        const contentHeight = contentRef.current.offsetHeight;
        const currentPosition = window.scrollY - contentRef.current.offsetTop + window.innerHeight / 2;
        const progress = Math.min(100, Math.max(0, Math.floor((currentPosition / contentHeight) * 100)));
        setReadingProgress(progress);
        
        // Save reading progress to localStorage
        if (post && progress > 0) {
          localStorage.setItem(`reading-progress-${post.id}`, progress.toString());
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);
  
  // Update document title for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} - FrankX.AI Center of Excellence`;
      
      // Add Open Graph meta tags for social sharing
      const metaTags = [
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.excerpt },
        { property: 'og:type', content: 'article' },
      ];
      
      if (post.imageUrl) {
        metaTags.push({ property: 'og:image', content: post.imageUrl });
      }
      
      // Clean up existing tags and add new ones
      document.querySelectorAll('meta[property^="og:"]').forEach(tag => tag.remove());
      
      metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      });
    }
    
    return () => {
      document.title = 'FrankX.AI Center of Excellence';
      document.querySelectorAll('meta[property^="og:"]').forEach(tag => tag.remove());
    };
  }, [post]);
  
  // Get related posts based on category
  const relatedPosts = allPosts && post
    ? allPosts
        .filter(p => p.id !== post.id && p.category === post.category)
        .slice(0, 3)
    : [];
  
  // Handle sharing functions
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(window.location.href);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Link copied to clipboard',
        description: 'You can now share it with anyone',
      });
    });
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (isLoading) {
    return (
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8 w-1/2"></div>
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full"></div>
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
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
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
      className="pt-28 pb-20 relative"
    >
      <ProgressTracker postId={postId} progress={readingProgress} />
      
      {/* Floating action buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/blog")}
            className="text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Button>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <motion.article 
            className="lg:col-span-8 relative"
            ref={contentRef}
          >
            <div className="lg:sticky lg:top-28 z-10 pb-4 pt-2 bg-background space-y-6 mb-8">
              <Badge variant="outline" className="uppercase">{post.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-clash font-bold">{post.title}</h1>
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
              
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    {post.imageUrl ? (
                      <AvatarImage src={post.imageUrl.replace('blog', 'avatar')} alt={post.authorName} />
                    ) : null}
                    <AvatarFallback className="bg-secondary/10 text-secondary">
                      {getInitials(post.authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium">{post.authorName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
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
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Headphones className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                </div>
              </div>
            </div>
            
            {post.imageUrl && (
              <div className="mb-10">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-auto rounded-xl shadow-md"
                />
              </div>
            )}
            
            <EnhancedBlogContent content={post.content} className="mb-10" />
            
            {/* Article actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-muted/30 rounded-lg p-6 mb-10">
              <div className="flex items-center mb-4 sm:mb-0">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => toast({ title: "Thanks for the feedback!" })}>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Helpful
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => copyToClipboard(window.location.href)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 text-[#1DA1F2]"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 text-[#0A66C2]"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Author bio */}
            <div className="bg-black/5 dark:bg-white/5 rounded-lg p-6 mb-10">
              {(() => {
                // Get persona information
                const persona = getPersonaById(post.aiPersona || 'default');
                
                // Get the icon component based on persona
                let PersonaIcon = Zap;
                if (persona.icon === 'users') PersonaIcon = Users;
                if (persona.icon === 'bar-chart-2') PersonaIcon = BarChart2;
                if (persona.icon === 'code') PersonaIcon = Code;
                if (persona.icon === 'lightbulb') PersonaIcon = Lightbulb;
                
                return (
                  <>
                    <div className="flex items-center">
                      <Avatar className="h-16 w-16 border-2" 
                        style={{
                          borderColor: post.aiPersonaColor || persona.color
                        }}
                      >
                        <AvatarFallback 
                          className="text-lg"
                          style={{
                            backgroundColor: `${persona.color}15`,
                            color: persona.color
                          }}
                        >
                          {getInitials(persona.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="font-bold text-lg">{persona.name}</p>
                          {persona.id !== 'default' && (
                            <Badge 
                              variant="outline" 
                              className="ml-3 px-2 py-0"
                              style={{
                                borderColor: `${persona.color}40`,
                                backgroundColor: `${persona.color}10`,
                                color: persona.color
                              }}
                            >
                              {persona.role}
                            </Badge>
                          )}
                        </div>
                        <div className="flex text-sm text-muted-foreground items-center mt-1">
                          <PersonaIcon className="h-4 w-4 mr-2" style={{ color: persona.color }} />
                          <span>{persona.description}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                      {persona.id === 'default' ? (
                        <>Frank Riemer is a renowned expert in AI implementation strategies, helping organizations build effective AI Centers of Excellence and enterprise-wide transformation initiatives. With over a decade of experience in strategic technology adoption, he specializes in aligning AI capabilities with business objectives.</>
                      ) : persona.id === 'architect' ? (
                        <>As Frank's AI Architecture persona, I focus on the technical implementation aspects of AI systems, exploring how different tools, frameworks, and approaches can be leveraged to build robust and scalable AI platforms. I provide technical insights, architecture patterns, and implementation guidance.</>
                      ) : persona.id === 'strategist' ? (
                        <>As Frank's Strategy Advisor persona, I address business transformation and strategic approaches to AI adoption. I explore the organizational changes, business cases, and leadership perspectives required for successful AI initiatives, helping businesses align technology with business outcomes.</>
                      ) : persona.id === 'coach' ? (
                        <>As Frank's Performance Coach persona, I guide teams and leaders through the challenges of AI adoption and organizational change. I focus on the human aspects of AI transformation, including talent development, change management, and building high-performing AI teams.</>
                      ) : (
                        <>As Frank's Innovation Guide persona, I explore emerging technologies and future trends in AI, identifying opportunities for innovation and competitive advantage. I examine creative applications of AI across industries and provide insights into what's next in the rapidly evolving AI landscape.</>
                      )}
                    </p>
                  </>
                );
              })()}
            </div>
          </motion.article>
          
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Table of contents - extracted from headings */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Table of Contents</h3>
                <nav className="space-y-1">
                  {post.content.match(/^#{2,3} (.+)$/gm)?.map((heading, index) => {
                    const level = heading.startsWith('### ') ? 3 : 2;
                    const text = heading.replace(/^#{2,3} /, '');
                    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                    
                    return (
                      <a 
                        key={index}
                        href={`#${id}`}
                        className={`block text-sm hover:text-secondary transition-colors ${
                          level === 3 ? 'pl-4 text-muted-foreground' : 'font-medium'
                        }`}
                      >
                        {text}
                      </a>
                    );
                  })}
                </nav>
              </div>
              
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(relatedPost => (
                      <Card key={relatedPost.id} className="bg-transparent border-0 shadow-none">
                        <Link href={`/blog/${relatedPost.id}`}>
                          <CardContent className="p-0">
                            <div className="flex items-start space-x-3">
                              {relatedPost.imageUrl && (
                                <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                                  <img 
                                    src={relatedPost.imageUrl} 
                                    alt={relatedPost.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-medium line-clamp-2 hover:text-secondary transition-colors">
                                  {relatedPost.title}
                                </h4>
                                <div className="flex items-center mt-1">
                                  <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                                  <span className="text-xs text-muted-foreground">
                                    {relatedPost.readTime} min read
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                    <Link href="/blog">
                      View all articles
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              )}
              
              {/* Categories */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={post.category.toLowerCase() === 'strategy' ? 'default' : 'outline'}
                    className="px-3 py-1"
                    onClick={() => navigate("/blog")}
                  >
                    Strategy
                  </Badge>
                  <Badge 
                    variant={post.category.toLowerCase() === 'technology' ? 'default' : 'outline'}
                    className="px-3 py-1"
                    onClick={() => navigate("/blog")}
                  >
                    Technology
                  </Badge>
                  <Badge 
                    variant={post.category.toLowerCase() === 'technical' ? 'default' : 'outline'}
                    className="px-3 py-1"
                    onClick={() => navigate("/blog")}
                  >
                    Technical
                  </Badge>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <h3 className="text-lg font-bold mb-2">Subscribe to Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest AI Center of Excellence insights delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-3 py-2 rounded-md border border-input bg-transparent"
                  />
                  <Button className="w-full">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </div>
            </div>
          </aside>
        </div>
        
        {/* More from author */}
        {allPosts && (
          <motion.section
            variants={containerVariants}
            className="mt-16 max-w-6xl mx-auto"
          >
            <h2 className="text-2xl font-clash font-bold mb-8">More from {post.authorName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allPosts
                .filter(p => p.authorName === post.authorName && p.id !== post.id)
                .slice(0, 3)
                .map(authorPost => (
                  <motion.div
                    key={authorPost.id}
                    variants={itemVariants}
                  >
                    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                      {authorPost.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={authorPost.imageUrl} 
                            alt={authorPost.title} 
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <Badge className="mb-2">{authorPost.category}</Badge>
                        <Link href={`/blog/${authorPost.id}`}>
                          <h3 className="text-lg font-clash font-bold mb-2 hover:text-secondary transition-colors">
                            {authorPost.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {authorPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatDate(authorPost.publishedAt)}</span>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{authorPost.readTime} min read</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPost;
