
import { Router } from 'express';
import { z } from 'zod';
import { AIPersona, AI_PERSONAS } from '@shared/ai-services';

const router = Router();

// Schema for creating/updating a persona
const personaSchema = z.object({
  name: z.string(),
  systemPrompt: z.string(),
  model: z.string().optional(),
  provider: z.string().optional(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
  isCustom: z.boolean().optional(),
  createdBy: z.string().optional(),
});

// In-memory storage for custom personas (would use database in production)
let customPersonas: Record<string, AIPersona> = {};

// Get all available personas (built-in + custom)
router.get('/', (req, res) => {
  const allPersonas = {
    ...AI_PERSONAS,
    ...customPersonas
  };
  
  res.json(Object.values(allPersonas));
});

// Create a new custom persona
router.post('/', (req, res) => {
  try {
    const data = personaSchema.parse(req.body);
    const personaId = data.name.replace(/\s+/g, '-').toLowerCase();
    
    if (AI_PERSONAS[personaId] && !data.isCustom) {
      return res.status(400).json({ 
        message: 'Cannot override a built-in persona' 
      });
    }
    
    customPersonas[personaId] = {
      name: data.name,
      systemPrompt: data.systemPrompt,
      model: data.model || 'gpt-4-turbo-preview',
      provider: data.provider || 'openai',
      ...(data.description && { description: data.description }),
      ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
      ...(data.isCustom && { isCustom: data.isCustom }),
      ...(data.createdBy && { createdBy: data.createdBy }),
    };
    
    res.status(201).json(customPersonas[personaId]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid persona data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Error creating persona' });
    }
  }
});

// Get a specific persona
router.get('/:id', (req, res) => {
  const personaId = req.params.id;
  
  // Check both built-in and custom personas
  const persona = AI_PERSONAS[personaId] || customPersonas[personaId];
  
  if (!persona) {
    return res.status(404).json({ message: 'Persona not found' });
  }
  
  res.json(persona);
});

// Update a custom persona
router.put('/:id', (req, res) => {
  const personaId = req.params.id;
  
  // Cannot update built-in personas
  if (AI_PERSONAS[personaId]) {
    return res.status(400).json({ message: 'Cannot update built-in personas' });
  }
  
  // Check if custom persona exists
  if (!customPersonas[personaId]) {
    return res.status(404).json({ message: 'Custom persona not found' });
  }
  
  try {
    const data = personaSchema.partial().parse(req.body);
    
    customPersonas[personaId] = {
      ...customPersonas[personaId],
      ...data
    };
    
    res.json(customPersonas[personaId]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid persona data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Error updating persona' });
    }
  }
});

// Delete a custom persona
router.delete('/:id', (req, res) => {
  const personaId = req.params.id;
  
  // Cannot delete built-in personas
  if (AI_PERSONAS[personaId]) {
    return res.status(400).json({ message: 'Cannot delete built-in personas' });
  }
  
  // Check if custom persona exists
  if (!customPersonas[personaId]) {
    return res.status(404).json({ message: 'Custom persona not found' });
  }
  
  delete customPersonas[personaId];
  res.status(204).end();
});

export default router;
