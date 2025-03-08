import { Router } from "express";
import { getCompletion } from "../ai-service";
import { AICompletionRequest } from "@shared/ai-services";
import { z } from "zod";

const router = Router();

// Schema for validating conversation requests
const conversationSchema = z.object({
  characterName: z.string(),
  message: z.string(),
  model: z.string().optional(),
  temperature: z.number().optional(),
  tone: z.string().optional(),
  context: z.string().optional()
});

// Handle AI conversation requests
router.post("/", async (req, res) => {
  try {
    // Validate request
    const validatedData = conversationSchema.parse(req.body);
    
    // Build AI request
    const request: AICompletionRequest = {
      messages: [
        {
          role: "system",
          content: validatedData.context || 
            `You are ${validatedData.characterName}, an AI assistant focused on helping users achieve financial freedom through AI. 
            Always provide actionable advice for building wealth with AI technologies.
            If asked about tone, respond in a ${validatedData.tone || "professional"} tone.`
        },
        {
          role: "user",
          content: validatedData.message
        }
      ],
      temperature: validatedData.temperature || 0.7,
      model: validatedData.model,
    };
    
    // Get completion from AI service
    const response = await getCompletion(request);
    
    // Return AI response
    res.json({
      message: response.text,
      model: response.model,
      usage: response.usage
    });
  } catch (error) {
    console.error("Error processing AI conversation:", error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: "Invalid conversation data", 
        errors: error.errors 
      });
    } else {
      res.status(500).json({ 
        message: "Error processing AI conversation" 
      });
    }
  }
});

export default router;