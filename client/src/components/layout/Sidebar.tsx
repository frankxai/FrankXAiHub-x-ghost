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

// Assuming NavItem component exists and is correctly imported.  This is a placeholder and needs to be replaced with your actual component.
const NavItem = ({icon, href, label}) => (
    <li>
        <a href={href}>{icon} {label}</a>
    </li>
);


// Example of how to use NavItem in a sidebar (replace with your actual sidebar component)
const Sidebar = () => {
    return (
        <ul>
            {navigation.map((item) => (
              <NavItem key={item.name} icon={item.icon} href={item.href} label={item.name} />
            ))}
            <NavItem icon="file" href="/file-converter" label="File Converter" />
            <NavItem icon="robot" href="/agents" label="AI Agents" /> {/* Added AI Agents */}
        </ul>
    );
};

// ...rest of the code