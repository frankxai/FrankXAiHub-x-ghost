
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Spinner, Badge } from '../components/ui';
import AvatarWithFallback from '../components/AvatarWithFallback';

interface AgentFramework {
  id: string;
  name: string;
  description: string;
  tags: string[];
  icon: string;
  color: string;
}

interface AgentPersona {
  id: string;
  name: string;
  description: string;
  avatarPath: string;
  capabilities: string[];
  defaultModel: string;
}

const frameworks: AgentFramework[] = [
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Framework for developing applications powered by language models',
    tags: ['RAG', 'Agents', 'Chains', 'Memory'],
    icon: '🦜️🔗',
    color: 'bg-emerald-100 dark:bg-emerald-900'
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    description: 'Framework for orchestrating role-playing autonomous AI agents',
    tags: ['Role-based', 'Multi-agent', 'Workflows'],
    icon: '👥',
    color: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    id: 'autogen',
    name: 'AutoGen',
    description: 'Microsoft\'s framework for multi-agent conversation systems',
    tags: ['Conversation', 'GroupChat', 'Human-in-the-loop'],
    icon: '🤖',
    color: 'bg-purple-100 dark:bg-purple-900'
  },
  {
    id: 'llamaindex',
    name: 'LlamaIndex',
    description: 'Data framework for RAG applications with structured data',
    tags: ['Query Engines', 'Data Indexes', 'Knowledge Graphs'],
    icon: '🦙',
    color: 'bg-yellow-100 dark:bg-yellow-900'
  },
  {
    id: 'graph',
    name: 'Agent Graphs',
    description: 'Graph-based architectures for complex agent systems',
    tags: ['LangGraph', 'Workflows', 'Directed Graphs'],
    icon: '📊',
    color: 'bg-red-100 dark:bg-red-900'
  }
];

const AIFrameworkAgents: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AgentPersona[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents/framework-specialists');
        if (response.ok) {
          const data = await response.json();
          setAgents(data);
        } else {
          console.error('Failed to fetch agent data');
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleAgentSelect = (agentId: string) => {
    navigate(`/chat-with-agent/${agentId}`);
  };

  const filteredAgents = selectedFramework 
    ? agents.filter(agent => agent.id.includes(selectedFramework))
    : agents;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AI Framework Specialists</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Interact with specialized agents that are experts in different AI frameworks and architectures. 
          Each agent can help you implement, understand, and optimize systems using their specialized framework.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={selectedFramework === null ? "default" : "outline"} 
            onClick={() => setSelectedFramework(null)}
            className="px-4 py-2"
          >
            All Frameworks
          </Button>
          
          {frameworks.map(framework => (
            <Button
              key={framework.id}
              variant={selectedFramework === framework.id ? "default" : "outline"}
              onClick={() => setSelectedFramework(framework.id)}
              className={`px-4 py-2 ${selectedFramework === framework.id ? "" : framework.color}`}
            >
              <span className="mr-2">{framework.icon}</span>
              {framework.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <Card 
              key={agent.id} 
              className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <AvatarWithFallback
                      src={agent.avatarPath}
                      fallbackSrc="/frankx-avatar-fallback.png"
                      alt={agent.name}
                      className="w-16 h-16 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Powered by {agent.defaultModel.split('/').pop()}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  {agent.description}
                </p>
                
                <div className="mt-2 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-auto" 
                  onClick={() => handleAgentSelect(agent.id)}
                >
                  Chat with {agent.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIFrameworkAgents;
