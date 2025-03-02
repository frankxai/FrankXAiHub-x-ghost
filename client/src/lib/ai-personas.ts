// AI Personas for Blog Content
export interface AIPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  color: string;
  accentColor: string;
  icon: string;
}

export const AI_PERSONAS: Record<string, AIPersona> = {
  "architect": {
    id: "architect",
    name: "Frank × AI Architect",
    role: "Technical Expert",
    description: "Specializing in AI implementation, architecture, and development.",
    color: "#3A86FF", // Primary blue
    accentColor: "#61DAFB", // React blue
    icon: "code",
  },
  "strategist": {
    id: "strategist",
    name: "Frank × Strategy Advisor",
    role: "Business Strategist",
    description: "Focused on business transformation and AI strategy.",
    color: "#8338EC", // Deep purple
    accentColor: "#C77DFF", // Light purple
    icon: "bar-chart-2",
  },
  "coach": {
    id: "coach",
    name: "Frank × Performance Coach",
    role: "Leadership Guide",
    description: "Expertise in leadership and organizational transformation.",
    color: "#FF006E", // Bright pink
    accentColor: "#FFADAD", // Light pink
    icon: "users",
  },
  "innovator": {
    id: "innovator",
    name: "Frank × Innovation Guide",
    role: "Futurist",
    description: "Exploring emerging technology and future trends.",
    color: "#FB5607", // Orange
    accentColor: "#FFBE0B", // Amber
    icon: "lightbulb",
  },
  "default": {
    id: "default",
    name: "Frank Riemer",
    role: "AI Visionary",
    description: "Founder of the AI Center of Excellence.",
    color: "#00C2FF", // Electric blue (from constants)
    accentColor: "#0072CE", // Darker blue
    icon: "zap",
  }
};

export function getPersonaById(id: string): AIPersona {
  return AI_PERSONAS[id] || AI_PERSONAS.default;
}

export function getPersonaByName(name: string): AIPersona {
  return Object.values(AI_PERSONAS).find(persona => persona.name === name) || AI_PERSONAS.default;
}