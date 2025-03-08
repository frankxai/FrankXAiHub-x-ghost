/**
 * AI Configuration Routes
 * 
 * These routes provide access to AI model configurations, personalities, 
 * and other AI-related settings.
 */

import { Express } from 'express';
import { OPENROUTER_MODELS, getFreeOpenRouterModels } from '../config/openrouter-models';
import { loadAllPersonalities, getPersonalityById, savePersonality, deletePersonality } from '../config/personality-manager';
import { loadAllTeams, getTeamById, saveTeam, deleteTeam } from '../config/agent-teams';

/**
 * Register AI Configuration Routes
 */
export function registerAIConfigRoutes(app: Express) {
  // Get all available models
  app.get('/api/models', (req, res) => {
    try {
      const models = OPENROUTER_MODELS;
      res.json(models);
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });

  // Get only free models
  app.get('/api/models/free', (req, res) => {
    try {
      const freeModels = getFreeOpenRouterModels();
      res.json(freeModels);
    } catch (error) {
      console.error('Error fetching free models:', error);
      res.status(500).json({ error: 'Failed to fetch free models' });
    }
  });

  // Get models by capability
  app.get('/api/models/capability/:capability', (req, res) => {
    try {
      const { capability } = req.params;
      const models = OPENROUTER_MODELS.filter(model => 
        model.capabilities.includes(capability)
      );
      res.json(models);
    } catch (error) {
      console.error(`Error fetching models with capability ${req.params.capability}:`, error);
      res.status(500).json({ error: 'Failed to fetch models by capability' });
    }
  });

  // Get models by provider
  app.get('/api/models/provider/:provider', (req, res) => {
    try {
      const { provider } = req.params;
      const models = OPENROUTER_MODELS.filter(model => 
        model.provider.toLowerCase() === provider.toLowerCase()
      );
      res.json(models);
    } catch (error) {
      console.error(`Error fetching models from provider ${req.params.provider}:`, error);
      res.status(500).json({ error: 'Failed to fetch models by provider' });
    }
  });

  // Get all personalities
  app.get('/api/personalities', (req, res) => {
    try {
      const personalities = loadAllPersonalities();
      res.json(personalities);
    } catch (error) {
      console.error('Error fetching personalities:', error);
      res.status(500).json({ error: 'Failed to fetch personalities' });
    }
  });

  // Get personality by ID
  app.get('/api/personalities/:id', (req, res) => {
    try {
      const { id } = req.params;
      const personality = getPersonalityById(id);
      
      if (!personality) {
        return res.status(404).json({ error: 'Personality not found' });
      }
      
      res.json(personality);
    } catch (error) {
      console.error(`Error fetching personality ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch personality' });
    }
  });

  // Create or update a personality
  app.post('/api/personalities', (req, res) => {
    try {
      const personality = req.body;
      
      if (!personality.id || !personality.name || !personality.systemPrompt) {
        return res.status(400).json({ error: 'Invalid personality data' });
      }
      
      const success = savePersonality(personality);
      
      if (!success) {
        return res.status(500).json({ error: 'Failed to save personality' });
      }
      
      res.json(personality);
    } catch (error) {
      console.error('Error saving personality:', error);
      res.status(500).json({ error: 'Failed to save personality' });
    }
  });

  // Delete a personality
  app.delete('/api/personalities/:id', (req, res) => {
    try {
      const { id } = req.params;
      const success = deletePersonality(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Personality not found or could not be deleted' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting personality ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to delete personality' });
    }
  });

  // Get all agent teams
  app.get('/api/agent-teams', (req, res) => {
    try {
      const teams = loadAllTeams();
      res.json(teams);
    } catch (error) {
      console.error('Error fetching agent teams:', error);
      res.status(500).json({ error: 'Failed to fetch agent teams' });
    }
  });

  // Get agent team by ID
  app.get('/api/agent-teams/:id', (req, res) => {
    try {
      const { id } = req.params;
      const team = getTeamById(id);
      
      if (!team) {
        return res.status(404).json({ error: 'Agent team not found' });
      }
      
      res.json(team);
    } catch (error) {
      console.error(`Error fetching agent team ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch agent team' });
    }
  });

  // Create or update an agent team
  app.post('/api/agent-teams', (req, res) => {
    try {
      const team = req.body;
      
      if (!team.name || !team.agents || !team.workflow) {
        return res.status(400).json({ error: 'Invalid agent team data' });
      }
      
      const success = saveTeam(team);
      
      if (!success) {
        return res.status(500).json({ error: 'Failed to save agent team' });
      }
      
      res.json(team);
    } catch (error) {
      console.error('Error saving agent team:', error);
      res.status(500).json({ error: 'Failed to save agent team' });
    }
  });

  // Delete an agent team
  app.delete('/api/agent-teams/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { hardDelete } = req.query;
      const success = deleteTeam(id, hardDelete === 'true');
      
      if (!success) {
        return res.status(404).json({ error: 'Agent team not found or could not be deleted' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting agent team ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to delete agent team' });
    }
  });
}