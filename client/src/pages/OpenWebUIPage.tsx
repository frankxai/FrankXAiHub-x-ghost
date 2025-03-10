import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { OpenWebUI } from '@/components/chat/OpenWebUI';
import { Button, Card, Spinner } from '@/components/ui';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Settings } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

interface PersonalityOption {
  id: string;
  name: string;
  description: string;
}

export function OpenWebUIPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [models, setModels] = useState<ModelOption[]>([]);
  const [personalities, setPersonalities] = useState<PersonalityOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('openai/gpt-4o');
  const [selectedPersonality, setSelectedPersonality] = useState<string>('helpful-assistant');
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingPersonalities, setLoadingPersonalities] = useState(true);
  
  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/ai/models');
        
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        
        const data = await response.json();
        setModels(data);
        
        // Set default model if available
        if (data.length > 0) {
          const openAIModel = data.find((model: ModelOption) => model.id === 'openai/gpt-4o');
          if (openAIModel) {
            setSelectedModel(openAIModel.id);
          } else {
            setSelectedModel(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        toast({
          title: 'Error',
          description: 'Failed to load AI models. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoadingModels(false);
      }
    };
    
    fetchModels();
  }, [toast]);
  
  // Fetch available personalities
  useEffect(() => {
    const fetchPersonalities = async () => {
      try {
        const response = await fetch('/api/ai/personalities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch personalities');
        }
        
        const data = await response.json();
        setPersonalities(data);
        
        // Set default personality if available
        if (data.length > 0) {
          const defaultPersonality = data.find((p: PersonalityOption) => p.id === 'helpful-assistant');
          if (defaultPersonality) {
            setSelectedPersonality(defaultPersonality.id);
          } else {
            setSelectedPersonality(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching personalities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load AI personalities. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoadingPersonalities(false);
      }
    };
    
    fetchPersonalities();
  }, [toast]);
  
  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          modelId: selectedModel,
          personalityId: selectedPersonality,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to communicate with AI service. Please try again later.');
    }
  };
  
  if (loadingModels || loadingPersonalities) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="p-8 flex flex-col items-center">
          <Spinner size="lg" className="mb-4" />
          <p>Loading AI services...</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setLocation('/')}
          className="flex items-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Button>
        
        <h1 className="text-2xl font-bold">FrankX.AI Chat</h1>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            toast({
              title: "Settings",
              description: "AI configuration settings coming soon!",
            });
          }}
          className="flex items-center space-x-1"
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
      </div>
      
      <OpenWebUI
        modelId={selectedModel}
        personalityId={selectedPersonality}
        aiName={
          personalities.find(p => p.id === selectedPersonality)?.name || 
          'AI Assistant'
        }
        onSendMessage={handleSendMessage}
        fullScreen={true}
        className="shadow-lg border"
      />
    </div>
  );
}

export default OpenWebUIPage;