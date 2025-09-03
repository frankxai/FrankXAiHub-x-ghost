import * as blogStorage from "./blog-storage";

/**
 * Clean up duplicate blog posts and reset to a reasonable number
 */
export async function cleanupBlogPosts(): Promise<void> {
  console.log("Starting blog cleanup process...");
  
  const allPosts = await blogStorage.getAllBlogPosts();
  console.log(`Found ${allPosts.length} total posts`);
  
  // Keep only the first 20 unique posts (based on title)
  const uniquePosts = [];
  const seenTitles = new Set();
  
  for (const post of allPosts) {
    if (!seenTitles.has(post.title) && uniquePosts.length < 20) {
      seenTitles.add(post.title);
      uniquePosts.push(post);
    }
  }
  
  console.log(`Keeping ${uniquePosts.length} unique posts`);
  
  // Delete posts that are not in our keep list
  const keepIds = new Set(uniquePosts.map(p => p.id));
  
  for (const post of allPosts) {
    if (!keepIds.has(post.id)) {
      await blogStorage.deleteBlogPost(post.id);
      console.log(`Deleted duplicate post: ${post.title} (ID: ${post.id})`);
    }
  }
  
  console.log("Blog cleanup completed!");
}