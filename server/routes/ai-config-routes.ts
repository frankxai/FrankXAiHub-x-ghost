import { Express, Request, Response } from 'express';
import { loadAllPersonalities, getPersonalityById } from '../config/personality-manager';
import { OPENROUTER_MODELS, getFreeOpenRouterModels } from '../config/openrouter-models';
import { loadAllTeams, getTeamById } from '../config/agent-teams';

/**
 * Register AI Configuration Routes
 */
export function registerAIConfigRoutes(app: Express) {
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