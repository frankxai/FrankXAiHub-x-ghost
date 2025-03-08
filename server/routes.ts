import type { Express } from "express";
import { createServer, type Server as HTTPServer } from "http";
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
import * as blogStorage from "./blog-storage";
import { Router } from "express";
import AIEmbeddings from "./routes/embeddings";
import AICompletion from "./routes/completion";
import convertRouter from "./routes/convert";
import agentManagementRouter from "./routes/agent-management";
import conversationRouter from "./routes/conversation";
import agentPersonasRouter from "./routes/agent-personas";
import { registerAgentRoutes } from "./routes/agent-routes";
import { registerAIConfigRoutes } from "./routes/ai-config-routes";
import { advancedAgentPersonas } from './agent-framework/advanced-agent-personas';
import { AI_MODELS } from '../shared/ai-models-config';


export async function registerRoutes(app: Express): Promise<HTTPServer> {
  const router = Router();

  // API routes with /api prefix

  // Blog Posts endpoints - Using file-based storage
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;

      if (category) {
        const posts = await blogStorage.getBlogPostsByCategory(category);
        res.json(posts);
      } else {
        const posts = await blogStorage.getAllBlogPosts();
        res.json(posts);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });

  app.get("/api/blog-posts/featured", async (req, res) => {
    try {
      const posts = await blogStorage.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured blog posts" });
    }
  });

  // Create a prompt engineering collaborative blog post
  app.post("/api/collaborative-blog-posts/create-prompt-engineering", async (req, res) => {
    try {
      const now = new Date();

      const newPost = {
        id: 0, // Will be assigned by storage
        title: "The Art of Prompt Engineering: Creating AI Communication Excellence",
        slug: "art-of-prompt-engineering-ai-communication-excellence",
        aiPersona: "AIArchitect",
        aiPersonaRole: "AI Systems Architect",
        aiPersonaColor: "#4a90e2",
        content: `# The Art of Prompt Engineering: Creating AI Communication Excellence

## Introduction: Why Prompt Engineering Matters

In the rapidly evolving landscape of AI technology, the ability to effectively communicate with AI systems has become a critical skill. Prompt engineering—the art and science of crafting inputs to generate optimal AI outputs—stands at the forefront of this interaction revolution.

This guide explores the nuanced craft of prompt engineering, providing you with practical techniques to enhance your AI communication skills and achieve exceptional results across various applications.

## The Fundamental Principles of Effective Prompts

### Clarity and Specificity

The cornerstone of effective prompt engineering is precise communication. When interacting with AI systems, ambiguity leads to unpredictable results.

**Key techniques for enhancing clarity:**

1. **Define the context explicitly** - Provide necessary background information that frames the request
2. **Specify the desired output format** - Indicate whether you need paragraphs, bullet points, tables, or code
3. **Include relevant constraints** - Mention word limits, complexity level, or target audience

### Example: Transforming Vague Prompts

\`\`\`
Vague: "Tell me about renewable energy."

Specific: "Provide a 300-word explanation of how solar photovoltaic technology works, including its efficiency rates and cost factors. Include a brief comparison with wind energy. Target the explanation for an audience with basic technical knowledge."
\`\`\`

### The Role Structure Plays

Structured prompts lead to structured responses. Incorporating organizational elements in your prompt signals to the AI how to arrange information in its output.

**Effective structural techniques:**

* **Numbered lists** - "Provide 5 strategies for..."
* **Sequential instructions** - "First explain X, then analyze Y, and conclude with Z"
* **Sections with headers** - "Divide the response into three sections: Background, Current Applications, and Future Potential"

## Advanced Techniques for Complex Tasks

### Role and Perspective Prompting

One of the most powerful techniques in prompt engineering is assigning a specific role or perspective to the AI. This approach leverages the model's ability to adapt its response style and content focus based on the assigned identity.

**Implementation strategies:**

\`\`\`
"As an experienced financial analyst, evaluate the potential impact of rising interest rates on the technology sector over the next 12 months."

"Taking the perspective of a cybersecurity expert, identify the three most critical vulnerabilities in cloud computing infrastructure and recommend mitigation strategies."
\`\`\`

### Chain-of-Thought Prompting

For complex reasoning tasks, guiding the AI through a step-by-step thinking process significantly improves the quality of the result.

**Example application:**

\`\`\`
"Let's solve this optimization problem systematically:
1. First, identify the key variables and constraints
2. Then, express the objective function mathematically
3. Next, determine the appropriate optimization method
4. Finally, solve the problem and interpret the results"
\`\`\`

## Domain-Specific Prompt Engineering

### Programming and Code Generation

When working with AI for code generation, prompt engineering requires particular attention to technical detail and documentation practices.

**Best practices:**

1. **Specify language and dependencies** - Clearly state which programming language, frameworks, or libraries should be used
2. **Define input/output requirements** - Detail the expected inputs and desired outputs
3. **Request documentation** - Ask for comments or docstrings that explain the code's functionality
4. **Include error handling expectations** - Specify how edge cases should be managed

**Example prompt:**

\`\`\`
"Write a Python function using TensorFlow that implements a simple image classification neural network. The function should:
- Accept an input parameter for the number of classes
- Use a pre-trained MobileNetV2 as the base model
- Add appropriate dense layers for classification
- Include dropout for regularization
- Return the compiled model

Include comprehensive docstrings and comments explaining the architectural decisions."
\`\`\`

### Creative Content Generation

For creative tasks, effective prompts balance guidance with space for creativity.

**Strategies for creative prompts:**

* **Establish tone and style** - "Write in the style of Ernest Hemingway..."
* **Provide contextual elements** - "Set in a futuristic underwater city..."
* **Balance constraints with freedom** - "Include these three elements, but feel free to develop the narrative as you see fit"

## Iterative Refinement: The Feedback Loop

Prompt engineering is rarely a one-shot process. The most effective approach involves:

1. **Start with a base prompt**
2. **Evaluate the response**
3. **Refine the prompt based on results**
4. **Repeat until satisfied**

### Example of Iterative Refinement

**Initial prompt:** "Explain quantum computing."

**Refined prompt:** "Explain quantum computing principles to a high school student, focusing on superposition and entanglement. Use everyday analogies and limit technical jargon."

**Further refined:** "Create an engaging 5-minute script explaining quantum computing to high school students. Focus on superposition and entanglement using the analogy of a coin spin versus a coin flip. Include three simple thought experiments that demonstrate why quantum computing is more powerful than classical computing for certain problems."

## Ethical Considerations in Prompt Engineering

Responsible prompt engineering includes awareness of potential biases, factual accuracy, and appropriate use cases. When crafting prompts:

* Avoid leading questions that might introduce bias
* Request evidence or citations for factual claims
* Consider the ethical implications of the generated content

## Conclusion: Developing Your Prompt Engineering Skills

Becoming a skilled prompt engineer requires practice, experimentation, and continuous learning. As AI capabilities evolve, so too will the techniques for effective communication.

By understanding the principles outlined in this guide and deliberately practicing the art of prompt crafting, you'll develop an invaluable skill that enhances your ability to leverage AI systems for both professional and personal applications.`,
        excerpt: "Master the art and science of prompt engineering to achieve exceptional results from AI systems across various applications. Learn proven strategies, advanced techniques, and ethical considerations for optimum AI communication.",
        authorName: "Frank Riemer",
        publishedAt: now,
        readTime: 12,
        category: "Collaborative AI",
        tags: ["prompt-engineering", "ai-communication", "collaborative"],
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1655720033654-a4239dd42d10?q=80&w=1932&auto=format&fit=crop"
      };

      const createdPost = await blogStorage.createBlogPost(newPost);
      res.status(201).json(createdPost);
    } catch (error) {
      console.error('Error creating prompt engineering post:', error);
      res.status(500).json({ message: "Failed to create prompt engineering post" });
    }
  });

  app.get("/api/blog-posts/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await blogStorage.getBlogPostBySlug(slug);

      if (!post) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await blogStorage.getBlogPost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const newPost = await blogStorage.createBlogPost(validatedData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating blog post" });
      }
    }
  });

  app.patch("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const updatedPost = await blogStorage.updateBlogPost(id, validatedData);

      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating blog post" });
      }
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await blogStorage.deleteBlogPost(id);

      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting blog post" });
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

  // Get available AI models
  app.get("/api/ai/available-models", (req, res) => {
    try {
      res.json(AI_MODELS);
    } catch (error) {
      res.status(500).json({ message: "Error fetching AI models" });
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
      const { characterName, message, conversationId, context } = req.body;

      if (!characterName || !message) {
        return res.status(400).json({ message: "Character name and message are required" });
      }

      // Find the character's persona
      const persona = AI_PERSONAS[characterName] || {
        name: characterName,
        systemPrompt: createSystemPrompt(characterName),
        provider: 'openai'
      };

      // Build system prompt with context if provided
      let systemPrompt = persona.systemPrompt;
      if (context) {
        systemPrompt = `${systemPrompt}\n\nAdditional context: ${context}`;
      }

      // Create the completion request
      const request: AICompletionRequest = {
        messages: [
          { role: 'system', content: systemPrompt },
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


  // Agent personas
  app.get('/api/agent-personas', (req, res) => {
    res.json(agentPersonas);
  });

  // Get AI framework specialist agents
  app.get('/api/agents/framework-specialists', (req, res) => {
    res.json(advancedAgentPersonas);
  });

  // Chat with agent
  app.post('/api/chat-with-agent/:agentId', async (req, res) => {
    try {
      const { agentId } = req.params;
      const { message, conversation, model } = req.body;

      // Find the agent persona - check both standard personas and advanced agents
      let agentPersona = agentPersonas.find(agent => agent.id === agentId);

      // If not found in standard personas, check the advanced ones
      if (!agentPersona) {
        agentPersona = advancedAgentPersonas.find(agent => agent.id === agentId);
      }

      if (!agentPersona) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      // Prepare conversations with system prompt
      const systemMessage = { role: 'system', content: agentPersona.systemPrompt };
      const conversationHistory = conversation || [];

      // Use provided model or fall back to agent's default
      const modelToUse = model || agentPersona.defaultModel || 'gpt-4-turbo-preview';
      const providerToUse = model ? 'openrouter' : (agentPersona.defaultProvider || 'openai');

      console.log(`Using model: ${modelToUse} with provider: ${providerToUse}`);

      // Call AI service to get response
      const aiResponse = await generateAIResponse(
        [systemMessage, ...conversationHistory, { role: 'user', content: message }],
        modelToUse,
        providerToUse
      );

      res.json({ 
        response: aiResponse,
        model: modelToUse,
        provider: providerToUse
      });
    } catch (error) {
      console.error('Error in chat with agent:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  });

  // Initialize sample blog content when server starts
  try {
    blogStorage.initializeWithSampleContent();
    log("Blog storage initialized with sample content", "info");
  } catch (error) {
    log(`Error initializing blog storage: ${error}`, "error");
  }

  // Register agent routes directly on Express app
  registerAgentRoutes(app);
  
  // Register AI configuration routes
  registerAIConfigRoutes(app);

  app.use("/api", router);

  router.use("/embeddings", AIEmbeddings);
  router.use("/completion", AICompletion);
  router.use("/convert", convertRouter);
  router.use("/agent-management", agentManagementRouter);
  router.use("/ai/conversation", conversationRouter);
  router.use("/ai/personas", agentPersonasRouter);

  const httpServer = createServer(app);
  return httpServer;
}