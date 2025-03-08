
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from './ui';

const AIFrameworksGuide: React.FC = () => {
  const frameworks = [
    {
      id: 'langchain',
      name: 'LangChain',
      icon: '🦜️🔗',
      description: 'Build applications with LLMs through composability',
      strengths: ['Components for RAG', 'Structured chains', 'Agent frameworks'],
      color: 'border-green-500 bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'crewai',
      name: 'CrewAI',
      icon: '👥',
      description: 'Create autonomous AI agent teams with specific roles',
      strengths: ['Role-based agents', 'Sequential workflows', 'Expert teams'],
      color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'autogen',
      name: 'AutoGen',
      icon: '🤖',
      description: 'Build conversational multi-agent systems',
      strengths: ['Multi-agent chat', 'Human-in-the-loop', 'Group decision-making'],
      color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'llamaindex',
      name: 'LlamaIndex',
      icon: '🦙',
      description: 'Connect custom data sources to LLMs',
      strengths: ['Data connectors', 'Query engines', 'Knowledge graphs'],
      color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      id: 'graph',
      name: 'Agent Graphs',
      icon: '📊',
      description: 'Orchestrate complex agent systems with directed graphs',
      strengths: ['Complex workflows', 'State management', 'Emergent behavior'],
      color: 'border-red-500 bg-red-50 dark:bg-red-900/20'
    }
  ];

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Explore AI Framework Specialists</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Learn from experts specialized in different AI agent frameworks. Each provides unique capabilities for building advanced AI systems.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {frameworks.map((framework) => (
          <Card key={framework.id} className={`border-l-4 ${framework.color}`}>
            <div className="p-5">
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">{framework.icon}</span>
                <h3 className="text-xl font-bold">{framework.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{framework.description}</p>
              <ul className="mb-4">
                {framework.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-center mb-1">
                    <span className="text-green-500 mr-2">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
              <Link to="/framework-agents">
                <Button variant="outline" className="w-full">Chat with {framework.name} Expert</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/framework-agents">
          <Button>Explore All Framework Specialists</Button>
        </Link>
      </div>
    </div>
  );
};

export default AIFrameworksGuide;
