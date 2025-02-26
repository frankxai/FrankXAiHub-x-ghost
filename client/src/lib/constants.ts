// Color scheme
export const COLORS = {
  primary: '#0056B3',
  secondary: '#00A6E0',
  accent: '#6A1B9A',
  background: '#FFFFFF',
  backgroundDark: '#121620',
  text: '#1A202C',
  textDark: '#F7FAFC',
  overlay: '#64748B',
};

// Navigation links
export const NAV_LINKS = [
  { title: 'Home', path: '/' },
  { title: 'Insights & Research', path: '/blog' },
  { title: 'AI Excellence Hub', path: '/resources' },
  { title: 'AI Assistants', path: '/conversation' },
  { title: 'Media Generation', path: '/music' },
];

// Feature sections
export const FEATURES = [
  {
    title: 'AI Center of Excellence',
    description: 'Access strategic frameworks, implementation guides, and best practices to develop your enterprise AI capability and governance structure.',
    icon: 'brain',
    iconColor: 'secondary',
    link: '/resources',
    linkText: 'Explore Resources',
  },
  {
    title: 'Enterprise AI Assistants',
    description: 'Leverage our advanced AI assistants designed specifically for enterprise use cases from strategy development to implementation planning.',
    icon: 'robot',
    iconColor: 'accent',
    link: '/conversation',
    linkText: 'Explore Assistants',
  },
  {
    title: 'AI Media Generation',
    description: 'Discover cutting-edge AI tools for content creation, digital asset generation, and creative applications across your organization.',
    icon: 'music',
    iconColor: 'primary',
    link: '/music',
    linkText: 'Explore Media Tools',
  },
];

// Company info for footer
export const COMPANY_INFO = {
  name: 'FrankX.AI',
  description: 'Enterprise AI Center of Excellence delivering strategic implementation frameworks, governance models, and transformative business solutions for Fortune 500 companies worldwide.',
  tagline: 'Enterprise AI Transformation Partner',
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
    { name: 'AI Media Generation', url: '/music' },
    { name: 'Enterprise AI Assistants', url: '/conversation' },
    { name: 'AI Leadership Training', url: '/resources' },
  ],
  resources: [
    { name: 'Insights & Research', url: '/blog' },
    { name: 'Case Studies', url: '/blog' },
    { name: 'Expert Webinars', url: '/resources' },
    { name: 'Whitepapers', url: '/resources' },
    { name: 'AI Maturity Assessment', url: '/assessment' },
  ],
  company: [
    { name: 'About FrankX.AI', url: '#' },
    { name: 'Our Approach', url: '#' },
    { name: 'Partnership Inquiries', url: '#' },
    { name: 'Contact Us', url: '#' },
    { name: 'Events & Speaking', url: '#' },
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
