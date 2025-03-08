import { AgentSpec, AgentState, AgentHandler, MemoryEntry } from './types';
import { OpenRouterService } from './openrouter-service';
import { AIMessage } from '@shared/ai-services';

/**
 * Manages the creation, execution, and state management of AI agents
 */
export class AgentManager {
  private agents: Map<string, AgentSpec> = new Map();
  private openRouterService: OpenRouterService;
  private agentStates: Map<string, AgentState> = new Map();
  
  constructor(openRouterApiKey: string) {
    this.openRouterService = new OpenRouterService(openRouterApiKey);
  }
  
  /**
   * Register a new agent specification
   */
  registerAgent(agent: AgentSpec): void {
    this.agents.set(agent.id, agent);
    console.log(`Agent registered: ${agent.name} (${agent.id})`);
  }
  
  /**
   * Get an agent by ID
   */
  getAgent(agentId: string): AgentSpec | undefined {
    return this.agents.get(agentId);
  }
  
  /**
   * List all available agents
   */
  listAgents(): AgentSpec[] {
    return Array.from(this.agents.values());
  }
  
  /**
   * Process a message with a specific agent
   */
  async processMessage(
    agentId: string, 
    userId: string, 
    sessionId: string, 
    message: string
  ): Promise<{
    response: string;
    agentState: AgentState;
  }> {
    // Get the agent specification
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent with ID ${agentId} not found`);
    }
    
    // Get or create agent state
    const stateKey = `${agentId}:${userId}:${sessionId}`;
    let state = this.agentStates.get(stateKey);
    
    if (!state) {
      // Initialize new conversation with system prompt
      state = {
        sessionId,
        agentId,
        userId,
        conversation: [
          { role: 'system', content: agent.systemPrompt }
        ],
        lastUpdated: new Date()
      };
    }
    
    // Add user message to conversation
    state.conversation.push({ role: 'user', content: message });
    
    // Process with memory retrieval if enabled
    let context = '';
    if (agent.memoryEnabled && agent.vectorStoreId) {
      const memories = await this.retrieveMemories(
        agent.vectorStoreId,
        agentId,
        userId,
        message
      );
      
      if (memories.length > 0) {
        context = "Relevant context from your memory:\n\n" + 
          memories.map(m => m.content).join("\n\n");
          
        // Add context as a system message
        state.conversation.push({ role: 'system', content: context });
      }
    }
    
    // Generate completion via OpenRouter
    const completion = await this.openRouterService.generateCompletion(
      state.conversation,
      {
        model: agent.defaultModel,
        temperature: 0.7,
      }
    );
    
    // Extract text and model from completion
    const completionText = 'text' in completion ? completion.text : '';
    const modelUsed = 'model' in completion ? completion.model : agent.defaultModel;
    
    // Add assistant response to conversation
    state.conversation.push({ role: 'assistant', content: completionText });
    state.lastUpdated = new Date();
    
    // Store updated state
    this.agentStates.set(stateKey, state);
    
    // If memory is enabled, store this interaction
    if (agent.memoryEnabled) {
      await this.storeMemory({
        id: `mem_${Date.now()}`,
        agentId,
        userId,
        sessionId,
        content: `User: ${message}\nAssistant: ${completionText}`,
        timestamp: new Date(),
        metadata: {
          messageType: 'conversation',
          modelUsed: modelUsed
        }
      });
    }
    
    return {
      response: completionText,
      agentState: state
    };
  }
  
  /**
   * Store a memory entry in the vector database
   * Note: This is a placeholder - integrate with an actual vector DB
   */
  private async storeMemory(memory: MemoryEntry): Promise<void> {
    // TODO: Implement vector DB integration
    console.log(`Storing memory: ${memory.id} for agent ${memory.agentId}`);
    // Example with embedding API:
    // 1. Generate embedding for memory.content
    // 2. Store the memory with its embedding in vector DB
  }
  
  /**
   * Retrieve relevant memories based on query
   * Note: This is a placeholder - integrate with an actual vector DB
   */
  private async retrieveMemories(
    vectorStoreId: string,
    agentId: string,
    userId: string,
    query: string,
    limit: number = 5
  ): Promise<MemoryEntry[]> {
    // TODO: Implement vector DB search
    console.log(`Retrieving memories for query: ${query}`);
    // Example with vector search:
    // 1. Generate embedding for query
    // 2. Perform similarity search in vector DB
    // 3. Return most relevant entries
    
    return []; // Placeholder
  }
  
  /**
   * Clear conversation history for a specific session
   */
  clearConversation(agentId: string, userId: string, sessionId: string): boolean {
    const stateKey = `${agentId}:${userId}:${sessionId}`;
    
    if (this.agentStates.has(stateKey)) {
      const state = this.agentStates.get(stateKey)!;
      
      // Keep only the system prompt
      const systemPrompt = state.conversation.find(msg => msg.role === 'system');
      state.conversation = systemPrompt ? [systemPrompt] : [];
      state.lastUpdated = new Date();
      
      this.agentStates.set(stateKey, state);
      return true;
    }
    
    return false;
  }
}