import { Express, Request, Response } from 'express';
import * as ghostCMS from '../ghost-cms-service';
import { insertBlogPostSchema } from '@shared/schema';
import { z } from 'zod';

export function registerGhostBlogRoutes(app: Express) {
  // Prefix for Ghost CMS routes to differentiate them from the regular blog routes
  const routePrefix = '/api/ghost/blog-posts';

  // Get all blog posts from Ghost
  app.get(routePrefix, async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const posts = await ghostCMS.getBlogPostsByCategory(category);
        res.json(posts);
      } else {
        const posts = await ghostCMS.getAllBlogPosts();
        res.json(posts);
      }
    } catch (error) {
      console.error('Error fetching blog posts from Ghost CMS:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts from Ghost CMS' });
    }
  });

  // Get featured blog posts from Ghost
  app.get(`${routePrefix}/featured`, async (req: Request, res: Response) => {
    try {
      const posts = await ghostCMS.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching featured blog posts from Ghost CMS:', error);
      res.status(500).json({ error: 'Failed to fetch featured blog posts from Ghost CMS' });
    }
  });

  // Get a single blog post by ID from Ghost
  app.get(`${routePrefix}/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const post = await ghostCMS.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found in Ghost CMS' });
      }
      
      res.json(post);
    } catch (error) {
      console.error(`Error fetching blog post with ID ${req.params.id} from Ghost CMS:`, error);
      res.status(500).json({ error: 'Failed to fetch blog post from Ghost CMS' });
    }
  });

  // Get a blog post by slug from Ghost
  app.get(`${routePrefix}/slug/:slug`, async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const post = await ghostCMS.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found in Ghost CMS' });
      }
      
      res.json(post);
    } catch (error) {
      console.error(`Error fetching blog post with slug ${req.params.slug} from Ghost CMS:`, error);
      res.status(500).json({ error: 'Failed to fetch blog post from Ghost CMS' });
    }
  });
  
  // The following endpoints would require the Ghost Admin API (placeholder routes)
  
  // Create blog post - This would require Ghost Admin API
  app.post(routePrefix, async (req: Request, res: Response) => {
    res.status(501).json({ error: 'Creating posts directly in Ghost CMS requires the Admin API - not implemented' });
  });
  
  // Update blog post - This would require Ghost Admin API
  app.patch(`${routePrefix}/:id`, async (req: Request, res: Response) => {
    res.status(501).json({ error: 'Updating posts directly in Ghost CMS requires the Admin API - not implemented' });
  });
  
  // Delete blog post - This would require Ghost Admin API
  app.delete(`${routePrefix}/:id`, async (req: Request, res: Response) => {
    res.status(501).json({ error: 'Deleting posts directly in Ghost CMS requires the Admin API - not implemented' });
  });
}