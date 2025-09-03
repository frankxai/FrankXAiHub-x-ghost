import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Search, TrendingUp, BookOpen, Users, ArrowRight, Star } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { BlogPost } from '@shared/schema';

interface ModernBlogLayoutProps {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  categories: string[];
}

export const ModernBlogLayout: React.FC<ModernBlogLayoutProps> = ({
  posts,
  featuredPosts,
  isLoading,
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  categories
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-cyan-600/10" />
        <div className="relative enterprise-container py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400">
              AI Innovation Hub
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Strategic insights, technical expertise, and thought leadership for enterprise AI transformation
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search articles, insights, and strategies..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Articles <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="enterprise-container py-12">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Featured Insights
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Must-read articles shaping the future of AI
                </p>
              </div>
              <Badge variant="outline" className="bg-yellow-100/80 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700">
                <Star className="h-4 w-4 mr-1" /> Featured
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 gap-1 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium px-6 py-3">
                <BookOpen className="h-4 w-4 mr-2" />
                All Articles
              </TabsTrigger>
              {categories.slice(0, 3).map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category.toLowerCase()}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium px-6 py-3"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>{posts.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Expert insights</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <TabsContent value={activeTab} className="space-y-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <ModernPostSkeleton key={i} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <EmptyState searchTerm={searchTerm} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <ModernPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const FeaturedPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Card className="group relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/30 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
    {post.imageUrl && (
      <div className="relative h-64 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Badge className="absolute top-4 left-4 bg-yellow-500/90 text-black border-0 font-bold">
          <Star className="h-3 w-3 mr-1" /> Featured
        </Badge>
      </div>
    )}
    <CardHeader className="relative pb-3">
      <div className="flex items-center gap-2 mb-3">
        <Badge 
          variant="secondary" 
          className="bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
        >
          {post.category}
        </Badge>
      </div>
      <CardTitle className="text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        <Link href={`/blog/${post.id}`}>
          {post.title}
        </Link>
      </CardTitle>
    </CardHeader>
    <CardContent className="pb-6">
      <p className="text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readTime} min</span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/frankx-avatar.png" />
            <AvatarFallback>{post.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span>{post.authorName}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ModernPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Card className="group h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between mb-3">
        <Badge 
          variant="outline" 
          className="bg-slate-100/50 text-slate-700 border-slate-300/50 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600/50"
        >
          {post.category}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="h-3 w-3" />
          <span>{post.readTime} min</span>
        </div>
      </div>
      <CardTitle className="text-lg font-semibold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        <Link href={`/blog/${post.id}`}>
          {post.title}
        </Link>
      </CardTitle>
    </CardHeader>
    <CardContent className="pb-4 flex-grow flex flex-col">
      <p className="text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed flex-grow">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-700/30">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(post.publishedAt), 'MMM d')}</span>
        </div>
        <span className="font-medium">{post.authorName}</span>
      </div>
    </CardContent>
  </Card>
);

const ModernPostSkeleton = () => (
  <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-pulse">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-20 bg-slate-300/50 dark:bg-slate-600/50 rounded-full" />
        <div className="h-4 w-16 bg-slate-300/50 dark:bg-slate-600/50 rounded" />
      </div>
      <div className="h-6 w-full bg-slate-300/50 dark:bg-slate-600/50 rounded" />
      <div className="h-6 w-3/4 bg-slate-300/50 dark:bg-slate-600/50 rounded" />
    </CardHeader>
    <CardContent className="pb-4">
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-slate-300/50 dark:bg-slate-600/50 rounded" />
        <div className="h-4 w-full bg-slate-300/50 dark:bg-slate-600/50 rounded" />
        <div className="h-4 w-2/3 bg-slate-300/50 dark:bg-slate-600/50 rounded" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-24 bg-slate-300/50 dark:bg-slate-600/50 rounded" />
        <div className="h-4 w-20 bg-slate-300/50 dark:bg-slate-600/50 rounded" />
      </div>
    </CardContent>
  </Card>
);

const EmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
      <Search className="h-12 w-12 text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
      {searchTerm ? 'No articles found' : 'No articles available'}
    </h3>
    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
      {searchTerm 
        ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search terms.`
        : 'New insights and articles will appear here soon.'
      }
    </p>
    {searchTerm && (
      <Button 
        variant="outline" 
        className="mt-6"
        onClick={() => window.location.reload()}
      >
        Clear Search
      </Button>
    )}
  </div>
);

export default ModernBlogLayout;