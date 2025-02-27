import fs from "fs";
import path from "path";
import {
  type BlogPost,
  type InsertBlogPost,
} from "@shared/schema";

/**
 * The BlogIndex interface represents the structure of the JSON index file
 * that stores metadata about all blog posts
 */
interface BlogIndex {
  lastId: number;
  posts: Array<{ 
    id: number; 
    slug: string; 
    title: string;
    excerpt: string;
    category: string;
    authorName: string;
    publishedAt: string; // stored as ISO string
    imageUrl?: string;
    readTime: number;
    tags?: string[];
    featured?: boolean;
  }>;
}

const BLOG_DIR = path.join(process.cwd(), "data", "blog");
const INDEX_FILE = path.join(BLOG_DIR, "index.json");
const POSTS_DIR = path.join(BLOG_DIR, "posts");

// Ensure directories exist
function ensureDirectoriesExist() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Read the blog index file
 */
function readIndex(): BlogIndex {
  ensureDirectoriesExist();
  
  if (!fs.existsSync(INDEX_FILE)) {
    // Create an empty index if it doesn't exist
    const emptyIndex: BlogIndex = { lastId: 0, posts: [] };
    fs.writeFileSync(INDEX_FILE, JSON.stringify(emptyIndex, null, 2));
    return emptyIndex;
  }
  
  const indexContent = fs.readFileSync(INDEX_FILE, "utf-8");
  return JSON.parse(indexContent) as BlogIndex;
}

/**
 * Write to the blog index file
 */
function writeIndex(index: BlogIndex): void {
  ensureDirectoriesExist();
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

/**
 * Get all blog posts (metadata only)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const index = readIndex();
  
  return index.posts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: "", // Content is not loaded here for performance
    category: post.category,
    authorName: post.authorName,
    publishedAt: new Date(post.publishedAt),
    readTime: post.readTime,
    imageUrl: post.imageUrl || null,
  }));
}

/**
 * Get a single blog post by ID (including content)
 */
export async function getBlogPost(id: number): Promise<BlogPost | undefined> {
  const index = readIndex();
  const postMeta = index.posts.find(post => post.id === id);
  
  if (!postMeta) return undefined;
  
  const postFile = path.join(POSTS_DIR, `${id}.json`);
  
  if (!fs.existsSync(postFile)) {
    return undefined;
  }
  
  const postContent = fs.readFileSync(postFile, "utf-8");
  const postData = JSON.parse(postContent);
  
  return {
    id: postMeta.id,
    title: postMeta.title,
    excerpt: postMeta.excerpt,
    content: postData.content,
    category: postMeta.category,
    authorName: postMeta.authorName,
    publishedAt: new Date(postMeta.publishedAt),
    readTime: postMeta.readTime,
    imageUrl: postMeta.imageUrl || null,
  };
}

/**
 * Create a new blog post
 */
export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
  ensureDirectoriesExist();
  
  const index = readIndex();
  const id = index.lastId + 1;
  const slug = generateSlug(post.title);
  const publishedAt = post.publishedAt || new Date();
  
  // Create the post metadata for the index
  const postMeta = {
    id,
    slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    authorName: post.authorName,
    publishedAt: publishedAt.toISOString(),
    readTime: post.readTime,
    imageUrl: post.imageUrl || undefined,
    tags: post.tags || [],
    featured: post.featured || false
  };
  
  // Save the complete post content to a separate file
  const postContent = {
    content: post.content,
    id,
    title: post.title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Update the index
  index.lastId = id;
  index.posts.push(postMeta);
  writeIndex(index);
  
  // Write the post content to its own file
  fs.writeFileSync(
    path.join(POSTS_DIR, `${id}.json`),
    JSON.stringify(postContent, null, 2)
  );
  
  // Return the full blog post object
  return {
    id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    authorName: post.authorName,
    publishedAt,
    readTime: post.readTime,
    imageUrl: post.imageUrl || null,
  };
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  id: number,
  post: Partial<InsertBlogPost>
): Promise<BlogPost | undefined> {
  const index = readIndex();
  const postIndex = index.posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return undefined;
  }
  
  const postFile = path.join(POSTS_DIR, `${id}.json`);
  
  if (!fs.existsSync(postFile)) {
    return undefined;
  }
  
  // Read current post data
  const postContent = fs.readFileSync(postFile, "utf-8");
  const postData = JSON.parse(postContent);
  
  // Update metadata in index
  if (post.title) {
    index.posts[postIndex].title = post.title;
    postData.title = post.title;
  }
  
  if (post.excerpt) {
    index.posts[postIndex].excerpt = post.excerpt;
  }
  
  if (post.category) {
    index.posts[postIndex].category = post.category;
  }
  
  if (post.authorName) {
    index.posts[postIndex].authorName = post.authorName;
  }
  
  if (post.readTime) {
    index.posts[postIndex].readTime = post.readTime;
  }
  
  if (post.imageUrl !== undefined) {
    index.posts[postIndex].imageUrl = post.imageUrl || undefined;
  }
  
  // Update content file
  if (post.content) {
    postData.content = post.content;
  }
  
  postData.updatedAt = new Date().toISOString();
  
  // Write updates
  writeIndex(index);
  fs.writeFileSync(postFile, JSON.stringify(postData, null, 2));
  
  // Return updated post
  return {
    id,
    title: index.posts[postIndex].title,
    excerpt: index.posts[postIndex].excerpt,
    content: postData.content,
    category: index.posts[postIndex].category,
    authorName: index.posts[postIndex].authorName,
    publishedAt: new Date(index.posts[postIndex].publishedAt),
    readTime: index.posts[postIndex].readTime,
    imageUrl: index.posts[postIndex].imageUrl || null,
  };
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number): Promise<boolean> {
  const index = readIndex();
  const postIndex = index.posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return false;
  }
  
  const postFile = path.join(POSTS_DIR, `${id}.json`);
  
  // Remove from index
  index.posts.splice(postIndex, 1);
  writeIndex(index);
  
  // Delete content file if it exists
  if (fs.existsSync(postFile)) {
    fs.unlinkSync(postFile);
  }
  
  return true;
}

/**
 * Get a blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const index = readIndex();
  const postMeta = index.posts.find(post => post.slug === slug);
  
  if (!postMeta) return undefined;
  
  return getBlogPost(postMeta.id);
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const index = readIndex();
  const featuredPosts = index.posts
    .filter(post => post.featured)
    .map(post => post.id);
  
  const posts: BlogPost[] = [];
  
  for (const id of featuredPosts) {
    const post = await getBlogPost(id);
    if (post) {
      posts.push(post);
    }
  }
  
  return posts;
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const index = readIndex();
  const categoryPosts = index.posts
    .filter(post => post.category === category)
    .map(post => post.id);
  
  const posts: BlogPost[] = [];
  
  for (const id of categoryPosts) {
    const post = await getBlogPost(id);
    if (post) {
      posts.push(post);
    }
  }
  
  return posts;
}

/**
 * Initialize with sample content if empty
 */
export async function initializeWithSampleContent(): Promise<void> {
  const index = readIndex();
  
  // Only initialize if no posts exist
  if (index.posts.length > 0) {
    return;
  }
  
  // Sample blog posts
  const samplePosts: InsertBlogPost[] = [
    {
      title: "Building an AI Center of Excellence",
      excerpt: "A strategic framework for implementing enterprise-wide AI capabilities.",
      content: "# Building an AI Center of Excellence\n\nA strategic framework for implementing enterprise-wide AI capabilities that delivers measurable ROI and drives competitive advantage.\n\n## Executive Summary\n\nThe AI Center of Excellence (AICoE) serves as the central nervous system for an organization's artificial intelligence initiatives. It brings together expertise, resources, and governance to accelerate adoption while ensuring responsible implementation aligned with strategic objectives.\n\nThis framework outlines the key components necessary for establishing an effective AICoE, based on successful implementations across industries and organizational sizes.\n\n## Core Components\n\n### 1. Strategic Alignment\n\nThe AICoE must connect directly to core business objectives:\n\n- **Value Identification**: Mapping AI opportunities to strategic priorities\n- **Business Case Development**: Establishing clear ROI metrics and success criteria\n- **Stakeholder Alignment**: Ensuring executive sponsorship and cross-functional buy-in\n\n### 2. Talent & Expertise\n\nBuilding the right team is critical:\n\n- **Interdisciplinary Skills**: Technical expertise balanced with domain knowledge and change management capabilities\n- **Hub-and-Spoke Model**: Core team of specialists supporting distributed AI champions\n- **Learning Culture**: Continuous upskilling and knowledge sharing\n\n### 3. Technology Infrastructure\n\nCreating the foundation for scalable AI:\n\n- **Data Architecture**: Accessible, high-quality data pipelines\n- **Compute Resources**: Appropriate processing capabilities for model development\n- **Development Environment**: Standardized tools and platforms for consistent delivery\n\n### 4. Governance Framework\n\nEnsuring responsible and effective implementation:\n\n- **Ethical Guidelines**: Principles for responsible AI development and usage\n- **Review Process**: Systematic evaluation of AI initiatives\n- **Risk Management**: Controls for technical, operational, and reputational risks\n\n### 5. Delivery Methodology\n\nOperationalizing AI at scale:\n\n- **Project Selection**: Prioritization framework for maximum impact\n- **Agile Processes**: Iterative development with continuous feedback\n- **Production Integration**: Standards for deploying and monitoring AI systems\n\n## Implementation Roadmap\n\n### Phase 1: Foundation (3-6 months)\n- Establish baseline capabilities\n- Deliver 2-3 high-impact pilots\n- Build initial operational processes\n\n### Phase 2: Acceleration (6-12 months)\n- Scale successful use cases\n- Formalize governance structure\n- Expand technical capabilities\n\n### Phase 3: Transformation (12+ months)\n- Embed AI into core processes\n- Implement advanced capabilities\n- Drive innovation at enterprise scale\n\n## Success Metrics\n\nEffective AICoEs measure performance across multiple dimensions:\n\n- **Financial Impact**: Direct ROI from implemented solutions\n- **Operational Metrics**: Efficiency and quality improvements\n- **Capability Building**: Skills development and knowledge transfer\n- **Innovation Indicators**: New products/services enabled\n\n## Conclusion\n\nCreating an AI Center of Excellence requires thoughtful planning and organizational commitment, but the potential rewards are substantial. Organizations that successfully implement this framework can expect accelerated AI adoption, improved ROI on technology investments, and sustainable competitive advantage.",
      category: "Strategy",
      authorName: "Frank Venture",
      publishedAt: new Date("2025-02-15"),
      readTime: 8,
      imageUrl: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1",
    },
    {
      title: "The ROI of Enterprise AI Implementation",
      excerpt: "How to measure and maximize the return on investment from artificial intelligence initiatives.",
      content: "# The ROI of Enterprise AI Implementation\n\n## Introduction: The Strategic Value Proposition\n\nArtificial intelligence represents one of the most significant opportunities for enterprise value creation in the modern business landscape. However, justifying AI investments requires a robust framework for measuring return on investment that extends beyond traditional financial metrics.\n\nThis guide explores how organizations can develop a comprehensive ROI model for AI initiatives, accounting for both direct financial impacts and broader transformational benefits.\n\n## Quantifying AI Value: A Multi-Dimensional Approach\n\nEffective AI ROI measurement requires consideration of four key dimensions:\n\n1. **Direct Cost Reduction**: Labor savings, process efficiency, and resource optimization\n2. **Revenue Enhancement**: Increased sales, customer retention, and new business models\n3. **Risk Mitigation**: Reduced errors, fraud prevention, and compliance improvements\n4. **Strategic Positioning**: Competitive advantage, innovation capacity, and organizational capabilities\n\n## ROI Benchmarks by Function\n\n### Customer Service\n\n**Implementation costs:**\n- LLM customization and integration: $150,000-$500,000\n- Ongoing model updates and maintenance: $50,000-$200,000/year\n\n**Value metrics:**\n- Average handle time reduction: 25-40%\n- First contact resolution improvement: 15-30%\n- Agent productivity increase: 20-35%\n- Training time reduction: 30-50%\n\n**Sample ROI calculation:**\nFor a customer service operation with 100 agents at $50,000 fully-loaded cost per agent:\n- 30% productivity improvement = 30 FTE equivalent = $1.5M annual savings\n- Improved customer satisfaction and retention = $500K-$1M additional value\n- Total annual value: $2-2.5M against $250K-$700K implementation and annual costs\n\n### Marketing and Content Creation\n\n**Implementation costs:**\n- Content-specific LLM fine-tuning: $100,000-$300,000\n- Integration with content management systems: $50,000-$150,000\n- Ongoing optimization: $40,000-$120,000/year\n\n**Value metrics:**\n- Content production volume increase: 3-5x\n- Content creation time reduction: 50-70%\n- A/B testing efficiency improvement: 40-60%\n- Campaign launch acceleration: 30-50%\n\n**Sample ROI calculation:**\nFor a marketing department spending $2M annually on content creation:\n- 60% efficiency improvement = $1.2M cost avoidance\n- Faster campaign execution = 20% increased campaign effectiveness = $400K additional revenue\n- Total annual value: $1.6M against $150K-$450K implementation and annual costs\n\n## Critical Success Factors for Maximizing LLM ROI\n\nBeyond the numbers, several organizational factors significantly impact the realized ROI from enterprise LLM implementations:\n\n### 1. Clear Use Case Prioritization\n\nOrganizations that begin with high-impact, well-defined use cases achieve faster payback periods. The most successful approach involves:\n\n- Identifying tasks with high volume, clear patterns, and significant time investment\n- Calculating detailed baseline metrics before implementation\n- Setting specific improvement targets tied to business outcomes\n\n### 2. Thoughtful Human-AI Collaboration Design\n\nThe highest ROI comes from implementations that optimize the division of labor between humans and AI:\n\n- Assign repetitive, pattern-based work to LLMs\n- Reserve judgment, creativity, and stakeholder interaction for humans\n- Create clear escalation paths for complex cases\n- Implement feedback loops for continuous improvement\n\n## Implementation Roadmap: A Phased Approach to Value Realization\n\nMaximizing ROI from enterprise LLMs is best achieved through a methodical, phased approach that balances quick wins with long-term value creation:\n\n### Phase 1: Foundation (3-6 months)\n\n- Establish baseline metrics for target processes\n- Implement 2-3 high-impact, contained use cases\n- Develop initial governance and usage guidelines\n- Prioritize integration with key workflow systems\n\n### Phase 2: Expansion (6-12 months)\n\n- Scale successful pilots across departments\n- Extend capabilities based on user adoption and feedback\n- Implement more sophisticated use cases requiring deeper customization\n- Develop internal expertise for ongoing optimization\n\n## Conclusion: The Strategic Imperative of Enterprise LLMs\n\nWhile ROI calculations provide necessary justification for LLM investments, forward-looking organizations recognize that these technologies represent more than incremental efficiency gains. Enterprise LLMs are becoming fundamental infrastructure for competitive advantage in the AI era.",
      category: "Technology",
      authorName: "Michael Chen",
      publishedAt: new Date("2025-02-08"),
      readTime: 9,
      imageUrl: "https://images.unsplash.com/photo-1676299081847-3e95d5848b6b",
    },
    {
      title: "Practical Guide to AI Model Selection",
      excerpt: "How to navigate the complex landscape of AI models and choose the right option for your specific use case.",
      content: "# Practical Guide to AI Model Selection\n\n## Introduction\n\nWith the rapid proliferation of AI models, selecting the optimal option for a specific business need has become increasingly complex. This guide provides a structured approach to model selection that balances performance, cost, and strategic considerations.\n\n## Part 1: Defining Your Requirements\n\nBefore evaluating specific models, clarify these foundational elements:\n\n### Use Case Characterization\n\n- **Task Type**: Classification, generation, prediction, etc.\n- **Domain Specificity**: General vs. domain-specific requirements\n- **Performance Priorities**: Speed, accuracy, cost, or flexibility\n- **Integration Context**: Standalone vs. workflow integration\n\n### Data Considerations\n\n- **Available Data**: Volume, quality, and representativeness \n- **Privacy Requirements**: PII handling and security needs\n- **Update Frequency**: Static vs. dynamic data environments\n- **Multimodal Needs**: Text, images, audio, etc.\n\n### Deployment Context\n\n- **Latency Requirements**: Real-time vs. batch processing\n- **Compute Resources**: Available infrastructure\n- **Regulatory Constraints**: Compliance and governance\n- **Operational Model**: Cloud, on-premises, or hybrid\n\n## Part 2: Model Evaluation Framework\n\n### Large Language Models (LLMs)\n\n| Model Family | Strengths | Limitations | Best For |\n|--------------|-----------|------------|----------|\n| GPT-4 (OpenAI) | Exceptional general reasoning, code understanding, and instruction following | Higher cost, latency constraints | Complex reasoning tasks, multi-step instructions, creative content |\n| Claude (Anthropic) | Strong reasoning, longer context window, thoughtful safeguards | Less technical/code capability than GPT-4 | Long-document analysis, nuanced content generation with safety focus |\n| Llama 2 (Meta) | Open weights, self-hosted option, strong performance/cost ratio | Requires technical expertise to deploy | Cost-sensitive applications, privacy-focused use cases |\n| Mistral | Excellent performance/size ratio, efficient inference | Newer with less ecosystem support | Embedded applications, resource-constrained environments |\n| PaLM 2 (Google) | Strong multilingual capabilities, broad knowledge | API limitations, less specialized tooling | Global applications, multilingual needs |\n\n### Specialized Models\n\nFor domain-specific needs, consider:\n\n- **Embedding Models**: Ada (OpenAI), BGE (BAAI), BERT variants\n- **Vision-Language Models**: GPT-4V, Claude Opus, Gemini\n- **Domain-Specific Models**: Healthcare, legal, financial\n\n## Part 3: Decision Matrix Methodology\n\nWhen evaluating multiple models, use this weighted scoring system:\n\n1. **Identify key criteria**: Performance, cost, ease of implementation, etc.\n2. **Weight criteria** based on importance (1-10)\n3. **Score each model** against criteria (1-5)\n4. **Calculate weighted scores** (weight × score)\n5. **Sum totals** for comparison\n\n## Part 4: Implementation Strategy\n\nOnce you've selected your model, consider these implementation best practices:\n\n### 1. Pilot Structure\n\n- Start with a limited scope\n- Establish clear metrics\n- Plan for iteration\n\n### 2. Evaluation Process\n\n- Define a systematic testing approach\n- Include representative data\n- Compare against baseline methods\n\n### 3. Deployment Considerations\n\n- Monitoring infrastructure\n- Fallback mechanisms\n- Feedback collection\n\n## Conclusion\n\nModel selection is not a one-time decision but an ongoing process. As AI technology evolves rapidly, build flexibility into your approach to take advantage of new capabilities as they emerge.\n\nThe best model is rarely the most advanced or expensive option, but rather the one that best fits your specific requirements, constraints, and objectives.",
      category: "Technical",
      authorName: "Amanda Rodriguez",
      publishedAt: new Date("2025-02-03"),
      readTime: 12,
      imageUrl: "https://images.unsplash.com/photo-1680987082559-6b0f39a35412",
    }
  ];
  
  // Create each sample post
  for (const post of samplePosts) {
    await createBlogPost(post);
  }
}