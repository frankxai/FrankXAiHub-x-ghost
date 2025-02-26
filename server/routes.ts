import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertBlogPostSchema,
  insertResourceSchema,
  insertAiCharacterSchema,
  insertMusicSampleSchema,
  insertReadingProgressSchema,
  insertAssessmentSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // Blog Posts endpoints
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  // Resources endpoints
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Error fetching resources" });
    }
  });

  // AI Characters endpoints
  app.get("/api/ai-characters", async (req, res) => {
    try {
      const characters = await storage.getAllAICharacters();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Error fetching AI characters" });
    }
  });

  // Music Samples endpoints
  app.get("/api/music-samples", async (req, res) => {
    try {
      const samples = await storage.getAllMusicSamples();
      res.json(samples);
    } catch (error) {
      res.status(500).json({ message: "Error fetching music samples" });
    }
  });

  // Reading Progress endpoints
  app.post("/api/reading-progress", async (req, res) => {
    try {
      const validatedData = insertReadingProgressSchema.parse(req.body);
      const progressRecord = await storage.updateReadingProgress(validatedData);
      res.json(progressRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating reading progress" });
      }
    }
  });

  app.get("/api/reading-progress/:userId/:postId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const postId = parseInt(req.params.postId);
      const progress = await storage.getReadingProgress(userId, postId);
      res.json(progress || { progress: 0 });
    } catch (error) {
      res.status(500).json({ message: "Error fetching reading progress" });
    }
  });

  // AI Assessment endpoints
  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(validatedData);
      
      // Calculate a mock maturity score and recommendations
      const maturityScore = Math.floor(Math.random() * 41) + 60; // 60-100 range
      const recommendations = [
        "Establish a dedicated AI governance committee",
        "Develop an AI ethics framework",
        "Create a cross-functional AI Center of Excellence",
        "Implement a structured AI project prioritization process",
        "Develop AI skills training programs for employees"
      ];
      
      const updatedAssessment = {
        ...assessment,
        maturityScore,
        recommendations
      };
      
      res.json(updatedAssessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating assessment" });
      }
    }
  });

  // AI Roadmap generation (simplified)
  app.post("/api/generate-roadmap", async (req, res) => {
    try {
      const { industry, objectives } = req.body;
      
      // Just a mock response - in a real implementation this would use more sophisticated logic
      const roadmap = {
        phases: [
          {
            title: "Phase 1: Foundation (1-3 months)",
            description: "Establish governance, identify use cases, and form AI team",
            steps: [
              "Create AI steering committee",
              "Develop AI strategy aligned with business objectives",
              "Identify and prioritize initial AI use cases"
            ]
          },
          {
            title: "Phase 2: Pilot Projects (3-6 months)",
            description: "Implement initial use cases and validate approach",
            steps: [
              "Deploy 2-3 high-value AI pilot projects",
              "Develop AI skills through training and hiring",
              "Establish data governance practices"
            ]
          },
          {
            title: "Phase 3: Scaling (6-12 months)",
            description: "Expand successful pilots and build AI platforms",
            steps: [
              "Scale successful pilot projects across the organization",
              "Implement AI Center of Excellence model",
              "Develop reusable AI assets and platforms"
            ]
          }
        ],
        industry: industry,
        tailoredFor: objectives
      };
      
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ message: "Error generating roadmap" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
