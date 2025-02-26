import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";
import { BlogPost } from "@shared/schema";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });
  
  // Get unique categories from blog posts
  const categories = blogPosts 
    ? ["all", ...new Set(blogPosts.map(post => post.category.toLowerCase()))]
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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-clash font-bold mb-4">AI Center of Excellence</h1>
          <p className="text-lg text-overlay">
            Thought leadership on building enterprise AI capabilities, implementation roadmaps, and strategic transformation frameworks.
          </p>
        </div>
        
        {/* Search and filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10 py-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveCategory}>
            <TabsList className="flex overflow-x-auto pb-2 space-x-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize"
                >
                  {category === "all" ? "All" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Blog posts grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-overlay">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* Categories */}
        <div className="mt-16">
          <h3 className="text-xl font-clash font-bold mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.filter(c => c !== "all").map((category) => (
              <Badge 
                key={category} 
                variant="outline"
                className="px-4 py-2 capitalize cursor-pointer hover:bg-gray-50"
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
