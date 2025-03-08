import { AIMessage } from "@shared/ai-services";

/**
 * Agent specification defining an AI agent's characteristics
 */
export interface AgentSpec {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  defaultModel: string;
  defaultProvider: ModelProvider;
  capabilities: string[];
  vectorStoreId?: string; // For knowledge retrieval
  memoryEnabled: boolean;
  tools: AgentTool[];
}

/**
 * Available model providers
 */
export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'meta' | 'mistral' | 'openrouter';

/**
 * Model specification
 */
export interface ModelSpec {
  id: string;
  name: string;
  provider: ModelProvider;
  contextWindow: number;
  capabilities: ModelCapability[];
  costPer1kTokens: {
    input: number;
    output: number;
  };
}

/**
 * Model capabilities
 */
export type ModelCapability = 
  'text' | 
  'images' | 
  'code' | 
  'function-calling' | 
  'json-mode' | 
  'vision';

/**
 * Tools that can be used by agents
 */
export interface AgentTool {
  id: string;
  name: string;
  description: string;
  parameters: ToolParameter[];
  requiredModels?: string[]; // Models that support this tool
}

/**
 * Tool parameter definition
 */
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  default?: any;
}

/**
 * Memory entry stored in the vector database
 */
export interface MemoryEntry {
  id: string;
  agentId: string;
  userId: string;
  sessionId: string;
  content: string;
  embedding?: number[];
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Agent state during a conversation
 */
export interface AgentState {
  sessionId: string;
  agentId: string;
  userId: string;
  conversation: AIMessage[];
  lastUpdated: Date;
  // Additional state parameters can be added
}

/**
 * Function for handling an agent's task
 */
export interface AgentHandler {
  process: (
    input: string, 
    state: AgentState, 
    spec: AgentSpec
  ) => Promise<{
    response: string;
    updatedState: AgentState;
    usedTools?: string[];
  }>;
}

/**
 * Response from vector search
 */
export interface VectorSearchResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}