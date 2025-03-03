import { Express } from 'express';
import { storage } from '../storage';
import { BlogPost, insertBlogPostSchema } from '@shared/schema';
import { z } from 'zod';

export function registerBlogRoutes(app: Express) {
  // Get all blog posts
  app.get('/api/blog-posts', async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  // Get a single blog post by ID
  app.get('/api/blog-posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      console.error(`Error fetching blog post with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  // Create a new blog post
  app.post('/api/blog-posts', async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const newPost = await storage.createBlogPost(validatedData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid blog post data', details: error.errors });
      }
      
      console.error('Error creating blog post:', error);
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  });

  // Get featured blog posts
  app.get('/api/blog-posts/featured', async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      const featuredPosts = posts.filter(post => post.featured);
      res.json(featuredPosts);
    } catch (error) {
      console.error('Error fetching featured blog posts:', error);
      res.status(500).json({ error: 'Failed to fetch featured blog posts' });
    }
  });

  // Get collaborative blog posts
  app.get('/api/collaborative-blog-posts', async (req, res) => {
    try {
      // This would normally come from a database with a separate table or flag
      // For now, we'll just find posts with a specific tag or category
      const allPosts = await storage.getAllBlogPosts();
      const collaborativePosts = allPosts.filter(post => 
        post.tags?.includes('collaborative') || 
        post.category === 'Collaborative AI'
      );
      
      res.json(collaborativePosts);
    } catch (error) {
      console.error('Error fetching collaborative blog posts:', error);
      res.status(500).json({ error: 'Failed to fetch collaborative blog posts' });
    }
  });
  
  // Create a new blog post with advanced prompt engineering content
  app.post('/api/collaborative-blog-posts/prompt-engineering', async (req, res) => {
    try {
      const now = new Date();
      
      const newPost: BlogPost = {
        id: 0, // Will be assigned by storage
        title: "The Art of Prompt Engineering: Creating AI Communication Excellence",
        slug: "art-of-prompt-engineering-ai-communication-excellence",
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
      
      const createdPost = await storage.createBlogPost(newPost);
      res.status(201).json(createdPost);
    } catch (error) {
      console.error('Error creating prompt engineering post:', error);
      res.status(500).json({ error: 'Failed to create prompt engineering post' });
    }
  });
}