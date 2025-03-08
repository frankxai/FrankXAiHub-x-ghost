import axios from 'axios';
import { ModelSpec, ModelProvider } from './types';
import { AIMessage } from '@shared/ai-services';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

/**
 * OpenRouter API client for accessing multiple AI models through a single API
 */
export class OpenRouterService {
  private apiKey: string;
  private defaultModel: string;
  private defaultHeaders: Record<string, string>;

  constructor(apiKey: string, defaultModel: string = 'openai/gpt-4o') {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.defaultHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': 'https://frankx.ai', // Update with your domain
      'X-Title': 'FrankX.AI Platform',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get available models from OpenRouter
   */
  async getModels(): Promise<ModelSpec[]> {
    try {
      const response = await axios.get(`${OPENROUTER_API_URL}/models`, {
        headers: this.defaultHeaders,
      });
      
      return response.data.data.map((model: any) => ({
        id: model.id,
        name: model.name,
        provider: this.extractProviderFromModelId(model.id),
        contextWindow: model.context_length || 4096,
        capabilities: this.extractCapabilities(model),
        costPer1kTokens: {
          input: model.pricing?.input || 0,
          output: model.pricing?.output || 0,
        },
      }));
    } catch (error) {
      console.error('Error fetching models from OpenRouter:', error);
      throw new Error('Failed to fetch models from OpenRouter');
    }
  }

  /**
   * Generate a completion using OpenRouter
   */
  async generateCompletion(
    messages: AIMessage[], 
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      jsonMode?: boolean;
      stream?: boolean;
    } = {}
  ) {
    const { 
      model = this.defaultModel, 
      temperature = 0.7, 
      maxTokens = 1024,
      jsonMode = false,
      stream = false
    } = options;

    try {
      // Transform messages to OpenRouter format if needed
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const payload = {
        model,
        messages: formattedMessages,
        temperature,
        max_tokens: maxTokens,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      };

      if (stream) {
        return this.streamCompletion(payload);
      }

      const response = await axios.post(
        `${OPENROUTER_API_URL}/chat/completions`, 
        payload,
        { headers: this.defaultHeaders }
      );

      return {
        text: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: response.data.model,
      };
    } catch (error) {
      console.error('Error generating completion:', error);
      throw new Error('Failed to generate completion');
    }
  }

  /**
   * Stream completion from OpenRouter
   */
  async *streamCompletion(payload: any): AsyncGenerator<{ text: string, isComplete: boolean }> {
    try {
      const response = await axios.post(
        `${OPENROUTER_API_URL}/chat/completions`,
        { ...payload, stream: true },
        { 
          headers: this.defaultHeaders,
          responseType: 'stream' 
        }
      );

      let accumulatedText = '';
      
      // Handle streaming response
      for await (const chunk of response.data) {
        const dataStr = chunk.toString().trim();
        
        // Skip empty chunks or non-data chunks
        if (!dataStr || !dataStr.startsWith('data:')) continue;
        if (dataStr === 'data: [DONE]') {
          yield { text: accumulatedText, isComplete: true };
          return;
        }

        try {
          const data = JSON.parse(dataStr.slice(5)); // Remove 'data: ' prefix
          const content = data.choices[0]?.delta?.content || '';
          
          if (content) {
            accumulatedText += content;
            yield { text: accumulatedText, isComplete: false };
          }
        } catch (e) {
          console.error('Error parsing streaming data:', e);
        }
      }

      yield { text: accumulatedText, isComplete: true };
    } catch (error) {
      console.error('Error in streaming completion:', error);
      throw new Error('Failed to stream completion');
    }
  }

  /**
   * Extract provider name from model ID
   */
  private extractProviderFromModelId(modelId: string): ModelProvider {
    if (modelId.startsWith('anthropic/')) return 'anthropic';
    if (modelId.startsWith('openai/')) return 'openai';
    if (modelId.startsWith('google/')) return 'google';
    if (modelId.startsWith('meta/')) return 'meta';
    if (modelId.startsWith('mistral/')) return 'mistral';
    return 'openrouter';
  }

  /**
   * Extract capabilities from model data
   */
  private extractCapabilities(model: any): string[] {
    const capabilities: string[] = ['text'];
    
    // Add capabilities based on model features
    if (model.features?.includes('vision')) capabilities.push('vision');
    if (model.features?.includes('tools') || model.features?.includes('function_calling')) {
      capabilities.push('function-calling');
    }
    if (model.features?.includes('json_mode')) capabilities.push('json-mode');
    
    return capabilities;
  }
}