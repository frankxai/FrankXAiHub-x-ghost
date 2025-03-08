
import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiCheck, FiZap } from 'react-icons/fi';
import { FaBrain, FaRobot } from 'react-icons/fa';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  description: string;
  strengths: string[];
}

interface ModelSelectionDropdownProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  className?: string;
}

const ModelSelectionDropdown: React.FC<ModelSelectionDropdownProps> = ({
  selectedModel,
  onModelSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/ai/available-models');
        if (response.ok) {
          const data = await response.json();
          setModels(data);
        } else {
          console.error('Failed to fetch models');
          // Fallback models if API fails
          setModels([
            {
              id: 'anthropic/claude-3-opus',
              name: 'Claude 3 Opus',
              provider: 'openrouter',
              contextWindow: 200000,
              description: 'Anthropic\'s most capable model with sophisticated reasoning',
              strengths: ['Reasoning', 'Long-form content', 'Nuanced understanding']
            },
            {
              id: 'anthropic/claude-3-sonnet',
              name: 'Claude 3 Sonnet',
              provider: 'openrouter',
              contextWindow: 180000,
              description: 'Balanced performance model for most AI agent tasks',
              strengths: ['Balanced performance', 'Cost-effective', 'Versatile']
            },
            {
              id: 'openai/gpt-4o',
              name: 'GPT-4o',
              provider: 'openrouter',
              contextWindow: 128000,
              description: 'OpenAI\'s latest model with optimal performance across tasks',
              strengths: ['Versatile', 'Well-rounded', 'Strong reasoning']
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectModel = (modelId: string) => {
    onModelSelect(modelId);
    setIsOpen(false);
  };
  
  const selectedModelData = models.find(model => model.id === selectedModel);
  
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'anthropic':
      case 'anthropic/':
        return '🌀';
      case 'openai':
      case 'openai/':
        return '🔄';
      case 'google':
      case 'google/':
        return '🌈';
      case 'mistralai':
      case 'mistralai/':
        return '💨';
      case 'meta-llama':
      case 'meta-llama/':
        return '🦙';
      default:
        return '🤖';
    }
  };
  
  const getProviderFromId = (id: string): string => {
    const parts = id.split('/');
    return parts.length > 1 ? parts[0] : 'other';
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center">
          <FaBrain className="mr-2 text-blue-500" />
          {loading ? (
            <span>Loading models...</span>
          ) : selectedModelData ? (
            <span>{selectedModelData.name}</span>
          ) : (
            <span>Select Model</span>
          )}
        </div>
        <FiChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Select AI Model
            </div>
          </div>
          
          {loading ? (
            <div className="p-4 text-center">
              <span className="animate-pulse">Loading available models...</span>
            </div>
          ) : (
            <ul className="py-1">
              {models.map(model => {
                const provider = getProviderFromId(model.id);
                const isSelected = model.id === selectedModel;
                
                return (
                  <li
                    key={model.id}
                    className={`px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={() => selectModel(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{getProviderIcon(provider)}</span>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {provider} • {(model.contextWindow / 1000).toFixed(0)}K ctx
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && <FiCheck className="text-blue-500" size={18} />}
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                      {model.description}
                    </div>
                    
                    <div className="mt-1 flex flex-wrap gap-1">
                      {model.strengths.map((strength, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          <FiZap className="mr-1 text-yellow-500" size={10} />
                          {strength}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelectionDropdown;
