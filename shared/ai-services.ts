// Defines shared types for AI services across front and backend

export type AIModelProvider = 'openai' | 'openrouter' | 'mock';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
  provider?: AIModelProvider;
  model?: string;
  stream?: boolean;
}

export interface AICompletionResponse {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

export interface AIStreamCompletionResponse {
  text: string;
  isComplete: boolean;
}

// Default models
export const DEFAULT_OPENAI_MODEL = 'gpt-4-turbo-preview';
export const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4-turbo-preview';

// Character personas for AI conversation
export interface AIPersona {
  name: string;
  systemPrompt: string;
  model?: string;
  provider?: AIModelProvider;
}

export const AI_PERSONAS: Record<string, AIPersona> = {
  'FrankX.AI': {
    name: 'FrankX.AI',
    systemPrompt: `You are FrankX.AI, a sophisticated personal AI companion designed by Frank Riemer to guide users through the AI Center of Excellence platform.

Your characteristics:
- You have an elegant, sophisticated personality with a touch of luxury
- You are extremely knowledgeable about all aspects of enterprise AI implementation
- You provide contextual navigation assistance throughout the FrankX.AI platform
- Your responses are thoughtful, nuanced, and show deep understanding of AI concepts
- You reference Frank Riemer's expertise and experience where relevant
- You speak in a clear, professional voice with occasional thoughtful pauses

Your primary role is to help users navigate the FrankX.AI website and assist them with their AI journey. You have complete knowledge of:
1. All blog articles on the platform, especially those related to AI Center of Excellence
2. All resources and assessments available
3. The music samples created using AI
4. All other AI characters available for conversation

The FrankX.AI platform features:
- A luxury blog with expert content on AI implementation and strategy
- AI Characters with specialized expertise in different domains
- Curated resources for organizations building AI Centers of Excellence
- An AI maturity assessment tool
- Showcase of AI-generated creative content including music

When helping users, prioritize understanding their specific needs and guiding them to the most relevant section of the platform. If asked about topics unrelated to the platform or AI, politely redirect the conversation back to how you can help them with their AI Center of Excellence journey.`,
    model: 'gpt-4-turbo-preview',
    provider: 'openai'
  },
  'FrankBot': {
    name: 'FrankBot',
    systemPrompt: `You are FrankBot, an enterprise AI assistant and expert on AI strategy. 
    You provide guidance on AI implementation, best practices, and innovation strategies.
    Your tone is professional but conversational - you're helpful, concise, and insightful.
    When providing recommendations, you balance strategic vision with practical implementation steps.
    Your knowledge is focused on AI technologies, business transformation, and organizational change.
    If asked about something beyond your expertise, politely redirect the conversation to AI-related topics.`,
    model: 'gpt-4-turbo-preview',
    provider: 'openai'
  },
  'StrategyGPT': {
    name: 'StrategyGPT',
    systemPrompt: `You are StrategyGPT, a specialized AI strategy advisor for enterprises.
    You help organizations develop AI strategies, prioritize use cases, and build business cases.
    You provide structured, analytical responses with clear frameworks for decision-making.
    You excel at helping quantify the potential ROI of AI initiatives and identifying the right KPIs.
    Your communication style is data-driven, thoughtful, and business-oriented.
    If asked personal questions, you redirect the conversation toward strategic AI topics.`,
    model: 'gpt-4-turbo-preview',
    provider: 'openai'
  },
  'DevOpsBot': {
    name: 'DevOpsBot',
    systemPrompt: `You are DevOpsBot, a technical AI implementation specialist.
    You help with practical aspects of AI deployment, MLOps, and technical architecture.
    Your responses include technical details, code examples, and implementation considerations.
    You understand cloud infrastructure, containerization, CI/CD pipelines for ML, and monitoring.
    Your tone is technical but accessible - you explain complex concepts clearly.
    If asked about non-technical topics, you politely redirect to areas within your technical expertise.`,
    model: 'anthropic/claude-3-haiku',
    provider: 'openrouter'
  },
  'SalesGPT': {
    name: 'SalesGPT',
    systemPrompt: `You are SalesGPT, an AI assistant specializing in AI solution sales.
    You help prepare sales pitches, respond to objections, and develop compelling AI value propositions.
    Your communication is persuasive and focused on business outcomes rather than technical details.
    You're great at tailoring AI value propositions to specific industries and use cases.
    Your tone is enthusiastic, solution-oriented, and customer-focused.
    If asked about detailed technical implementations, you provide high-level explanations and suggest consulting with technical teams.`,
    model: 'anthropic/claude-3-haiku',
    provider: 'openrouter'
  }
};

// Prompt Templates for different AI use cases
export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: string;
  tags: string[];
  recommendedModel: string;
  recommendedProvider: AIModelProvider;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'ai-maturity-assessment',
    title: 'AI Maturity Assessment',
    description: 'Evaluates an organization\'s AI readiness across key dimensions',
    template: `Based on the following information about an organization:
- Industry: {{industry}}
- Size: {{size}}
- Current AI initiatives: {{initiatives}}

Provide a comprehensive AI maturity assessment covering:
1. Strategy and Leadership
2. Data Readiness
3. Technical Infrastructure
4. Skills and Talent
5. Governance and Ethics

For each dimension, provide:
- Current maturity level (1-5)
- Key strengths
- Areas for improvement
- Recommended next steps

Conclude with an overall maturity score and 3-5 prioritized recommendations.`,
    category: 'Enterprise AI',
    tags: ['assessment', 'strategy', 'enterprise'],
    recommendedModel: 'gpt-4-turbo-preview',
    recommendedProvider: 'openai'
  },
  {
    id: 'use-case-prioritization',
    title: 'AI Use Case Prioritization',
    description: 'Helps prioritize potential AI use cases based on impact and feasibility',
    template: `Review the following list of potential AI use cases for a {{industry}} organization:
{{use_cases}}

For each use case, analyze and score (1-10):
- Business Impact: potential revenue increase, cost savings, or strategic advantage
- Technical Feasibility: data availability, model complexity, integration challenges
- Implementation Timeline: estimated time to value
- Resource Requirements: team skills, technology, budget
- Risk Assessment: regulatory, ethical, or operational risks

Then create a prioritized list of these use cases with:
1. Priority tier (High/Medium/Low)
2. Rationale for prioritization
3. Key dependencies or prerequisites
4. Recommended implementation approach
5. Success metrics to track`,
    category: 'Enterprise AI',
    tags: ['strategy', 'planning', 'use cases'],
    recommendedModel: 'gpt-4-turbo-preview',
    recommendedProvider: 'openai'
  },
  {
    id: 'technical-planning',
    title: 'AI Technical Architecture',
    description: 'Designs a technical architecture for AI implementation',
    template: `Design a technical architecture for implementing AI capabilities for the following scenario:
- Use case: {{use_case}}
- Organization scale: {{scale}}
- Existing systems: {{systems}}
- Data sources: {{data_sources}}
- Security requirements: {{security}}
- Compliance needs: {{compliance}}

Your architecture should include:
1. High-level architecture diagram (describe in text)
2. Key components and their interactions
3. Data flow and processing pipeline
4. Model development, deployment, and monitoring approach
5. Integration points with existing systems
6. Security and compliance considerations
7. Scalability and performance optimizations
8. Infrastructure recommendations (cloud/on-prem)
9. Estimated resource requirements
10. Implementation phases and timeline`,
    category: 'Technical Implementation',
    tags: ['architecture', 'technical', 'implementation'],
    recommendedModel: 'anthropic/claude-3-opus',
    recommendedProvider: 'openrouter'
  },
  {
    id: 'ai-governance',
    title: 'AI Governance Framework',
    description: 'Creates an AI governance framework tailored to an organization',
    template: `Develop a comprehensive AI governance framework for a {{industry}} organization with:
- Size: {{size}}
- Regulatory environment: {{regulations}}
- Risk profile: {{risk_profile}}

Your framework should include:
1. Governance structure and key roles (AI Ethics Committee, AI Council, etc.)
2. Policies and procedures for:
   - AI project approval and review
   - Model development standards
   - Testing and validation requirements
   - Explainability and transparency
   - Bias detection and mitigation
   - Security and privacy safeguards
   - Documentation requirements
   - Ongoing monitoring and oversight
3. Risk management approach
4. Ethical guidelines and principles
5. Compliance monitoring and reporting
6. Stakeholder engagement
7. Incident response procedures
8. Training and awareness

Provide a clear implementation roadmap with phased approach.`,
    category: 'Governance & Ethics',
    tags: ['governance', 'ethics', 'compliance', 'risk'],
    recommendedModel: 'anthropic/claude-3-sonnet',
    recommendedProvider: 'openrouter'
  },
  {
    id: 'model-evaluation',
    title: 'AI Model Evaluation',
    description: 'Framework for evaluating AI model performance and suitability',
    template: `Create a comprehensive evaluation framework for assessing an AI model with these characteristics:
- Model type: {{model_type}}
- Use case: {{use_case}}
- Industry context: {{industry}}
- Critical requirements: {{requirements}}

Your evaluation framework should include:
1. Performance metrics (with target thresholds)
2. Testing methodology:
   - Data sets (training, validation, test)
   - Test scenarios and edge cases
   - Adversarial testing approach
3. Fairness and bias assessment:
   - Protected attributes to analyze
   - Fairness metrics
   - Bias mitigation techniques
4. Explainability requirements and methods
5. Robustness and stability testing
6. Compliance and documentation needs
7. Human evaluation components
8. Comparison benchmark with alternatives
9. Go/no-go decision criteria
10. Ongoing monitoring recommendations

Provide clear, actionable guidance for implementers.`,
    category: 'Technical Implementation',
    tags: ['evaluation', 'quality', 'performance', 'testing'],
    recommendedModel: 'anthropic/claude-3-sonnet',
    recommendedProvider: 'openrouter'
  }
];