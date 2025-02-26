// Color scheme - Modern dark aesthetic with electric blue accent
export const COLORS = {
  primary: '#171717', // Near black (sleek, high-tech aesthetic)
  secondary: '#00C2FF', // Electric blue (futuristic, AI innovation)
  accent: '#FF3366', // Coral red (energy, creativity)
  background: '#FFFFFF', // Clean white
  backgroundDark: '#121620', // Dark mode background
  text: '#1A202C', // Primary text color
  textDark: '#F7FAFC', // Dark mode text
  overlay: '#64748B', // Subtle overlay
};

// Navigation links reflecting personal AI journey
export const NAV_LINKS = [
  { title: 'Home', path: '/' },
  { title: 'My AI Blog', path: '/blog' },
  { title: 'AI Resources', path: '/resources' },
  { title: 'AI Agents', path: '/conversation' },
  { title: 'AI Music Lab', path: '/music' },
  { title: 'AI Journey', path: '/assessment' },
];

// Feature sections showcasing Frank's personal projects
export const FEATURES = [
  {
    title: 'My AI Agents',
    description: 'Meet the custom AI agents I\'ve created for different creative and analytical tasks. Each agent represents a unique experiment in AI personality design and specialized knowledge.',
    icon: 'bot',
    iconColor: 'secondary',
    link: '/conversation',
    linkText: 'Meet My Agents',
  },
  {
    title: 'AI Experiments',
    description: 'Explore my latest AI experiments and projects. From generative art to intelligent writing assistants, these are the personal projects that inspire my AI journey.',
    icon: 'sparkles',
    iconColor: 'accent',
    link: '/resources',
    linkText: 'See My Projects',
  },
  {
    title: 'AI Music Creation',
    description: 'Discover how I\'m using AI to compose and produce music. These tools and techniques represent my exploration of AI\'s creative potential in audio generation.',
    icon: 'music',
    iconColor: 'primary',
    link: '/music',
    linkText: 'Explore AI Music',
  },
];

// Personal brand info for footer
export const COMPANY_INFO = {
  name: 'FrankX.AI',
  description: 'My personal AI laboratory showcasing projects, agents, and experiments from my journey exploring artificial intelligence. This site documents my creative process and AI discoveries.',
  tagline: 'My Personal AI Journey',
  social: [
    { name: 'LinkedIn', icon: 'linkedin', url: '#' },
    { name: 'Twitter', icon: 'twitter', url: '#' },
    { name: 'YouTube', icon: 'youtube', url: '#' },
    { name: 'Medium', icon: 'medium', url: '#' },
  ],
};

// Footer links with personal focus
export const FOOTER_LINKS = {
  projects: [
    { name: 'Custom AI Agents', url: '/conversation' },
    { name: 'Music Generation', url: '/music' },
    { name: 'Creative AI Tools', url: '/resources' },
    { name: 'Personal Assistants', url: '/conversation' },
    { name: 'AI Experiments', url: '/blog' },
  ],
  content: [
    { name: 'AI Blog', url: '/blog' },
    { name: 'Project Insights', url: '/blog' },
    { name: 'Tutorials', url: '/resources' },
    { name: 'AI Tool Reviews', url: '/resources' },
    { name: 'Learning Resources', url: '/assessment' },
  ],
  about: [
    { name: 'About Frank', url: '#' },
    { name: 'My AI Journey', url: '#' },
    { name: 'Speaking Events', url: '#' },
    { name: 'Contact Me', url: '#' },
    { name: 'Research Notes', url: '#' },
  ],
};

// AI interests for assessment form
export const INDUSTRIES = [
  'Select your area of interest',
  'Creative AI',
  'Productivity Tools',
  'Conversational AI',
  'AI for Music',
  'AI for Writing',
  'Other',
];

// Experience levels for assessment form
export const ORG_SIZES = [
  'Select your AI experience',
  'Just starting out',
  'Some experience',
  'Regular AI user',
  'Advanced user',
  'AI developer/builder',
];

// AI learning objectives for assessment form
export const AI_OBJECTIVES = [
  'Creative Expression',
  'Personal Productivity',
  'Learning New Skills',
  'Building AI Tools',
  'Exploring AI Capabilities',
  'Understanding AI Ethics',
];
