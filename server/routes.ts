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
import { getCompletion, streamCompletion, createSystemPrompt } from "./ai-service";
import { AICompletionRequest, AICompletionResponse, AIPersona, AI_PERSONAS, PROMPT_TEMPLATES } from "@shared/ai-services";
import { log } from "./vite";

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
  
  app.post("/api/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating resource" });
      }
    }
  });
  
  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteResource(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting resource" });
    }
  });
  
  // Affiliate tracking endpoint
  app.post("/api/track-affiliate", async (req, res) => {
    try {
      const { resourceId, affiliateCode } = req.body;
      
      // In a real implementation, you would:
      // 1. Record the affiliate click in the database
      // 2. Associate with user session if available
      
      // For now, just log it
      console.log(`Tracked affiliate click: ${resourceId}, code: ${affiliateCode}`);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error tracking affiliate" });
    }
  });
  
  // Download tracking endpoint
  app.post("/api/track-download", async (req, res) => {
    try {
      const { resourceId } = req.body;
      await storage.incrementResourceDownloads(resourceId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error tracking download" });
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

  // AI Roadmap generation with real AI integration
  app.post("/api/generate-roadmap", async (req, res) => {
    try {
      const { industry, objectives, organizationName, size } = req.body;
      
      // Try to use AI to generate a more tailored roadmap if API keys are available
      try {
        // Create a detailed prompt for the AI
        const prompt = `
Create a comprehensive AI implementation roadmap for ${organizationName || 'an organization'} in the ${industry || 'technology'} industry with size: ${size || 'medium'}.

Their key objectives are: ${objectives ? objectives.join(', ') : 'improving efficiency and innovation'}.

Create a structured 3-phase implementation plan with:
1. Clear phase titles with timeframes
2. Detailed description for each phase
3. Specific actionable steps for each phase
4. Considerations specific to their industry and size
5. Key success metrics to track

Format the response as JSON with this structure:
{
  "phases": [
    {
      "title": "Phase name with timeframe",
      "description": "Detailed phase description",
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "industry": "The industry name",
  "tailoredFor": ["Objective 1", "Objective 2"]
}
`;

        // Make the AI request
        const completion = await getCompletion({
          messages: [
            { role: 'system', content: 'You are an AI implementation expert that creates detailed, practical roadmaps for organizations. Respond only with JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          provider: 'openai'
        });
        
        // Try to parse the JSON response
        try {
          const aiRoadmap = JSON.parse(completion.text);
          return res.json(aiRoadmap);
        } catch (parseError) {
          log(`Error parsing AI roadmap response: ${parseError}`, 'error');
          throw new Error('Invalid AI response format');
        }
      } catch (aiError) {
        log(`AI roadmap generation failed, falling back to template: ${aiError}`, 'warn');
        
        // Fallback to the template response if AI fails
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
      }
    } catch (error) {
      res.status(500).json({ message: "Error generating roadmap" });
    }
  });
  
  // AI Services endpoints
  
  // Get AI completion
  app.post("/api/ai/completion", async (req, res) => {
    try {
      const request: AICompletionRequest = req.body;
      
      if (!request.messages || request.messages.length === 0) {
        return res.status(400).json({ message: "Messages are required" });
      }
      
      // Generate a completion
      const completion = await getCompletion(request);
      res.json(completion);
    } catch (error) {
      log(`Error in AI completion: ${error}`, 'error');
      res.status(500).json({ message: "Error generating AI completion" });
    }
  });

  // Stream AI completion
  app.post("/api/ai/stream-completion", async (req, res) => {
    try {
      const request: AICompletionRequest = req.body;
      
      if (!request.messages || request.messages.length === 0) {
        return res.status(400).json({ message: "Messages are required" });
      }
      
      // Set up SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Stream the completion
      const stream = streamCompletion({...request, stream: true});
      
      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        
        if (chunk.isComplete) {
          res.write(`data: [DONE]\n\n`);
          break;
        }
      }
      
      res.end();
    } catch (error) {
      log(`Error in AI stream completion: ${error}`, 'error');
      res.status(500).json({ message: "Error streaming AI completion" });
    }
  });

  // Get AI Personas
  app.get("/api/ai/personas", (req, res) => {
    try {
      res.json(Object.values(AI_PERSONAS));
    } catch (error) {
      res.status(500).json({ message: "Error fetching AI personas" });
    }
  });

  // Get Prompt Templates
  app.get("/api/ai/prompt-templates", (req, res) => {
    try {
      res.json(PROMPT_TEMPLATES);
    } catch (error) {
      res.status(500).json({ message: "Error fetching prompt templates" });
    }
  });

  // Get specific prompt template
  app.get("/api/ai/prompt-templates/:id", (req, res) => {
    try {
      const templateId = req.params.id;
      const template = PROMPT_TEMPLATES.find(t => t.id === templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Prompt template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Error fetching prompt template" });
    }
  });

  // Create conversation with AI character
  app.post("/api/ai/conversation", async (req, res) => {
    try {
      const { characterName, message, conversationId } = req.body;
      
      if (!characterName || !message) {
        return res.status(400).json({ message: "Character name and message are required" });
      }
      
      // Find the character's persona
      const persona = AI_PERSONAS[characterName] || {
        name: characterName,
        systemPrompt: createSystemPrompt(characterName),
        provider: 'openai'
      };
      
      // Create the completion request
      const request: AICompletionRequest = {
        messages: [
          { role: 'system', content: persona.systemPrompt },
          { role: 'user', content: message }
        ],
        provider: persona.provider,
        model: persona.model
      };
      
      // Generate the completion
      const completion = await getCompletion(request);
      
      res.json({
        characterName,
        message: completion.text,
        conversationId: conversationId || Date.now().toString(),
        model: completion.model
      });
    } catch (error) {
      log(`Error in AI conversation: ${error}`, 'error');
      res.status(500).json({ message: "Error generating AI conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
