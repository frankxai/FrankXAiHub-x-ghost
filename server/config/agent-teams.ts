/**
 * Agent Teams Management System for FrankX.AI
 * 
 * This system facilitates the coordination of multiple agents working together
 * as a team to accomplish complex tasks through Multi-Agent System (MAS) architecture.
 */
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Types for Agent Teams
export interface AgentTeam {
  id: string;                  // Unique identifier
  name: string;                // Display name
  description: string;         // Brief description
  agents: TeamAgent[];         // List of agents in the team
  workflow: TeamWorkflow;      // Workflow definition
  createdBy?: string;          // Creator
  created: Date;               // Creation date
  updated: Date;               // Last update date
  isActive: boolean;           // Whether the team is active
  metadata?: Record<string, any>; // Additional metadata
}

export interface TeamAgent {
  id: string;                  // Agent identifier (references an agent in the system)
  role: string;                // Role in the team (e.g., "coordinator", "researcher", "writer")
  description: string;         // Description of the agent's role
  personalityId: string;       // Personality to use
  modelId: string;             // Model to use
  isCoordinator: boolean;      // Whether this agent coordinates the team
  capabilities: string[];      // Specific capabilities this agent brings to the team
  taskTypes: string[];         // Types of tasks this agent can handle
}

export interface TeamWorkflow {
  steps: WorkflowStep[];       // Sequential workflow steps
  defaultRoute: string[];      // Default processing route
  conditionalRoutes: ConditionalRoute[]; // Conditional processing routes
  maxIterations: number;       // Maximum number of iterations
  requireUserApproval: boolean; // Whether user approval is required between steps
}

export interface WorkflowStep {
  id: string;                  // Step identifier
  name: string;                // Step name
  description: string;         // Step description
  agentId: string;             // Agent responsible for this step
  inputInstructions: string;   // Instructions for processing input
  outputFormat: string;        // Expected output format
  nextStepId?: string;         // Next step (if linear flow)
  conditionalNext?: ConditionalNext[]; // Conditional next steps
  timeoutSeconds?: number;     // Timeout for this step
}

export interface ConditionalNext {
  condition: string;           // Condition expression
  nextStepId: string;          // Next step if condition is met
}

export interface ConditionalRoute {
  condition: string;           // Condition for this route
  stepSequence: string[];      // Sequence of step IDs
}

// Directory for team files
const TEAMS_DIR = path.join(process.cwd(), 'data', 'agent-teams');

/**
 * Ensure the teams directory exists
 */
function ensureDirectoryExists() {
  if (!fs.existsSync(TEAMS_DIR)) {
    fs.mkdirSync(TEAMS_DIR, { recursive: true });
  }
}

/**
 * Load all agent teams from filesystem
 */
export function loadAllTeams(): AgentTeam[] {
  ensureDirectoryExists();
  
  try {
    const files = fs.readdirSync(TEAMS_DIR)
      .filter(file => file.endsWith('.json'));
    
    return files.map(file => {
      const filePath = path.join(TEAMS_DIR, file);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) as AgentTeam;
    }).filter(team => team.isActive);
  } catch (error) {
    console.error("Error loading agent teams:", error);
    return DEFAULT_TEAMS;
  }
}

/**
 * Get a specific team by ID
 */
export function getTeamById(id: string): AgentTeam | undefined {
  const teamPath = path.join(TEAMS_DIR, `${id}.json`);
  
  try {
    if (fs.existsSync(teamPath)) {
      const data = fs.readFileSync(teamPath, 'utf8');
      return JSON.parse(data) as AgentTeam;
    }
    
    // Fallback to default teams
    return DEFAULT_TEAMS.find(t => t.id === id);
  } catch (error) {
    console.error(`Error loading team ${id}:`, error);
    return DEFAULT_TEAMS.find(t => t.id === id);
  }
}

/**
 * Save a team to filesystem
 */
export function saveTeam(team: AgentTeam): boolean {
  ensureDirectoryExists();
  
  try {
    team.updated = new Date();
    
    // Generate ID if new team
    if (!team.id) {
      team.id = uuidv4();
      team.created = new Date();
    }
    
    const filePath = path.join(TEAMS_DIR, `${team.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(team, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error saving team ${team.id}:`, error);
    return false;
  }
}

/**
 * Delete a team (or mark as inactive)
 */
export function deleteTeam(id: string, hardDelete: boolean = false): boolean {
  try {
    const teamPath = path.join(TEAMS_DIR, `${id}.json`);
    
    if (hardDelete) {
      // Permanently delete the file
      if (fs.existsSync(teamPath)) {
        fs.unlinkSync(teamPath);
      }
    } else {
      // Mark as inactive (soft delete)
      if (fs.existsSync(teamPath)) {
        const data = fs.readFileSync(teamPath, 'utf8');
        const team = JSON.parse(data) as AgentTeam;
        team.isActive = false;
        team.updated = new Date();
        fs.writeFileSync(teamPath, JSON.stringify(team, null, 2), 'utf8');
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting team ${id}:`, error);
    return false;
  }
}

/**
 * Default teams that are always available
 */
export const DEFAULT_TEAMS: AgentTeam[] = [
  {
    id: "research-team",
    name: "Research & Analysis Team",
    description: "A team specialized in comprehensive research and analysis on complex topics",
    isActive: true,
    created: new Date("2023-01-15"),
    updated: new Date("2023-01-15"),
    agents: [
      {
        id: "coordinator",
        role: "Research Coordinator",
        description: "Coordinates the research process and ensures quality control",
        personalityId: "researcher",
        modelId: "anthropic/claude-3-opus",
        isCoordinator: true,
        capabilities: ["research-planning", "quality-control", "summarization"],
        taskTypes: ["research-coordination", "final-review"]
      },
      {
        id: "data-analyst",
        role: "Data Analyst",
        description: "Analyzes numerical data and creates visualizations",
        personalityId: "technical-expert",
        modelId: "openai/gpt-4o",
        isCoordinator: false,
        capabilities: ["data-analysis", "statistics", "visualization"],
        taskTypes: ["data-processing", "chart-creation"]
      },
      {
        id: "content-researcher",
        role: "Content Researcher",
        description: "Gathers and synthesizes information from multiple sources",
        personalityId: "researcher",
        modelId: "google/gemini-pro",
        isCoordinator: false,
        capabilities: ["information-gathering", "fact-checking", "source-evaluation"],
        taskTypes: ["information-retrieval", "source-analysis"]
      },
      {
        id: "report-writer",
        role: "Report Writer",
        description: "Creates clear, structured reports from research findings",
        personalityId: "creative-writer",
        modelId: "anthropic/claude-3-sonnet",
        isCoordinator: false,
        capabilities: ["content-creation", "formatting", "narrative-development"],
        taskTypes: ["report-writing", "content-editing"]
      }
    ],
    workflow: {
      steps: [
        {
          id: "research-planning",
          name: "Research Planning",
          description: "Define research scope and methodology",
          agentId: "coordinator",
          inputInstructions: "Based on the user's request, create a research plan including key questions to answer, potential sources to explore, and methods for analysis.",
          outputFormat: "Research plan with objectives, key questions, methodology, and timeline",
          nextStepId: "information-gathering"
        },
        {
          id: "information-gathering",
          name: "Information Gathering",
          description: "Collect relevant information from multiple sources",
          agentId: "content-researcher",
          inputInstructions: "Using the research plan, gather comprehensive information addressing the key questions. Evaluate sources for credibility and relevance.",
          outputFormat: "Collected information organized by topic with source citations",
          nextStepId: "data-analysis"
        },
        {
          id: "data-analysis",
          name: "Data Analysis",
          description: "Analyze numerical data and identify patterns",
          agentId: "data-analyst",
          inputInstructions: "Analyze any numerical data identified during information gathering. Identify trends, patterns, correlations, and statistical significance.",
          outputFormat: "Analysis results with key findings and visual representations where appropriate",
          nextStepId: "content-creation"
        },
        {
          id: "content-creation",
          name: "Content Creation",
          description: "Create the initial draft of the research report",
          agentId: "report-writer",
          inputInstructions: "Based on the gathered information and analysis, create a well-structured report that addresses the research objectives. Use clear language and organize information logically.",
          outputFormat: "Complete draft report with executive summary, main findings, and conclusions",
          nextStepId: "quality-review"
        },
        {
          id: "quality-review",
          name: "Quality Review",
          description: "Review the report for accuracy, completeness, and clarity",
          agentId: "coordinator",
          inputInstructions: "Review the draft report for accuracy, consistency, logical flow, and adherence to the research objectives. Identify any gaps or areas for improvement.",
          outputFormat: "Reviewed report with annotations for revisions if needed",
          conditionalNext: [
            {
              condition: "needs_revision",
              nextStepId: "content-revision"
            },
            {
              condition: "approved",
              nextStepId: "final-delivery"
            }
          ]
        },
        {
          id: "content-revision",
          name: "Content Revision",
          description: "Revise the report based on review feedback",
          agentId: "report-writer",
          inputInstructions: "Address all feedback from the quality review. Make necessary revisions to improve accuracy, clarity, and completeness.",
          outputFormat: "Revised report addressing all review comments",
          nextStepId: "quality-review"
        },
        {
          id: "final-delivery",
          name: "Final Delivery",
          description: "Prepare and deliver the final research report",
          agentId: "coordinator",
          inputInstructions: "Finalize the research report for delivery. Ensure all components are complete and presentation-ready.",
          outputFormat: "Final research report with executive summary, complete findings, and actionable conclusions"
        }
      ],
      defaultRoute: ["research-planning", "information-gathering", "data-analysis", "content-creation", "quality-review", "final-delivery"],
      conditionalRoutes: [
        {
          condition: "needs_revision",
          stepSequence: ["quality-review", "content-revision", "quality-review", "final-delivery"]
        }
      ],
      maxIterations: 3,
      requireUserApproval: true
    }
  },
  {
    id: "content-creation-team",
    name: "Content Creation Team",
    description: "A team specialized in creating high-quality, engaging content across various formats",
    isActive: true,
    created: new Date("2023-02-20"),
    updated: new Date("2023-02-20"),
    agents: [
      {
        id: "content-director",
        role: "Content Director",
        description: "Oversees the content creation process and ensures brand consistency",
        personalityId: "creative-writer",
        modelId: "anthropic/claude-3-opus",
        isCoordinator: true,
        capabilities: ["content-strategy", "brand-voice", "editing"],
        taskTypes: ["content-planning", "final-approval"]
      },
      {
        id: "creative-writer",
        role: "Creative Writer",
        description: "Creates engaging, original written content",
        personalityId: "creative-writer",
        modelId: "openai/gpt-4-turbo",
        isCoordinator: false,
        capabilities: ["storytelling", "copywriting", "creative-ideation"],
        taskTypes: ["article-writing", "social-copy", "storytelling"]
      },
      {
        id: "seo-specialist",
        role: "SEO Specialist",
        description: "Optimizes content for search engines and target keywords",
        personalityId: "technical-expert",
        modelId: "google/gemini-pro",
        isCoordinator: false,
        capabilities: ["keyword-research", "seo-optimization", "content-analysis"],
        taskTypes: ["keyword-analysis", "content-optimization"]
      },
      {
        id: "editor",
        role: "Editor",
        description: "Reviews and refines content for clarity, accuracy, and style",
        personalityId: "researcher",
        modelId: "anthropic/claude-3-sonnet",
        isCoordinator: false,
        capabilities: ["editing", "fact-checking", "style-consistency"],
        taskTypes: ["content-editing", "quality-assurance"]
      }
    ],
    workflow: {
      steps: [
        {
          id: "content-planning",
          name: "Content Planning",
          description: "Define content goals, target audience, and key messages",
          agentId: "content-director",
          inputInstructions: "Based on the user's requirements, create a content plan including target audience, key messages, content format, and distribution channels.",
          outputFormat: "Content brief with clear objectives, target audience, tone, and deliverables",
          nextStepId: "keyword-research"
        },
        {
          id: "keyword-research",
          name: "Keyword Research",
          description: "Identify relevant keywords and search trends",
          agentId: "seo-specialist",
          inputInstructions: "Research relevant keywords for the content topic. Identify primary and secondary keywords, search volume, and competition.",
          outputFormat: "Keyword report with primary/secondary keywords and SEO recommendations",
          nextStepId: "content-creation"
        },
        {
          id: "content-creation",
          name: "Content Creation",
          description: "Create the initial content draft",
          agentId: "creative-writer",
          inputInstructions: "Using the content brief and keyword report, create engaging content that addresses the objectives. Incorporate primary keywords naturally.",
          outputFormat: "Complete content draft formatted appropriately for the intended platform",
          nextStepId: "seo-optimization"
        },
        {
          id: "seo-optimization",
          name: "SEO Optimization",
          description: "Optimize content for search engines",
          agentId: "seo-specialist",
          inputInstructions: "Review the draft and optimize for SEO. Ensure proper keyword usage, meta descriptions, headings, and structure.",
          outputFormat: "SEO-optimized content with recommendations for meta tags and descriptions",
          nextStepId: "content-editing"
        },
        {
          id: "content-editing",
          name: "Content Editing",
          description: "Edit content for clarity, flow, and engagement",
          agentId: "editor",
          inputInstructions: "Edit the content for clarity, coherence, grammar, and style. Ensure it aligns with the content brief and target audience.",
          outputFormat: "Edited content with tracked changes and editorial notes",
          nextStepId: "final-review"
        },
        {
          id: "final-review",
          name: "Final Review",
          description: "Review the final content before delivery",
          agentId: "content-director",
          inputInstructions: "Review the complete content package. Ensure it meets all objectives, maintains brand voice, and is ready for publication.",
          outputFormat: "Final content with approval notes or revision requests",
          conditionalNext: [
            {
              condition: "needs_revision",
              nextStepId: "content-revision"
            },
            {
              condition: "approved",
              nextStepId: "content-delivery"
            }
          ]
        },
        {
          id: "content-revision",
          name: "Content Revision",
          description: "Revise content based on final review feedback",
          agentId: "creative-writer",
          inputInstructions: "Address all feedback from the final review. Make necessary revisions to improve the content.",
          outputFormat: "Revised content addressing all review comments",
          nextStepId: "final-review"
        },
        {
          id: "content-delivery",
          name: "Content Delivery",
          description: "Prepare and deliver the final content package",
          agentId: "content-director",
          inputInstructions: "Finalize the content for delivery. Include all components such as main content, meta descriptions, and any additional materials.",
          outputFormat: "Complete content package ready for publication or distribution"
        }
      ],
      defaultRoute: ["content-planning", "keyword-research", "content-creation", "seo-optimization", "content-editing", "final-review", "content-delivery"],
      conditionalRoutes: [
        {
          condition: "needs_revision",
          stepSequence: ["final-review", "content-revision", "final-review", "content-delivery"]
        }
      ],
      maxIterations: 2,
      requireUserApproval: true
    }
  }
];