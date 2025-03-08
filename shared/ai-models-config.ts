
import { AIModel, AIModelProvider } from './agent-types';

// Comprehensive model configuration with metadata
export interface ModelConfig {
  id: string;
  name: string;
  provider: AIModelProvider;
  contextWindow: number;
  costPer1kTokens: number;
  strengths: string[];
  maxOutputTokens?: number;
  capabilities: string[];
  description: string;
  avatarPath?: string;
}

// OpenRouter models organized by capabilities
export const AI_MODELS: ModelConfig[] = [
  // OpenRouter models
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'openrouter',
    contextWindow: 200000,
    costPer1kTokens: 0.015,
    strengths: ['Reasoning', 'Long-form content', 'Nuanced understanding'],
    capabilities: ['complex-reasoning', 'long-context', 'tool-use', 'domain-expertise'],
    description: 'Anthropic\'s most capable model with sophisticated reasoning and high accuracy'
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'openrouter',
    contextWindow: 180000,
    costPer1kTokens: 0.003,
    strengths: ['Balanced performance', 'Cost-effective', 'Versatile'],
    capabilities: ['reasoning', 'tool-use', 'balanced-performance'],
    description: 'Balanced performance model for most AI agent tasks'
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'openrouter',
    contextWindow: 150000,
    costPer1kTokens: 0.00025,
    strengths: ['Speed', 'Cost-efficiency', 'Lightweight tasks'],
    capabilities: ['fast-response', 'basic-reasoning', 'efficiency'],
    description: 'Fast and cost-effective model for responsive agent interactions'
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    provider: 'openrouter',
    contextWindow: 32000,
    costPer1kTokens: 0.0008,
    strengths: ['Technical knowledge', 'Code generation', 'Structured data'],
    capabilities: ['technical-expertise', 'code-generation', 'data-analysis'],
    description: 'Excellent for technical tasks and code-related work'
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'openrouter',
    contextWindow: 32000,
    costPer1kTokens: 0.0001,
    strengths: ['General knowledge', 'Conversational', 'Cost-effective'],
    capabilities: ['general-purpose', 'conversational', 'accessibility'],
    description: 'Versatile model for a wide range of general-purpose tasks'
  },
  {
    id: 'google/gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'openrouter',
    contextWindow: 1000000,
    costPer1kTokens: 0.0005,
    strengths: ['Extremely long context', 'Multi-modal', 'Advanced reasoning'],
    capabilities: ['extreme-long-context', 'multi-modal', 'deep-reasoning'],
    description: 'Latest Google model with 1M token context window'
  },
  {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    provider: 'openrouter',
    contextWindow: 8000,
    costPer1kTokens: 0.0002,
    strengths: ['Open model', 'Broad knowledge', 'Instruction following'],
    capabilities: ['general-purpose', 'instruction-following', 'open-weights'],
    description: 'Meta\'s largest open model with strong generalist capabilities'
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openrouter',
    contextWindow: 128000,
    costPer1kTokens: 0.001,
    strengths: ['Versatile', 'Well-rounded', 'Strong reasoning'],
    capabilities: ['multi-modal', 'reasoning', 'versatility', 'tool-use'],
    description: 'OpenAI\'s latest model with optimal performance across tasks'
  },
  {
    id: 'perplexity/pplx-70b-online',
    name: 'Perplexity 70B Online',
    provider: 'openrouter',
    contextWindow: 4096,
    costPer1kTokens: 0.0009,
    strengths: ['Internet access', 'Up-to-date information', 'Citations'],
    capabilities: ['internet-access', 'research', 'citations'],
    description: 'Model with internet access for up-to-date information'
  }
];

// Group models by capability
export function getModelsByCapability(capability: string): ModelConfig[] {
  return AI_MODELS.filter(model => model.capabilities.includes(capability));
}

// Get best model for specific task
export function getBestModelForTask(task: string): ModelConfig {
  switch (task) {
    case 'research':
      return AI_MODELS.find(m => m.id === 'anthropic/claude-3-opus') || AI_MODELS[0];
    case 'coding':
      return AI_MODELS.find(m => m.id === 'mistralai/mistral-large') || AI_MODELS[0];
    case 'creative':
      return AI_MODELS.find(m => m.id === 'anthropic/claude-3-sonnet') || AI_MODELS[0];
    case 'data-analysis':
      return AI_MODELS.find(m => m.id === 'mistralai/mistral-large') || AI_MODELS[0];
    default:
      return AI_MODELS.find(m => m.id === 'anthropic/claude-3-sonnet') || AI_MODELS[0];
  }
}
