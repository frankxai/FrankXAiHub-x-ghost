import { Express } from 'express';
import { AgentController } from '../agent-framework/agent-controller';

/**
 * Register agent-related routes
 */
export function registerAgentRoutes(app: Express) {
  // Initialize agent controller with OpenRouter API key
  const agentController = new AgentController(process.env.OPENROUTER_API_KEY || '');
  
  // Get available agents
  app.get('/api/agents', agentController.getAvailableAgents);
  
  // Create a new conversation
  app.post('/api/agents/conversation', agentController.createConversation);
  
  // Send a message to an agent
  app.post('/api/agents/message', agentController.sendMessage);
  
  // Clear conversation history
  app.post('/api/agents/clear-conversation', agentController.clearConversation);
}