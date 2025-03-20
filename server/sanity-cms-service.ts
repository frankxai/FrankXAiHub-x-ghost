import { createClient } from '@sanity/client';
import { BlogPost, InsertBlogPost } from '../shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Sanity CMS client setup
let sanityClient: ReturnType<typeof createClient> | null = null;

if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_DATASET || !process.env.SANITY_API_TOKEN) {
  throw new Error('Missing required Sanity environment variables');
}

sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

console.log('Sanity CMS API client initialized');

/**
 * Transform a Sanity post into our app's BlogPost type
 */
const transformSanityPost = (post: any): BlogPost => {
  return {
    id: parseInt(post._id) || 0,
    title: post.title,
    slug: post.slug?.current || '',
    content: post.content || '',
    excerpt: post.excerpt || '',
    authorName: post.author?.name || 'Unknown',
    publishedAt: post.publishedAt || post._createdAt,
    readTime: Math.ceil((post.content?.length || 0) / 1500) || 5, // Estimate reading time
    category: post.category || 'General',
    tags: post.tags || [],
    featured: post.featured || false,
    imageUrl: post.mainImage?.asset?.url || '',
    // Add required fields with default values
    aiPersona: null,
    aiPersonaRole: null,
    aiPersonaColor: null
  };
};

/**
 * Get all blog posts from Sanity CMS
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!sanityClient) {
    console.warn('Sanity CMS API client not initialized, unable to fetch posts');
    return [];
  }

  try {
    const query = `*[_type == "post"] {
      _id,
      title,
      "slug": slug.current,
      content,
      excerpt,
      "author": author->{name},
      publishedAt,
      _createdAt,
      category,
      tags,
      featured,
      "mainImage": mainImage.asset->url
    }`;
    
    const posts = await sanityClient.fetch(query);
    return posts.map(transformSanityPost);
  } catch (error) {
    console.error('Error fetching posts from Sanity CMS:', error);
    throw error;
  }
}

/**
 * Get a single blog post by ID from Sanity CMS
 */
export async function getBlogPost(id: number): Promise<BlogPost | undefined> {
  if (!sanityClient) {
    console.warn('Sanity CMS API client not initialized, unable to fetch post');
    return undefined;
  }
  
  try {
    const query = `*[_type == "post" && _id == $id][0] {
      _id,
      title,
      "slug": slug.current,
      content,
      excerpt,
      "author": author->{name},
      publishedAt,
      _createdAt,
      category,
      tags,
      featured,
      "mainImage": mainImage.asset->url
    }`;
    
    const post = await sanityClient.fetch(query, { id: id.toString() });
    if (!post) return undefined;
    
    return transformSanityPost(post);
  } catch (error) {
    console.error(`Error fetching post with ID ${id} from Sanity CMS:`, error);
    return undefined;
  }
}

/**
 * Get a blog post by slug from Sanity CMS
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!sanityClient) {
    console.warn('Sanity CMS API client not initialized, unable to fetch post by slug');
    return undefined;
  }
  
  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      content,
      excerpt,
      "author": author->{name},
      publishedAt,
      _createdAt,
      category,
      tags,
      featured,
      "mainImage": mainImage.asset->url
    }`;
    
    const post = await sanityClient.fetch(query, { slug });
    if (!post) return undefined;
    
    return transformSanityPost(post);
  } catch (error) {
    console.error(`Error fetching post with slug ${slug} from Sanity CMS:`, error);
    return undefined;
  }
}

/**
 * Get featured blog posts from Sanity CMS
 */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  if (!sanityClient) {
    console.warn('Sanity CMS API client not initialized, unable to fetch featured posts');
    return [];
  }
  
  try {
    const query = `*[_type == "post" && featured == true] {
      _id,
      title,
      "slug": slug.current,
      content,
      excerpt,
      "author": author->{name},
      publishedAt,
      _createdAt,
      category,
      tags,
      featured,
      "mainImage": mainImage.asset->url
    } | order(publishedAt desc)[0...5]`;
    
    const posts = await sanityClient.fetch(query);
    return posts.map(transformSanityPost);
  } catch (error) {
    console.error('Error fetching featured posts from Sanity CMS:', error);
    throw error;
  }
}

/**
 * Get blog posts by category from Sanity CMS
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  if (!sanityClient) {
    console.warn('Sanity CMS API client not initialized, unable to fetch posts by category');
    return [];
  }
  
  try {
    const query = `*[_type == "post" && category == $category] {
      _id,
      title,
      "slug": slug.current,
      content,
      excerpt,
      "author": author->{name},
      publishedAt,
      _createdAt,
      category,
      tags,
      featured,
      "mainImage": mainImage.asset->url
    } | order(publishedAt desc)`;
    
    const posts = await sanityClient.fetch(query, { category });
    return posts.map(transformSanityPost);
  } catch (error) {
    console.error(`Error fetching posts with category ${category} from Sanity CMS:`, error);
    throw error;
  }
}

/**
 * Create a new blog post in Sanity CMS
 * Note: This requires a token with write permissions
 */
export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
  if (!sanityClient) {
    throw new Error('Sanity CMS API client not initialized');
  }
  
  try {
    // Convert our post structure to Sanity document structure
    const sanityPost = {
      _type: 'post',
      title: post.title,
      slug: {
        _type: 'slug',
        current: post.slug
      },
      content: post.content,
      excerpt: post.excerpt,
      author: {
        _type: 'reference',
        _ref: 'author-defaultAuthor' // You'll need to create this reference in Sanity Studio
      },
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
      category: post.category,
      tags: post.tags || [],
      featured: post.featured || false,
      mainImage: post.imageUrl ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: `image-${post.imageUrl.split('-')[1]}` // This assumes URL has a format with the image ID
        }
      } : undefined
    };
    
    const createdPost = await sanityClient.create(sanityPost);
    return transformSanityPost(createdPost);
  } catch (error) {
    console.error('Error creating post in Sanity CMS:', error);
    throw error;
  }
}

/**
 * Update a blog post in Sanity CMS
 * Note: This requires a token with write permissions
 */
export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
  if (!sanityClient) {
    throw new Error('Sanity CMS API client not initialized');
  }
  
  try {
    // First check if post exists
    const existingPost = await getBlogPost(id);
    if (!existingPost) {
      return undefined;
    }
    
    // Prepare update object
    const updates: any = { 
      _type: 'post',
    };
    
    if (post.title) updates.title = post.title;
    if (post.slug) updates.slug = { _type: 'slug', current: post.slug };
    if (post.content) updates.content = post.content;
    if (post.excerpt) updates.excerpt = post.excerpt;
    if (post.category) updates.category = post.category;
    if (post.tags) updates.tags = post.tags;
    if (post.featured !== undefined) updates.featured = post.featured;
    if (post.publishedAt) updates.publishedAt = new Date(post.publishedAt).toISOString();
    
    // Update the post
    const updatedPost = await sanityClient.patch(id.toString()).set(updates).commit();
    return transformSanityPost(updatedPost);
  } catch (error) {
    console.error(`Error updating post with ID ${id} in Sanity CMS:`, error);
    throw error;
  }
}

/**
 * Delete a blog post in Sanity CMS
 * Note: This requires a token with write permissions
 */
export async function deleteBlogPost(id: number): Promise<boolean> {
  if (!sanityClient) {
    throw new Error('Sanity CMS API client not initialized');
  }
  
  try {
    // First check if post exists
    const existingPost = await getBlogPost(id);
    if (!existingPost) {
      return false;
    }
    
    // Delete the post
    await sanityClient.delete(id.toString());
    return true;
  } catch (error) {
    console.error(`Error deleting post with ID ${id} from Sanity CMS:`, error);
    throw error;
  }
}