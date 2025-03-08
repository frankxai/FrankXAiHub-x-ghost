import { Request, Response } from 'express';
import { AgentManager } from './agent-manager';
import { PREDEFINED_AGENTS } from './predefined-agents';
import { AgentConfig, CreateConversationRequest, SendMessageRequest } from '@shared/agent-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Controller for handling agent-related API endpoints
 */
export class AgentController {
  private agentManager: AgentManager;
  
  constructor(openRouterApiKey: string) {
    this.agentManager = new AgentManager(openRouterApiKey);
    
    // Register predefined agents
    PREDEFINED_AGENTS.forEach(agent => {
      this.agentManager.registerAgent(agent);
    });
  }
  
  /**
   * Get list of available agents
   */
  getAvailableAgents = async (req: Request, res: Response) => {
    try {
      const agents = this.agentManager.listAgents();
      
      // Map to client-friendly format
      const agentConfigs: AgentConfig[] = agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        capabilities: agent.capabilities,
        defaultModel: agent.defaultModel,
        defaultProvider: agent.defaultProvider,
        memoryEnabled: agent.memoryEnabled,
        // Add default avatar URLs based on agent ID
        avatarUrl: `/images/agents/${agent.id}.png`,
      }));
      
      res.json(agentConfigs);
    } catch (error) {
      console.error('Error getting available agents:', error);
      res.status(500).json({ error: 'Failed to retrieve agents' });
    }
  }
  
  /**
   * Create a new conversation with an agent
   */
  createConversation = async (req: Request, res: Response) => {
    try {
      const { agentId, userId, initialMessage } = req.body as CreateConversationRequest;
      
      if (!agentId || !userId) {
        return res.status(400).json({ error: 'Agent ID and user ID are required' });
      }
      
      // Check if agent exists
      const agent = this.agentManager.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ error: `Agent with ID ${agentId} not found` });
      }
      
      // Generate new session ID
      const sessionId = uuidv4();
      
      // If there's an initial message, process it
      let response = undefined;
      if (initialMessage) {
        const result = await this.agentManager.processMessage(
          agentId,
          userId,
          sessionId,
          initialMessage
        );
        
        response = result.response;
      }
      
      // Return session information
      res.json({
        sessionId,
        agentId,
        userId,
        initialResponse: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }
  
  /**
   * Send a message to an agent in an existing conversation
   */
  sendMessage = async (req: Request, res: Response) => {
    try {
      const { agentId, userId, sessionId, message } = req.body as SendMessageRequest;
      
      if (!agentId || !userId || !sessionId || !message) {
        return res.status(400).json({ 
          error: 'Agent ID, user ID, session ID, and message are required'
        });
      }
      
      // Process the message
      const result = await this.agentManager.processMessage(
        agentId,
        userId,
        sessionId,
        message
      );
      
      // Return the response
      res.json({
        agentId,
        sessionId,
        response: result.response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
  
  /**
   * Clear conversation history
   */
  clearConversation = async (req: Request, res: Response) => {
    try {
      const { agentId, userId, sessionId } = req.body;
      
      if (!agentId || !userId || !sessionId) {
        return res.status(400).json({ 
          error: 'Agent ID, user ID, and session ID are required'
        });
      }
      
      const success = this.agentManager.clearConversation(agentId, userId, sessionId);
      
      if (success) {
        res.json({ success: true, message: 'Conversation cleared successfully' });
      } else {
        res.status(404).json({ success: false, error: 'Conversation not found' });
      }
    } catch (error) {
      console.error('Error clearing conversation:', error);
      res.status(500).json({ error: 'Failed to clear conversation' });
    }
  }
}