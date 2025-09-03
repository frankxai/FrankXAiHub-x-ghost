import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Inline loading spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
};

// Blog post card loading skeleton
export const BlogPostCardSkeleton: React.FC = () => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-24 mb-2" />
      <Skeleton className="h-7 w-full" />
    </CardHeader>
    <CardContent className="pb-2">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <div className="p-6 pt-2">
      <div className="flex justify-between w-full">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  </Card>
);

// Featured blog post card loading skeleton  
export const FeaturedPostCardSkeleton: React.FC = () => (
  <Card className="h-full">
    <Skeleton className="h-48 w-full" />
    <CardHeader className="pb-2">
      <div className="flex gap-2 mb-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-7 w-full" />
    </CardHeader>
    <CardContent className="pb-2">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <div className="p-6 pt-2">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex justify-between w-full">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>
  </Card>
);

// Blog post detail loading skeleton
export const BlogPostDetailSkeleton: React.FC = () => (
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

// Grid loading skeleton
export const GridLoadingSkeleton: React.FC<{ 
  count?: number, 
  component: React.ComponentType,
  columns?: number 
}> = ({ count = 4, component: Component, columns = 2 }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn('grid gap-6', gridClasses[columns as keyof typeof gridClasses] || gridClasses[2])}>
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
};

// Content loading with text overlay
export const ContentLoadingOverlay: React.FC<{ 
  isLoading: boolean, 
  children: React.ReactNode,
  message?: string 
}> = ({ isLoading, children, message = "Loading..." }) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border">
          <LoadingSpinner size="sm" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

// Page loading transition
export const PageLoadingTransition: React.FC<{ 
  isLoading: boolean,
  message?: string 
}> = ({ isLoading, message = "Loading page..." }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <div className="font-medium mb-1">{message}</div>
          <div className="text-sm text-muted-foreground">Please wait...</div>
        </div>
      </div>
    </div>
  );
};