/**
 * OpenRouter Models Configuration
 * 
 * This file contains configuration for all available models on OpenRouter
 * with a focus on free tier models from different providers.
 */

export interface OpenRouterModel {
  id: string;                // OpenRouter model ID (e.g. "google/gemini-pro")
  name: string;              // Display name
  provider: string;          // Provider name (e.g. "Google", "DeepSeek", "Anthropic")
  contextWindow: number;     // Context window size in tokens
  freeInOpenRouter: boolean; // Whether this model is free in OpenRouter
  capabilities: string[];    // Model capabilities (e.g. "text", "vision", "function-calling")
  description: string;       // Brief description of the model
  category: string;          // Category (e.g. "chat", "completion", "vision")
  inputPricing?: number;     // Price per 1M input tokens (in USD)
  outputPricing?: number;    // Price per 1M output tokens (in USD)
}

/**
 * All available models on OpenRouter
 * Focusing especially on free tier models
 */
export const OPENROUTER_MODELS: OpenRouterModel[] = [
  // Google Models
  {
    id: "google/gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    contextWindow: 32768,
    freeInOpenRouter: true,
    capabilities: ["text", "function-calling"],
    description: "Google's advanced language model for text generation and analysis",
    category: "chat",
    inputPricing: 0,
    outputPricing: 0,
  },
  {
    id: "google/gemini-pro-vision",
    name: "Gemini Pro Vision",
    provider: "Google",
    contextWindow: 16384,
    freeInOpenRouter: true,
    capabilities: ["text", "vision"],
    description: "Google's multimodal model for text and image understanding",
    category: "vision",
    inputPricing: 0,
    outputPricing: 0,
  },
  
  // DeepSeek Models
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    contextWindow: 4096,
    freeInOpenRouter: true,
    capabilities: ["text"],
    description: "Powerful open-source chat model from DeepSeek",
    category: "chat",
    inputPricing: 0,
    outputPricing: 0,
  },
  {
    id: "deepseek/deepseek-coder",
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    contextWindow: 16384,
    freeInOpenRouter: true,
    capabilities: ["text", "code"],
    description: "Specialized model for code generation and understanding",
    category: "code",
    inputPricing: 0,
    outputPricing: 0,
  },
  
  // Mistral Models
  {
    id: "mistralai/mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    provider: "Mistral AI",
    contextWindow: 8192,
    freeInOpenRouter: true,
    capabilities: ["text"],
    description: "Efficient and powerful 7B parameter instruction-tuned model",
    category: "chat",
    inputPricing: 0,
    outputPricing: 0,
  },
  {
    id: "mistralai/mistral-small",
    name: "Mistral Small",
    provider: "Mistral AI",
    contextWindow: 32768,
    freeInOpenRouter: true,
    capabilities: ["text"],
    description: "Compact yet powerful model by Mistral",
    category: "chat",
    inputPricing: 0,
    outputPricing: 0,
  },
  
  // Anthropic Models (Some require credits)
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    contextWindow: 48000,
    freeInOpenRouter: false,
    capabilities: ["text"],
    description: "Fast and efficient model from the Claude 3 family",
    category: "chat",
    inputPricing: 0.25,
    outputPricing: 1.25,
  },
  
  // OpenAI Models (Require credits)
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: 128000,
    freeInOpenRouter: false,
    capabilities: ["text", "vision", "function-calling"],
    description: "OpenAI's most advanced multimodal model",
    category: "chat",
    inputPricing: 5,
    outputPricing: 15,
  },
  
  // Meta Models
  {
    id: "meta/llama-3-8b-instruct",
    name: "Llama 3 8B Instruct",
    provider: "Meta",
    contextWindow: 8192,
    freeInOpenRouter: true,
    capabilities: ["text"],
    description: "Meta's open-source Llama 3 model, instruction-tuned",
    category: "chat",
    inputPricing: 0,
    outputPricing: 0,
  },
  {
    id: "meta/llama-3-70b-instruct",
    name: "Llama 3 70B Instruct",
    provider: "Meta",
    contextWindow: 8192,
    freeInOpenRouter: false,
    capabilities: ["text"],
    description: "Meta's powerful 70B parameter Llama 3 model",
    category: "chat",
    inputPricing: 0.9,
    outputPricing: 1.8,
  },
];

/**
 * Get all free models available on OpenRouter
 */
export function getFreeOpenRouterModels(): OpenRouterModel[] {
  return OPENROUTER_MODELS.filter(model => model.freeInOpenRouter);
}

/**
 * Get models by capability
 */
export function getModelsByCapability(capability: string): OpenRouterModel[] {
  return OPENROUTER_MODELS.filter(model => 
    model.capabilities.includes(capability)
  );
}

/**
 * Get models by provider
 */
export function getModelsByProvider(provider: string): OpenRouterModel[] {
  return OPENROUTER_MODELS.filter(model => 
    model.provider === provider
  );
}

/**
 * Get model by ID
 */
export function getModelById(modelId: string): OpenRouterModel | undefined {
  return OPENROUTER_MODELS.find(model => model.id === modelId);
}