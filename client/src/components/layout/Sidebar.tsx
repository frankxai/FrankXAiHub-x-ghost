import { HomeIcon, BookOpen, Archive, Music, User2, BrainCircuit, TestTube, FileText } from 'lucide-react';

// ... (rest of the imports)

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
    current: pathname === '/'
  },
  {
    name: 'Documentation',
    href: '/docs',
    icon: BookOpen,
    current: pathname === '/docs'
  },
  {
    name: 'Examples',
    href: '/examples',
    icon: Archive,
    current: pathname === '/examples'
  },
  {
    name: 'Music Generation',
    href: '/music',
    icon: Music,
    current: pathname === '/music'
  },
  {
    name: 'AI Characters',
    href: '/characters',
    icon: User2,
    current: pathname === '/characters'
  },
  {
    name: 'AI File Converter',
    href: '/tools/file-converter',
    icon: FileText,
    current: pathname === '/tools/file-converter'
  },
  {
    name: 'AI Experiments',
    href: '/experiments',
    icon: TestTube,
    current: pathname === '/experiments'
  },
  {
    name: 'AI Models',
    href: '/models',
    icon: BrainCircuit,
    current: pathname === '/models'
  },
  // ... (rest of the navigation items)
];

// ... (rest of the code)