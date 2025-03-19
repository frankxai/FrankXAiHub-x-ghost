import GhostContentAPI from '@tryghost/content-api';
import { BlogPost, InsertBlogPost } from '../shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ghost CMS API client setup
let ghostApi: ReturnType<typeof GhostContentAPI> | null = null;

try {
  if (process.env.GHOST_API_KEY && process.env.GHOST_API_URL) {
    ghostApi = GhostContentAPI({
      url: process.env.GHOST_API_URL,
      key: process.env.GHOST_API_KEY,
      version: 'v5.0'
    });
    console.log('Ghost CMS API client initialized successfully');
  } else {
    console.warn('Ghost CMS API credentials not found in environment variables');
  }
} catch (error) {
  console.error('Failed to initialize Ghost CMS API client:', error);
}

/**
 * Transform a Ghost post into our app's BlogPost type
 */
const transformGhostPost = (post: any): BlogPost => {
  return {
    id: parseInt(post.id) || 0,
    title: post.title,
    slug: post.slug,
    content: post.html || post.content || '',
    excerpt: post.excerpt || post.meta_description || '',
    authorName: post.primary_author?.name || 'Unknown',
    publishedAt: new Date(post.published_at || post.created_at),
    readTime: Math.ceil((post.html?.length || 0) / 1500) || 5, // Estimate reading time
    category: post.primary_tag?.name || 'General',
    tags: post.tags?.map((tag: any) => tag.name) || [],
    featured: post.featured || false,
    imageUrl: post.feature_image || '',
    // Add required fields with default values
    aiPersona: null,
    aiPersonaRole: null,
    aiPersonaColor: null
  };
};

/**
 * Get all blog posts from Ghost CMS
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!ghostApi) {
    console.warn('Ghost CMS API client not initialized, unable to fetch posts');
    return [];
  }

  try {
    const posts = await ghostApi.posts.browse({
      limit: 'all',
      include: ['tags', 'authors']
    });
    
    return posts.map(transformGhostPost);
  } catch (error) {
    console.error('Error fetching posts from Ghost CMS:', error);
    throw error;
  }
}

/**
 * Get a single blog post by ID from Ghost CMS
 */
export async function getBlogPost(id: number): Promise<BlogPost | undefined> {
  if (!ghostApi) {
    console.warn('Ghost CMS API client not initialized, unable to fetch post');
    return undefined;
  }
  
  try {
    const post = await ghostApi.posts.read({
      id: id.toString(),
      include: ['tags', 'authors']
    });
    
    return transformGhostPost(post);
  } catch (error) {
    console.error(`Error fetching post with ID ${id} from Ghost CMS:`, error);
    return undefined;
  }
}

/**
 * Get a blog post by slug from Ghost CMS
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!ghostApi) {
    console.warn('Ghost CMS API client not initialized, unable to fetch post by slug');
    return undefined;
  }
  
  try {
    const post = await ghostApi.posts.read({
      slug,
      include: ['tags', 'authors']
    });
    
    return transformGhostPost(post);
  } catch (error) {
    console.error(`Error fetching post with slug ${slug} from Ghost CMS:`, error);
    return undefined;
  }
}

/**
 * Get featured blog posts from Ghost CMS
 */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  if (!ghostApi) {
    console.warn('Ghost CMS API client not initialized, unable to fetch featured posts');
    return [];
  }
  
  try {
    const posts = await ghostApi.posts.browse({
      filter: 'featured:true',
      include: ['tags', 'authors'],
      limit: 5
    });
    
    return posts.map(transformGhostPost);
  } catch (error) {
    console.error('Error fetching featured posts from Ghost CMS:', error);
    throw error;
  }
}

/**
 * Get blog posts by category from Ghost CMS
 * Note: In Ghost, categories are implemented as tags
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  if (!ghostApi) {
    console.warn('Ghost CMS API client not initialized, unable to fetch posts by category');
    return [];
  }
  
  try {
    const posts = await ghostApi.posts.browse({
      filter: `tag:${category}`,
      include: ['tags', 'authors']
    });
    
    return posts.map(transformGhostPost);
  } catch (error) {
    console.error(`Error fetching posts with category ${category} from Ghost CMS:`, error);
    throw error;
  }
}

/**
 * NOTE: The following functions for creating, updating and deleting posts
 * require the Ghost Admin API, which is different from the Content API.
 * 
 * These functions would need a separate Admin API implementation,
 * which is not included in the current setup.
 */

/**
 * Placeholder for creating a new blog post in Ghost CMS
 * This would require the Ghost Admin API
 */
export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
  throw new Error('Creating blog posts in Ghost CMS requires the Admin API, which is not implemented');
}

/**
 * Placeholder for updating a blog post in Ghost CMS
 * This would require the Ghost Admin API
 */
export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
  throw new Error('Updating blog posts in Ghost CMS requires the Admin API, which is not implemented');
}

/**
 * Placeholder for deleting a blog post in Ghost CMS
 * This would require the Ghost Admin API
 */
export async function deleteBlogPost(id: number): Promise<boolean> {
  throw new Error('Deleting blog posts in Ghost CMS requires the Admin API, which is not implemented');
}