import { Express, Request, Response } from 'express';
import { loadAllPersonalities, getPersonalityById, getSystemPrompt, initializeDefaultPersonalities } from '../config/personality-manager';
import { OPENROUTER_MODELS, getFreeOpenRouterModels, getModelById } from '../config/openrouter-models';
import { loadAllTeams, getTeamById } from '../config/agent-teams';
import { AICompletionRequest } from '../../shared/ai-services';
import { getCompletion, streamCompletion } from '../ai-service';

/**
 * Register AI Configuration Routes
 */
export function registerAIConfigRoutes(app: Express) {
  // Initialize default personalities
  initializeDefaultPersonalities();
  // Get all available models from OpenRouter
  app.get('/api/ai/models', (req: Request, res: Response) => {
    try {
      const showAll = req.query.all === 'true';
      const models = showAll ? OPENROUTER_MODELS : getFreeOpenRouterModels();
      res.json(models);
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to retrieve models' });
    }
  });

  // Get a specific model by ID
  app.get('/api/ai/models/:modelId', (req: Request, res: Response) => {
    try {
      const modelId = req.params.modelId;
      const model = OPENROUTER_MODELS.find(m => m.id === modelId);
      
      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }
      
      res.json(model);
    } catch (error) {
      console.error('Error fetching model:', error);
      res.status(500).json({ error: 'Failed to retrieve model' });
    }
  });
  

  
  // Chat endpoint for OpenWebUI
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { message, modelId, personalityId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // Get model and personality
      const model = getModelById(modelId) || OPENROUTER_MODELS[0];
      const systemPrompt = getSystemPrompt(personalityId || 'frankx-default', modelId);
      
      // Create AI request
      const request: AICompletionRequest = {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: modelId,
        provider: 'openrouter',
        temperature: 0.7,
        max_tokens: 1000
      };
      
      // Get completion
      const completion = await getCompletion(request);
      
      res.json({ 
        response: completion.text,
        model: model.id,
        usage: completion.usage
      });
    } catch (error) {
      console.error('Error processing chat request:', error);
      res.status(500).json({ error: 'Failed to process chat request' });
    }
  });
  
  // Streaming chat endpoint
  app.post('/api/ai/chat/stream', async (req: Request, res: Response) => {
    try {
      const { message, modelId, personalityId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // Get personality system prompt
      const systemPrompt = getSystemPrompt(personalityId || 'frankx-default', modelId);
      
      // Set up streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Create AI request
      const request: AICompletionRequest = {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: modelId,
        provider: 'openrouter',
        temperature: 0.7,
        max_tokens: 1000,
        stream: true
      };
      
      // Stream completion
      for await (const chunk of streamCompletion(request)) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        
        // Check if client has disconnected
        if (res.writableEnded) {
          break;
        }
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error('Error streaming chat response:', error);
      res.write(`data: ${JSON.stringify({ error: 'Error streaming response' })}\n\n`);
      res.end();
    }
  });

  // Get all available personalities
  app.get('/api/ai/personalities', (req: Request, res: Response) => {
    try {
      const personalities = loadAllPersonalities();
      
      // Map to a public-facing structure that doesn't expose full system prompts
      const publicPersonalities = personalities.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        traits: p.traits,
        tone: p.tone,
        strengths: p.strengths,
        limitations: p.limitations,
        recommendedModels: p.recommendedModels
      }));
      
      res.json(publicPersonalities);
    } catch (error) {
      console.error('Error fetching personalities:', error);
      res.status(500).json({ error: 'Failed to retrieve personalities' });
    }
  });

  // Get a specific personality by ID
  app.get('/api/ai/personalities/:personalityId', (req: Request, res: Response) => {
    try {
      const personalityId = req.params.personalityId;
      const personality = getPersonalityById(personalityId);
      
      if (!personality) {
        return res.status(404).json({ error: 'Personality not found' });
      }
      
      // Don't expose the full system prompt to the client
      const { systemPrompt, ...publicPersonality } = personality;
      
      res.json(publicPersonality);
    } catch (error) {
      console.error('Error fetching personality:', error);
      res.status(500).json({ error: 'Failed to retrieve personality' });
    }
  });

  // Get all available teams
  app.get('/api/ai/teams', (req: Request, res: Response) => {
    try {
      const teams = loadAllTeams();
      
      // Map to a public-facing structure
      const publicTeams = teams.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        agents: t.agents.map(a => ({
          id: a.id,
          role: a.role,
          description: a.description,
          isCoordinator: a.isCoordinator,
          capabilities: a.capabilities
        })),
        isActive: t.isActive,
        created: t.created,
        updated: t.updated
      }));
      
      res.json(publicTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ error: 'Failed to retrieve teams' });
    }
  });

  // Get a specific team by ID
  app.get('/api/ai/teams/:teamId', (req: Request, res: Response) => {
    try {
      const teamId = req.params.teamId;
      const team = getTeamById(teamId);
      
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      res.json(team);
    } catch (error) {
      console.error('Error fetching team:', error);
      res.status(500).json({ error: 'Failed to retrieve team' });
    }
  });
}