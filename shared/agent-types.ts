/**
 * Shared types for agent-related functionality
 * These types are used by both client and server
 */

/**
 * Available model providers that can be used with agents
 */
export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'meta' | 'mistral' | 'openrouter';

/**
 * Model capability flags
 */
export type ModelCapability = 
  'text' | 
  'images' | 
  'code' | 
  'function-calling' | 
  'json-mode' | 
  'vision';

/**
 * Agent configuration as exposed to the frontend
 */
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  defaultModel: string;
  defaultProvider: ModelProvider;
  avatarUrl?: string;
  memoryEnabled: boolean;
}

/**
 * Request to create a new conversation with an agent
 */
export interface CreateConversationRequest {
  agentId: string;
  userId: string;
  initialMessage?: string;
}

/**
 * Request to send a message in an existing conversation
 */
export interface SendMessageRequest {
  agentId: string;
  userId: string;
  sessionId: string;
  message: string;
}

/**
 * Response from the agent containing the message and session information
 */
export interface AgentMessageResponse {
  agentId: string;
  sessionId: string;
  response: string;
  timestamp: string;
}

/**
 * Summary information about an agent session/conversation
 */
export interface ConversationSession {
  id: string;
  agentId: string;
  userId: string;
  title: string;
  lastMessage: string;
  lastUpdated: string;
}

/**
 * Message in a conversation
 */
export interface ConversationMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * Full conversation history
 */
export interface ConversationHistory {
  sessionId: string;
  agentId: string;
  messages: ConversationMessage[];
}