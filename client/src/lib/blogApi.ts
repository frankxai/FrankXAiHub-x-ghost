/**
 * Blog API client service
 * Handles fetching blog posts from both file-based and Sanity CMS endpoints
 */

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags?: string[];
  featured?: boolean;
  imageUrl?: string;
  aiPersona?: string | null;
  aiPersonaRole?: string | null;
  aiPersonaColor?: string | null;
}

// Fetch from file-based system
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog-posts');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts from file system');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from file system:', error);
    return [];
  }
}

// Fetch from Sanity CMS
export async function fetchSanityBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts from Sanity CMS');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from Sanity CMS:', error);
    return [];
  }
}

// Fetch from both sources and combine results
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const [filePosts, sanityPosts] = await Promise.all([
      fetchBlogPosts(),
      fetchSanityBlogPosts()
    ]);
    
    // Create a map to deduplicate posts by ID
    const postsMap = new Map<number, BlogPost>();
    
    // Prioritize file-based system for duplicates
    filePosts.forEach(post => postsMap.set(post.id, post));
    sanityPosts.forEach(post => {
      if (!postsMap.has(post.id)) {
        postsMap.set(post.id, post);
      }
    });
    
    return Array.from(postsMap.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Fetch featured posts from both sources
export async function fetchFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const [fileFeatures, sanityFeatures] = await Promise.all([
      fetch('/api/blog-posts/featured').then(r => r.ok ? r.json() : []),
      fetch('/api/blog/featured').then(r => r.ok ? r.json() : [])
    ]);
    
    // Create a map to deduplicate posts by ID
    const postsMap = new Map<number, BlogPost>();
    
    // Prioritize file-based system for duplicates
    fileFeatures.forEach((post: BlogPost) => postsMap.set(post.id, post));
    sanityFeatures.forEach((post: BlogPost) => {
      if (!postsMap.has(post.id)) {
        postsMap.set(post.id, post);
      }
    });
    
    return Array.from(postsMap.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

// Fetch a blog post by ID
export async function fetchBlogPostById(id: number): Promise<BlogPost | null> {
  try {
    // Try file-based system first
    const fileResponse = await fetch(`/api/blog-posts/${id}`);
    if (fileResponse.ok) {
      return await fileResponse.json();
    }
    
    // If not found, try Sanity CMS
    const sanityResponse = await fetch(`/api/blog/${id}`);
    if (sanityResponse.ok) {
      return await sanityResponse.json();
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
}

// Fetch a blog post by slug
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Try file-based system first
    const fileResponse = await fetch(`/api/blog-posts/slug/${slug}`);
    if (fileResponse.ok) {
      return await fileResponse.json();
    }
    
    // If not found, try Sanity CMS
    const sanityResponse = await fetch(`/api/blog/slug/${slug}`);
    if (sanityResponse.ok) {
      return await sanityResponse.json();
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

// Fetch posts by category from both sources
export async function fetchPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const [filePosts, sanityPosts] = await Promise.all([
      fetch(`/api/blog-posts?category=${encodeURIComponent(category)}`).then(r => r.ok ? r.json() : []),
      fetch(`/api/blog?category=${encodeURIComponent(category)}`).then(r => r.ok ? r.json() : [])
    ]);
    
    // Create a map to deduplicate posts by ID
    const postsMap = new Map<number, BlogPost>();
    
    // Prioritize file-based system for duplicates
    filePosts.forEach((post: BlogPost) => postsMap.set(post.id, post));
    sanityPosts.forEach((post: BlogPost) => {
      if (!postsMap.has(post.id)) {
        postsMap.set(post.id, post);
      }
    });
    
    return Array.from(postsMap.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error(`Error fetching posts with category ${category}:`, error);
    return [];
  }
}