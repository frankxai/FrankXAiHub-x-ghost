
import { Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { AI_PERSONAS } from '@shared/ai-services';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Set up file storage for agent avatars
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/agents')
  },
  filename: function (req, file, cb) {
    cb(null, `agent-${Date.now()}${path.extname(file.originalname)}`)
  }
});

// Create the uploads directory if it doesn't exist
if (!fs.existsSync('public/uploads/agents')) {
  fs.mkdirSync('public/uploads/agents', { recursive: true });
}

const upload = multer({ storage: storage_config });

// Schema for creating/updating an agent
const agentSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  persona: z.string().min(1),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
  isPublic: z.boolean().default(false),
  creatorId: z.number().optional(),
  legalDisclaimer: z.boolean().default(false),
  dataRetention: z.number().default(7), // days
  capabilities: z.array(z.string()).optional(),
});

// Get all public agents
router.get('/public', async (req, res) => {
  try {
    const agents = await storage.getAllAICharacters();
    const publicAgents = agents.filter(agent => agent.featured);
    res.json(publicAgents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching public agents" });
  }
});

// Get user's custom agents
router.get('/custom/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const agents = await storage.getAllAICharacters();
    // In a real app, you'd filter by creator ID from database
    // For now, just return all non-featured characters as an example
    const customAgents = agents.filter(agent => !agent.featured);
    res.json(customAgents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching custom agents" });
  }
});

// Create a new custom agent
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const agentData = agentSchema.parse(JSON.parse(req.body.data));
    
    if (!agentData.legalDisclaimer) {
      return res.status(400).json({ 
        message: "You must accept the legal disclaimer to create an agent" 
      });
    }
    
    // Create a new AI character
    const newAgent = await storage.createAICharacter({
      name: agentData.name,
      description: agentData.description,
      persona: agentData.persona,
      avatarUrl: req.file ? `/uploads/agents/${req.file.filename}` : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
      capabilities: agentData.capabilities || [],
      model: agentData.model || "gpt-4-turbo-preview",
      provider: agentData.provider || "openai",
      icon: "robot",
      featured: false
    });
    
    res.status(201).json(newAgent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid agent data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating agent" });
    }
  }
});

// Get base personas/templates
router.get('/templates', (req, res) => {
  try {
    res.json(Object.values(AI_PERSONAS));
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent templates" });
  }
});

// Get agent legal info
router.get('/legal', (req, res) => {
  const legalInfo = {
    disclaimer: `# AI Agent Legal Disclaimer
    
The FrankX.AI Agents ("Agents") are provided for informational and assistance purposes only. By using these Agents, you agree to the following terms:

1. **No Professional Advice**: The Agents do not provide legal, financial, medical, or other professional advice. Any information provided should not be considered a substitute for professional consultation.

2. **Accuracy**: While we strive for accuracy, the Agents may provide incomplete, incorrect, or outdated information. You are responsible for verifying any critical information.

3. **Data Usage**: Information you share with the Agents may be processed to improve services. You control retention settings.

4. **User Control**: You maintain control over Agent conversations and can delete your data at any time through the platform settings.

5. **Limitation of Liability**: FrankX.AI is not liable for any damages arising from the use of or inability to use the Agents.

By creating or using an Agent, you acknowledge that you have read, understood, and agree to these terms.`,
    privacyControls: [
      { name: "dataRetention", label: "Data Retention Period", type: "select", options: [1, 7, 30, 90, 0], default: 7, description: "Days to retain conversation data (0 = no retention)" },
      { name: "allowLearning", label: "Allow Learning from Conversations", type: "boolean", default: false, description: "If enabled, the system may learn from anonymized conversations" },
      { name: "shareWithOthers", label: "Share Agent with Other Users", type: "boolean", default: false, description: "Make this agent available to other platform users" }
    ]
  };
  
  res.json(legalInfo);
});

export default router;
