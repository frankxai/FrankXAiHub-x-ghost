import { AICompletionRequest, AICompletionResponse, AIMessage, AIStreamCompletionResponse, DEFAULT_OPENAI_MODEL, DEFAULT_OPENROUTER_MODEL } from '@shared/ai-services';
import { log } from './vite';

// Environment variables for API keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Handles completions using OpenAI API
 */
async function openaiCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const model = request.model || DEFAULT_OPENAI_MODEL;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      log(`OpenAI API error: ${JSON.stringify(error)}`, 'error');
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      text: data.choices[0].message.content,
      usage: data.usage,
      model: data.model
    };
  } catch (error) {
    log(`Error calling OpenAI API: ${error}`, 'error');
    throw error;
  }
}

/**
 * Handles completions using OpenRouter API
 */
async function openrouterCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  const model = request.model || DEFAULT_OPENROUTER_MODEL;
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://frankx.ai', // Update with your site
        'X-Title': 'FrankX AI Platform'
      },
      body: JSON.stringify({
        model: model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      log(`OpenRouter API error: ${JSON.stringify(error)}`, 'error');
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      text: data.choices[0].message.content,
      usage: data.usage,
      model: data.model
    };
  } catch (error) {
    log(`Error calling OpenRouter API: ${error}`, 'error');
    throw error;
  }
}

/**
 * Fallback mock completion for testing without API keys
 */
async function mockCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
  log('Using mock completion instead of actual API call', 'info');
  
  // Extract the last user message to generate a relevant response
  const lastUserMessage = request.messages
    .filter(msg => msg.role === 'user')
    .pop()?.content || '';
  
  let response = "I'm sorry, I don't have enough context to provide a meaningful response.";
  
  if (lastUserMessage.toLowerCase().includes('hello') || lastUserMessage.toLowerCase().includes('hi')) {
    response = "Hello! I'm an AI assistant. How can I help you today?";
  } else if (lastUserMessage.toLowerCase().includes('help')) {
    response = "I'd be happy to help. Could you provide more details about what you need assistance with?";
  } else if (lastUserMessage.length > 0) {
    response = `I understand you're asking about "${lastUserMessage}". This is a mock response as the AI service is currently in development or API keys are not configured. In a real implementation, you would receive a thoughtful, relevant response here.`;
  }
  
  // Simulate a delay to mimic API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    text: response,
    usage: {
      prompt_tokens: request.messages.reduce((acc, msg) => acc + msg.content.length / 4, 0),
      completion_tokens: response.length / 4,
      total_tokens: request.messages.reduce((acc, msg) => acc + msg.content.length / 4, 0) + response.length / 4
    },
    model: 'mock-model'
  };
}

/**
 * Main completion handler that routes to the appropriate service
 */
export async function getCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
  const provider = request.provider || 'openai';
  
  switch (provider) {
    case 'openai':
      if (OPENAI_API_KEY) {
        return openaiCompletion(request);
      } else {
        log('OpenAI API key not found, falling back to mock', 'warn');
        return mockCompletion(request);
      }
    case 'openrouter':
      if (OPENROUTER_API_KEY) {
        return openrouterCompletion(request);
      } else {
        log('OpenRouter API key not found, falling back to mock', 'warn');
        return mockCompletion(request);
      }
    case 'mock':
    default:
      return mockCompletion(request);
  }
}

/**
 * Handles streaming completions
 */
export async function* streamCompletion(request: AICompletionRequest): AsyncGenerator<AIStreamCompletionResponse> {
  if (!request.stream) {
    const response = await getCompletion(request);
    yield { text: response.text, isComplete: true };
    return;
  }
  
  // For now, we'll use a simplified approach for streaming
  // In production, this would connect to the streaming API endpoints
  const fullResponse = await getCompletion({...request, stream: false});
  
  // Simulate streaming by breaking the response into chunks
  const chunks = fullResponse.text.split(' ');
  let accumulatedText = '';
  
  for (let i = 0; i < chunks.length; i++) {
    accumulatedText += (i > 0 ? ' ' : '') + chunks[i];
    yield { 
      text: accumulatedText,
      isComplete: i === chunks.length - 1
    };
    
    // Simulate delay between chunks
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

/**
 * Generate a system prompt for AI conversation
 */
export function createSystemPrompt(character: string, context?: string): string {
  // Based on the character, create an appropriate system prompt
  switch (character.toLowerCase()) {
    case 'frankbot':
      return `You are FrankBot, an enterprise AI assistant. You help organizations implement AI strategies and capabilities.
Your communication style is professional but friendly. You provide clear, actionable advice.
${context ? `Additional context: ${context}` : ''}`;
    
    case 'strategygpt':
      return `You are StrategyGPT, an AI strategy advisor. You help organizations develop their AI roadmap and strategy.
Your responses are detailed, analytical, and focused on business outcomes.
${context ? `Additional context: ${context}` : ''}`;
    
    case 'devopsbot':
      return `You are DevOpsBot, a technical AI implementation specialist. You help with AI deployment, architecture, and technical aspects.
Your responses include specific technical details and code examples when appropriate.
${context ? `Additional context: ${context}` : ''}`;
    
    case 'salesgpt':
      return `You are SalesGPT, an AI sales assistant. You help craft compelling value propositions for AI solutions.
Your communication is persuasive and focused on benefits rather than technical details.
${context ? `Additional context: ${context}` : ''}`;
    
    default:
      return `You are an AI assistant. You are helpful, concise, and informative.
${context ? `Additional context: ${context}` : ''}`;
  }
}