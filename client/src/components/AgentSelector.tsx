
import React, { useState, useEffect } from 'react';
import { Button } from './ui';
import AvatarWithFallback from './AvatarWithFallback';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface Agent {
  id: string;
  name: string;
  description: string;
  avatarPath?: string;
  capabilities?: string[];
}

interface AgentSelectorProps {
  onAgentSelect: (agentId: string) => void;
  selectedAgentId?: string;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ onAgentSelect, selectedAgentId }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Fetch both regular personas and framework specialists
        const [personasRes, specialistsRes] = await Promise.all([
          fetch('/api/agent-personas'),
          fetch('/api/agents/framework-specialists')
        ]);
        
        const personas = await personasRes.json();
        const specialists = await specialistsRes.json();
        
        setAgents([...personas, ...specialists]);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, []);

  const filters = [
    { id: 'all', label: 'All Agents' },
    { id: 'persona', label: 'Personas' },
    { id: 'specialist', label: 'Specialists' },
    { id: 'coding', label: 'Coding' },
    { id: 'research', label: 'Research' }
  ];

  const filterAgents = (agent: Agent) => {
    // Filter by search term
    const matchesSearch = 
      !searchTerm || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Filter by category
    if (!activeFilter || activeFilter === 'all') return true;
    
    if (activeFilter === 'persona') {
      // Personas don't have capabilities typically
      return !agent.capabilities || agent.capabilities.length === 0;
    }
    
    if (activeFilter === 'specialist') {
      // Specialists have capabilities
      return agent.capabilities && agent.capabilities.length > 0;
    }
    
    // Filter by capability
    return agent.capabilities?.includes(activeFilter);
  };

  const filteredAgents = agents.filter(filterAgents);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id === activeFilter ? null : filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredAgents.map(agent => (
            <div
              key={agent.id}
              className={`border ${
                selectedAgentId === agent.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              } rounded-lg p-4 cursor-pointer hover:shadow-md transition-all`}
              onClick={() => onAgentSelect(agent.id)}
            >
              <div className="flex items-center">
                <AvatarWithFallback
                  src={agent.avatarPath || ''}
                  fallbackSrc="/frankx-avatar-fallback.png"
                  alt={agent.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{agent.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {agent.description}
                  </p>
                </div>
              </div>
              
              {agent.capabilities && agent.capabilities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map((capability, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {capability}
                    </span>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      +{agent.capabilities.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentSelector;
