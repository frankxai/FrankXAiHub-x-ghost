import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { pageVariants, containerVariants, itemVariants } from "@/lib/animations";
import { BlogPost } from "@shared/schema";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, TrendingUp, Star, BookOpen, Clock, Sparkles, Plus } from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [readingProgress, setReadingProgress] = useState<Record<number, number>>({});
  
  // Query all blog posts
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });
  
  // Query featured blog posts
  const { data: featuredPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts/featured'],
    enabled: !isLoading && !!blogPosts,
  });
  
  // Effect to get reading progress for all posts from localStorage
  useEffect(() => {
    if (blogPosts) {
      const progress: Record<number, number> = {};
      blogPosts.forEach(post => {
        const saved = localStorage.getItem(`reading-progress-${post.id}`);
        if (saved) {
          progress[post.id] = parseInt(saved);
        }
      });
      setReadingProgress(progress);
    }
  }, [blogPosts]);
  
  // Get unique categories from blog posts
  const categories = blogPosts 
    ? ["all", ...Array.from(new Set(blogPosts.map(post => post.category.toLowerCase())))]
    : ["all"];
  
  // Filter posts by search term and category
  const filteredPosts = blogPosts?.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeCategory === "all" || 
      post.category.toLowerCase() === activeCategory;
      
    return matchesSearch && matchesCategory;
  });
  
  // Get main featured post (first one)
  const mainFeaturedPost = featuredPosts && featuredPosts.length > 0 ? featuredPosts[0] : null;
  
  // Get secondary featured posts (next two)
  const secondaryFeaturedPosts = featuredPosts && featuredPosts.length > 1 
    ? featuredPosts.slice(1, 3) 
    : [];
  
  // Get recommended posts based on reading progress and recency
  const recommendedPosts = blogPosts 
    ? [...blogPosts]
        .filter(post => Object.keys(readingProgress).includes(post.id.toString()) && readingProgress[post.id] < 100)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 3)
    : [];
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="uppercase font-semibold mb-4">FrankX AI</Badge>
          <h1 className="text-4xl md:text-6xl font-clash font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI Center of Excellence</h1>
          <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl mb-6">
            Thought leadership on building enterprise AI capabilities, implementation roadmaps, and strategic transformation frameworks.
          </p>
          
          {/* Create Post Button */}
          <div className="flex justify-center gap-4">
            <Link href="/create-prompt-engineering-post">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></div>
                <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                Create AI Collaborative Post
              </Button>
            </Link>
            <Link href="/blog/create">
              <Button size="lg" variant="outline" className="group">
                <Plus className="mr-2 h-5 w-5" />
                Create Standard Post
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Featured Posts Section */}
        {mainFeaturedPost && !isLoading && (
          <motion.section 
            variants={containerVariants}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-clash font-bold flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Featured Content
              </h2>
              <Link href="/blog">
                <Button variant="ghost" className="text-muted-foreground">
                  View all 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Main featured post */}
              <Card className="col-span-1 lg:col-span-3 overflow-hidden border-0 shadow-lg">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80 z-10" />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
                    <Badge className="mb-4 text-xs uppercase self-start">{mainFeaturedPost.category}</Badge>
                    <Link href={`/blog/${mainFeaturedPost.id}`}>
                      <h3 className="text-2xl md:text-3xl font-clash font-bold mb-2 text-white hover:text-secondary/90 transition-colors">
                        {mainFeaturedPost.title}
                      </h3>
                    </Link>
                    <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
                      {mainFeaturedPost.excerpt}
                    </p>
                    <div className="flex items-center text-white/70 text-sm">
                      <span>{mainFeaturedPost.authorName}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(mainFeaturedPost.publishedAt)}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{mainFeaturedPost.readTime} min read</span>
                    </div>
                  </div>
                  {mainFeaturedPost.imageUrl && (
                    <img 
                      src={mainFeaturedPost.imageUrl} 
                      alt={mainFeaturedPost.title} 
                      className="w-full h-full object-cover aspect-[4/3] md:aspect-[16/9]" 
                    />
                  )}
                </div>
              </Card>
              
              {/* Secondary featured posts */}
              <div className="col-span-1 lg:col-span-2 grid grid-cols-1 gap-6 h-full">
                {secondaryFeaturedPosts.map((post) => (
                  <motion.div 
                    key={post.id} 
                    variants={itemVariants}
                    className="h-full"
                  >
                    <Card className="border-0 shadow-md overflow-hidden h-full flex flex-col bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                      <div className="flex flex-col md:flex-row h-full">
                        {post.imageUrl && (
                          <div className="md:w-1/3">
                            <img 
                              src={post.imageUrl} 
                              alt={post.title} 
                              className="w-full h-48 md:h-full object-cover" 
                            />
                          </div>
                        )}
                        <CardContent className={`flex-1 p-6 flex flex-col justify-between ${post.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                          <div>
                            <Badge variant="outline" className="mb-2 text-xs">{post.category}</Badge>
                            <Link href={`/blog/${post.id}`}>
                              <h3 className="text-xl font-clash font-bold mb-2 line-clamp-2 hover:text-secondary transition-colors">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {post.excerpt}
                            </p>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{post.authorName}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{post.readTime} min read</span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
        
        {/* Continue Reading Section */}
        {recommendedPosts.length > 0 && (
          <motion.section 
            variants={containerVariants}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-clash font-bold flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Continue Reading
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedPosts.map((post) => (
                <motion.div 
                  key={post.id} 
                  variants={itemVariants}
                >
                  <Card className="border border-border/40 dark:border-border/20 overflow-hidden h-full">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <Badge>{post.category}</Badge>
                        <div className="flex items-center">
                          <div className="bg-muted dark:bg-muted/30 rounded-full h-1.5 w-16 mr-1.5">
                            <motion.div 
                              className="bg-secondary h-1.5 rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: `${readingProgress[post.id] || 0}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                          <span className="text-xs font-medium">{readingProgress[post.id] || 0}%</span>
                        </div>
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <h3 className="text-lg font-clash font-bold mb-2 hover:text-secondary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Updated: {formatDate(post.publishedAt)}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${post.id}`}>
                            Continue <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        
        {/* Search and filter */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="md:w-auto" onClick={() => setSearchTerm("")}>
              {searchTerm ? "Clear Search" : "Search"}
            </Button>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveCategory}>
            <TabsList className="flex overflow-x-auto scrollbar-hide pb-2 space-x-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize"
                >
                  {category === "all" ? "All Articles" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Blog posts grid */}
        <motion.div
          variants={containerVariants}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-clash font-bold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              {activeCategory === 'all' ? 'All Articles' : `${activeCategory} Articles`}
            </h2>
            {filteredPosts && (
              <p className="text-sm text-muted-foreground">
                Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                >
                  <BlogCard 
                    post={post} 
                    readingProgress={readingProgress[post.id] || 0}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-border rounded-lg dark:bg-black/10 bg-gray-50 p-8">
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}>
                Reset Filters
              </Button>
            </div>
          )}
        </motion.div>
        
        {/* Categories */}
        <div className="mt-16">
          <h3 className="text-xl font-clash font-bold mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.filter(c => c !== "all").map((category) => (
              <Badge 
                key={category} 
                variant={activeCategory === category ? "default" : "outline"}
                className="px-4 py-2 capitalize cursor-pointer hover:bg-accent dark:hover:bg-accent/40"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Blog;
