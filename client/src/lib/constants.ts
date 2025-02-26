// Color scheme
export const COLORS = {
  primary: '#171717',
  secondary: '#00C2FF',
  accent: '#FF3366',
  background: '#FFFFFF',
  overlay: '#8A8F98',
};

// Navigation links
export const NAV_LINKS = [
  { title: 'Home', path: '/' },
  { title: 'Blog', path: '/blog' },
  { title: 'AI Center of Excellence', path: '/resources' },
  { title: 'AI Conversation', path: '/conversation' },
  { title: 'AI Music', path: '/music' },
];

// Feature sections
export const FEATURES = [
  {
    title: 'AI Center of Excellence',
    description: 'Build organizational AI capabilities with our proven frameworks, governance models, and training programs.',
    icon: 'brain',
    iconColor: 'secondary',
    link: '/resources',
    linkText: 'Explore Resources',
  },
  {
    title: 'Agentic AI Implementation',
    description: 'Deploy custom AI agents and copilots that transform business processes and enhance employee productivity.',
    icon: 'robot',
    iconColor: 'accent',
    link: '/conversation',
    linkText: 'Try AI Conversation',
  },
  {
    title: 'AI Music Generation',
    description: 'Create custom brand soundscapes, product sounds, and marketing audio with our cutting-edge AI music tools.',
    icon: 'music',
    iconColor: 'primary',
    link: '/music',
    linkText: 'Explore AI Music',
  },
];

// Company info for footer
export const COMPANY_INFO = {
  name: 'FrankX.AI',
  description: 'Enterprise AI transformation and implementation experts. Building the future of business with intelligent solutions.',
  social: [
    { name: 'LinkedIn', icon: 'linkedin', url: '#' },
    { name: 'Twitter', icon: 'twitter', url: '#' },
    { name: 'YouTube', icon: 'youtube', url: '#' },
    { name: 'Medium', icon: 'medium', url: '#' },
  ],
};

// Footer links
export const FOOTER_LINKS = {
  solutions: [
    { name: 'AI Center of Excellence', url: '/resources' },
    { name: 'AI Implementation', url: '/assessment' },
    { name: 'AI Music Generation', url: '/music' },
    { name: 'Enterprise Copilots', url: '/conversation' },
    { name: 'AI Training Programs', url: '/resources' },
  ],
  resources: [
    { name: 'Blog', url: '/blog' },
    { name: 'Case Studies', url: '/blog' },
    { name: 'Webinars', url: '/resources' },
    { name: 'Whitepapers', url: '/resources' },
    { name: 'AI Maturity Assessment', url: '/assessment' },
  ],
  company: [
    { name: 'About Us', url: '#' },
    { name: 'Leadership', url: '#' },
    { name: 'Careers', url: '#' },
    { name: 'Contact', url: '#' },
    { name: 'Partners', url: '#' },
  ],
};

// Industries for assessment form
export const INDUSTRIES = [
  'Select your industry',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Technology',
  'Other',
];

// Organization sizes for assessment form
export const ORG_SIZES = [
  'Select size',
  '1-50 employees',
  '51-200 employees',
  '201-1000 employees',
  '1001-5000 employees',
  '5000+ employees',
];

// AI Objectives for assessment form
export const AI_OBJECTIVES = [
  'Cost Reduction',
  'Revenue Growth',
  'Customer Experience',
  'Employee Productivity',
  'Innovation',
  'Risk Management',
];
