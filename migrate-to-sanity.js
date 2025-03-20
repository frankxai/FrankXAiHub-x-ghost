/**
 * Migration script to export blog posts from file system to Sanity CMS
 * 
 * Usage:
 * 1. Set up Sanity CMS credentials in .env file
 * 2. Run this script: node migrate-to-sanity.js
 * 
 * Requirements:
 * - @sanity/client
 * - dotenv
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
require('dotenv').config();

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-10-21',
  useCdn: false
});

// Read blog posts from file system
async function getBlogPostsFromFileSystem() {
  try {
    // Read blog index file
    const indexPath = path.join(__dirname, 'data', 'blog', 'index.json');
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    
    const posts = [];
    for (const postMeta of index.posts) {
      const postPath = path.join(__dirname, 'data', 'blog', 'posts', `${postMeta.id}.json`);
      
      if (fs.existsSync(postPath)) {
        const postData = JSON.parse(fs.readFileSync(postPath, 'utf8'));
        posts.push(postData);
      }
    }
    
    return posts;
  } catch (error) {
    console.error('Error reading blog posts from file system:', error);
    return [];
  }
}

// Create author document in Sanity if it doesn't exist
async function createAuthorIfNeeded(authorName) {
  const authorId = `author-${authorName.toLowerCase().replace(/\s+/g, '-')}`;
  
  try {
    // Check if author exists
    const existingAuthor = await sanityClient.fetch(
      `*[_type == "author" && _id == $authorId][0]`,
      { authorId }
    );
    
    if (!existingAuthor) {
      console.log(`Creating author: ${authorName}`);
      
      await sanityClient.create({
        _id: authorId,
        _type: 'author',
        name: authorName,
        slug: {
          _type: 'slug',
          current: authorName.toLowerCase().replace(/\s+/g, '-')
        }
      });
    }
    
    return authorId;
  } catch (error) {
    console.error(`Error creating author ${authorName}:`, error);
    return null;
  }
}

// Convert file-based post to Sanity format
async function convertPostToSanityFormat(post) {
  const authorId = await createAuthorIfNeeded(post.authorName);
  
  return {
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
      _ref: authorId
    },
    publishedAt: post.publishedAt,
    category: post.category,
    tags: post.tags || [],
    featured: post.featured || false,
    // If there's an image URL, we would need to handle that separately
    // as Sanity requires images to be uploaded through their asset management
    aiPersona: post.aiPersona,
    aiPersonaRole: post.aiPersonaRole,
    aiPersonaColor: post.aiPersonaColor
  };
}

// Migrate posts to Sanity
async function migratePosts() {
  try {
    const posts = await getBlogPostsFromFileSystem();
    console.log(`Found ${posts.length} posts to migrate`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const post of posts) {
      try {
        const sanityPost = await convertPostToSanityFormat(post);
        
        // Check if post already exists in Sanity by slug
        const existingPost = await sanityClient.fetch(
          `*[_type == "post" && slug.current == $slug][0]`,
          { slug: post.slug }
        );
        
        if (existingPost) {
          console.log(`Post "${post.title}" already exists in Sanity, skipping...`);
          continue;
        }
        
        // Create post in Sanity
        await sanityClient.create(sanityPost);
        console.log(`Migrated post: ${post.title}`);
        migratedCount++;
      } catch (error) {
        console.error(`Error migrating post ${post.title}:`, error);
        errorCount++;
      }
    }
    
    console.log(`
    Migration completed:
    - Total posts found: ${posts.length}
    - Successfully migrated: ${migratedCount}
    - Failed: ${errorCount}
    `);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migratePosts()
  .then(() => console.log('Migration process completed'))
  .catch(error => console.error('Migration process failed:', error));