
/**
 * Agent Framework
 * This module defines types and interfaces for creating advanced AI agents with skills
 */

// Skill types
export type SkillType = 'search' | 'data-analysis' | 'code-generation' | 'summarization' | 'content-creation' | 
  'translation' | 'qa' | 'research' | 'planning' | 'custom';

// Skill definition
export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  parameters?: SkillParameter[];
  function: string; // Function name to be called
  hasMemory?: boolean;
}

// Parameter for a skill
export interface SkillParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  default?: any;
}

// Advanced agent definition
export interface AdvancedAgent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  baseModel: string;
  provider: string;
  skills: string[]; // Skill IDs
  avatarUrl?: string;
  metadata?: Record<string, any>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Workflow step
export interface WorkflowStep {
  id: string;
  agentId: string;
  skillId: string;
  parameters: Record<string, any>;
  next?: string[]; // Next step IDs
  condition?: string; // Condition to evaluate
}

// Workflow definition
export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  startStep: string; // ID of the first step
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Agent execution context
export interface AgentContext {
  conversationId: string;
  userId: string;
  sessionData: Record<string, any>;
  memory: string[];
  workflow?: Workflow;
  currentStep?: string;
}

// Default skills that can be used by agents
export const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for information',
    type: 'search',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'Search query',
        required: true
      },
      {
        name: 'numResults',
        type: 'number',
        description: 'Number of results to return',
        required: false,
        default: 5
      }
    ],
    function: 'performWebSearch'
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Generate code in various programming languages',
    type: 'code-generation',
    parameters: [
      {
        name: 'language',
        type: 'string',
        description: 'Programming language',
        required: true
      },
      {
        name: 'task',
        type: 'string',
        description: 'Description of the coding task',
        required: true
      }
    ],
    function: 'generateCode'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Analyze data and generate insights',
    type: 'data-analysis',
    parameters: [
      {
        name: 'data',
        type: 'string',
        description: 'Data to analyze (CSV, JSON, or plain text)',
        required: true
      },
      {
        name: 'analysisType',
        type: 'string',
        description: 'Type of analysis to perform',
        required: true
      }
    ],
    function: 'analyzeData'
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Create various types of content',
    type: 'content-creation',
    parameters: [
      {
        name: 'contentType',
        type: 'string',
        description: 'Type of content to create (article, social media, email, etc.)',
        required: true
      },
      {
        name: 'topic',
        type: 'string',
        description: 'Topic or subject of the content',
        required: true
      },
      {
        name: 'tone',
        type: 'string',
        description: 'Tone of the content (professional, casual, etc.)',
        required: false,
        default: 'professional'
      }
    ],
    function: 'createContent'
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Conduct in-depth research on a topic',
    type: 'research',
    parameters: [
      {
        name: 'topic',
        type: 'string',
        description: 'Topic to research',
        required: true
      },
      {
        name: 'depth',
        type: 'string',
        description: 'Depth of research (basic, intermediate, comprehensive)',
        required: false,
        default: 'intermediate'
      }
    ],
    function: 'conductResearch',
    hasMemory: true
  }
];

// Example skill execution functions (to be implemented in server-side code)
export const skillExecutors = {
  performWebSearch: async (params: any, context: AgentContext) => {
    // Implementation would connect to a search API
    return { 
      results: [
        { title: 'Example result 1', snippet: 'This is a sample result', url: 'https://example.com/1' },
        { title: 'Example result 2', snippet: 'Another sample result', url: 'https://example.com/2' }
      ]
    };
  },
  
  generateCode: async (params: any, context: AgentContext) => {
    // Implementation would call an AI code generation service
    return {
      code: '// Example generated code\nfunction hello() {\n  console.log("Hello world");\n}',
      language: params.language
    };
  },
  
  analyzeData: async (params: any, context: AgentContext) => {
    // Implementation would parse and analyze the provided data
    return {
      insights: ['Example insight 1', 'Example insight 2'],
      summary: 'This is a sample data analysis summary'
    };
  },
  
  createContent: async (params: any, context: AgentContext) => {
    // Implementation would generate content based on parameters
    return {
      content: 'This is example generated content based on the provided parameters.',
      contentType: params.contentType
    };
  },
  
  conductResearch: async (params: any, context: AgentContext) => {
    // Implementation would perform multi-step research
    // Add information to memory for later steps
    context.memory.push(`Researched: ${params.topic}`);
    
    return {
      findings: ['Example finding 1', 'Example finding 2'],
      sources: ['https://example.com/source1', 'https://example.com/source2'],
      summary: 'This is a sample research summary'
    };
  }
};
