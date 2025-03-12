import React from 'react';
import { useLocation } from 'wouter';
import { HomeIcon, BookOpen, Archive, Music, User2, BrainCircuit, TestTube, FileText, MessageSquare } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  href: string;
  label: string;
}

const Sidebar: React.FC = () => {
  const [pathname] = useLocation();
  
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
      name: 'OpenWebUI',
      href: '/openwebui',
      icon: MessageSquare,
      current: pathname === '/openwebui'
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
    }
  ];

  // NavItem component for rendering individual navigation items
  const NavItem: React.FC<NavItemProps> = ({ icon: Icon, href, label }) => (
    <li className="mb-2">
      <a 
        href={href} 
        className={`flex items-center px-4 py-2 rounded-md transition-colors
                    ${pathname === href 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      >
        <Icon className="mr-2 h-5 w-5" />
        <span>{label}</span>
      </a>
    </li>
  );

  // Render the sidebar navigation
  return (
    <div className="bg-background border-r border-border h-full w-64 px-2 py-4">
      <div className="mb-6 px-4">
        <h2 className="text-xl font-bold">FrankX AI</h2>
        <p className="text-sm text-muted-foreground">Advanced AI Platform</p>
      </div>
      <nav>
        <ul className="space-y-1">
          {navigation.map((item) => (
            <NavItem 
              key={item.name} 
              icon={item.icon} 
              href={item.href} 
              label={item.name} 
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;