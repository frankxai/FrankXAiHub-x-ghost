import GhostContentAPI from '@tryghost/content-api';
import { BlogPost, InsertBlogPost } from '@shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ghost CMS API configuration
const ghostAPI = new GhostContentAPI({
  url: process.env.GHOST_URL || '',
  key: process.env.GHOST_CONTENT_API_KEY || '',
  version: 'v5.0'
});

/**
 * Transform a Ghost post into our app's BlogPost type
 */
const transformGhostPost = (post: any): BlogPost => {
  const readTime = Math.ceil(post.reading_time) || 5; // Default to 5 minutes if not available
  
  // Extract tags as an array of strings
  const tags = post.tags ? post.tags.map((tag: any) => tag.name) : [];
  
  return {
    id: parseInt(post.id) || 0,
    title: post.title,
    excerpt: post.excerpt || post.custom_excerpt || post.meta_description || '',
    content: post.html,
    imageUrl: post.feature_image || undefined,
    category: post.primary_tag ? post.primary_tag.name : 'Uncategorized',
    authorName: post.primary_author ? post.primary_author.name : 'Anonymous',
    publishedAt: new Date(post.published_at || post.created_at),
    readTime,
    tags,
    featured: post.featured || false,
    slug: post.slug,
    // Default AI persona details if not available
    aiPersona: "Frank Riemer",
    aiPersonaRole: "AI Visionary",
    aiPersonaColor: "#00C2FF",
  };
};

/**
 * Get all blog posts from Ghost CMS
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await ghostAPI.posts.browse({
      limit: 'all',
      include: ['tags', 'authors'],
    });
    
    return posts.map(transformGhostPost);
  } catch (error) {
    console.error('Error fetching posts from Ghost CMS:', error);
    return [];
  }
}

/**
 * Get a single blog post by ID from Ghost CMS
 */
export async function getBlogPost(id: number): Promise<BlogPost | undefined> {
  try {
    // Ghost uses string IDs, but our system uses numbers
    const idStr = id.toString();
    
    const post = await ghostAPI.posts.read({
      id: idStr,
      include: ['tags', 'authors'],
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
  try {
    const post = await ghostAPI.posts.read({
      slug,
      include: ['tags', 'authors'],
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
  try {
    const posts = await ghostAPI.posts.browse({
      filter: 'featured:true',
      limit: 'all',
      include: ['tags', 'authors'],
    });
    
    return posts.map(transformGhostPost);
  } catch (error) {
    console.error('Error fetching featured posts from Ghost CMS:', error);
    return [];
  }
}

/**
 * Get blog posts by category from Ghost CMS
 * Note: In Ghost, categories are implemented as tags
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const posts = await ghostAPI.posts.browse({
      filter: `tag:${category}`,
      limit: 'all',
      include: ['tags', 'authors'],
    });
    
    return posts.map(transformGhostPost);
  } catch (error) {
    console.error(`Error fetching posts with category ${category} from Ghost CMS:`, error);
    return [];
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
  throw new Error('Creating posts directly in Ghost CMS requires the Admin API - not implemented');
}

/**
 * Placeholder for updating a blog post in Ghost CMS
 * This would require the Ghost Admin API
 */
export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
  throw new Error('Updating posts directly in Ghost CMS requires the Admin API - not implemented');
}

/**
 * Placeholder for deleting a blog post in Ghost CMS
 * This would require the Ghost Admin API
 */
export async function deleteBlogPost(id: number): Promise<boolean> {
  throw new Error('Deleting posts directly in Ghost CMS requires the Admin API - not implemented');
}