import { Express, Request, Response } from 'express';
import * as ghostCmsService from '../ghost-cms-service';
import { insertBlogPostSchema } from '../../shared/schema';
import { z } from 'zod';

/**
 * Register Ghost blog routes
 */
export function registerGhostBlogRoutes(app: Express) {
  const routePrefix = '/api/ghost/blog-posts';

  // Get all blog posts
  app.get(routePrefix, async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;

      if (category) {
        const posts = await ghostCmsService.getBlogPostsByCategory(category);
        res.json(posts);
      } else {
        const posts = await ghostCmsService.getAllBlogPosts();
        res.json(posts);
      }
    } catch (error) {
      console.error('Error fetching posts from Ghost CMS:', error);
      res.status(500).json({ 
        message: "Error fetching blog posts from Ghost CMS", 
        error: (error as Error).message 
      });
    }
  });

  // Get featured blog posts
  app.get(`${routePrefix}/featured`, async (req: Request, res: Response) => {
    try {
      const posts = await ghostCmsService.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching featured posts from Ghost CMS:', error);
      res.status(500).json({ 
        message: "Error fetching featured blog posts from Ghost CMS", 
        error: (error as Error).message 
      });
    }
  });

  // Get blog post by ID
  app.get(`${routePrefix}/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }

      const post = await ghostCmsService.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error(`Error fetching post from Ghost CMS:`, error);
      res.status(500).json({ 
        message: "Error fetching blog post from Ghost CMS", 
        error: (error as Error).message 
      });
    }
  });

  // Get blog post by slug
  app.get(`${routePrefix}/slug/:slug`, async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const post = await ghostCmsService.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error(`Error fetching post by slug from Ghost CMS:`, error);
      res.status(500).json({ 
        message: "Error fetching blog post from Ghost CMS", 
        error: (error as Error).message 
      });
    }
  });

  // Create a new blog post (admin API not implemented)
  app.post(routePrefix, async (req: Request, res: Response) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      
      // Note: This will throw an error since Ghost Admin API is not implemented
      const newPost = await ghostCmsService.createBlogPost(validatedData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else {
        res.status(500).json({ 
          message: "Error creating blog post in Ghost CMS", 
          error: (error as Error).message 
        });
      }
    }
  });

  // Update a blog post (admin API not implemented)
  app.patch(`${routePrefix}/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }

      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      
      // Note: This will throw an error since Ghost Admin API is not implemented
      const updatedPost = await ghostCmsService.updateBlogPost(id, validatedData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else {
        res.status(500).json({ 
          message: "Error updating blog post in Ghost CMS", 
          error: (error as Error).message 
        });
      }
    }
  });

  // Delete a blog post (admin API not implemented)
  app.delete(`${routePrefix}/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      // Note: This will throw an error since Ghost Admin API is not implemented
      const success = await ghostCmsService.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ 
        message: "Error deleting blog post from Ghost CMS", 
        error: (error as Error).message 
      });
    }
  });
}