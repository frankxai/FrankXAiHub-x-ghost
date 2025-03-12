import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, Button, Spinner } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextWindow?: number;
  capabilities?: string[];
  freeInOpenRouter?: boolean;
}

interface PersonalityOption {
  id: string;
  name: string;
  description: string;
  systemPrompt?: string;
  traits?: string[];
  strengths?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  modelId: string;
  personalityId: string;
  created: Date;
  lastUpdated: Date;
}

export function OpenWebUIPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Simulate app initialization
  useEffect(() => {
    // For a smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
      // Redirect user immediately to OpenWebUI interface
      window.location.href = '/openwebui/';
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Create a new chat session on initial load if none exists
  useEffect(() => {
    if (chatSessions.length === 0) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: 'New Conversation',
        modelId: selectedModel,
        personalityId: selectedPersonality,
        created: new Date(),
        lastUpdated: new Date()
      };
      
      setChatSessions([newSession]);
      setActiveChatId(newSession.id);
    }
  }, [chatSessions.length, selectedModel, selectedPersonality]);
  
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
          const defaultPersonality = data.find((p: PersonalityOption) => p.id === 'frankx-default');
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

  // Get the active personality
  const activePersonality = useMemo(() => {
    return personalities.find(p => p.id === selectedPersonality);
  }, [personalities, selectedPersonality]);

  // Get the active model
  const activeModel = useMemo(() => {
    return models.find(m => m.id === selectedModel);
  }, [models, selectedModel]);

  // Get the active chat session
  const activeChat = useMemo(() => {
    return chatSessions.find(c => c.id === activeChatId);
  }, [chatSessions, activeChatId]);
  
  // Filter models based on search
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return models;
    
    return models.filter(model => 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (model.description && model.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [models, searchQuery]);

  // Filter personalities based on search
  const filteredPersonalities = useMemo(() => {
    if (!searchQuery.trim()) return personalities;
    
    return personalities.filter(persona => 
      persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      persona.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [personalities, searchQuery]);

  // Handle message sending
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
      
      // Update last updated time for the active chat
      if (activeChat) {
        setChatSessions(prev => 
          prev.map(chat => 
            chat.id === activeChat.id 
              ? { ...chat, lastUpdated: new Date() } 
              : chat
          )
        );
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to communicate with AI service. Please try again later.');
    }
  };

  // Create a new chat
  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      modelId: selectedModel,
      personalityId: selectedPersonality,
      created: new Date(),
      lastUpdated: new Date()
    };
    
    setChatSessions(prev => [...prev, newSession]);
    setActiveChatId(newSession.id);
  };

  // Delete a chat
  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    
    if (activeChatId === chatId) {
      // Set a new active chat if the current one is deleted
      if (chatSessions.length > 1) {
        const newActiveChat = chatSessions.find(chat => chat.id !== chatId);
        if (newActiveChat) {
          setActiveChatId(newActiveChat.id);
        }
      } else {
        createNewChat();
      }
    }
  };

  // Change the active chat
  const switchToChat = (chatId: string) => {
    const chat = chatSessions.find(c => c.id === chatId);
    if (chat) {
      setActiveChatId(chatId);
      setSelectedModel(chat.modelId);
      setSelectedPersonality(chat.personalityId);
    }
  };

  // Update chat title
  const updateChatTitle = (chatId: string, newTitle: string) => {
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: newTitle } 
          : chat
      )
    );
  };

  // Create a new persona
  const handleCreatePersona = () => {
    if (!newPersona.name || !newPersona.description || !newPersona.systemPrompt) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields for the new persona.',
        variant: 'destructive',
      });
      return;
    }

    // In a real implementation, this would call an API endpoint
    toast({
      title: 'Feature Coming Soon',
      description: 'Creating custom personas will be available in a future update.',
    });

    setIsCreatingPersona(false);
    setNewPersona({
      name: '',
      description: '',
      systemPrompt: ''
    });
  };

  // Loading state
  if (loadingModels || loadingPersonalities) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="p-8 flex flex-col items-center">
          <Spinner size="lg" className="mb-4" />
          <p>Loading FrankX.AI services...</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 h-full border-r flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold">FrankX.AI Chat</h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          {/* New chat button */}
          <div className="p-3">
            <Button onClick={createNewChat} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
          
          {/* Chat history */}
          <div className="flex-1 overflow-y-auto p-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Conversations</h3>
            {chatSessions.map(chat => (
              <div 
                key={chat.id}
                className={`p-2 rounded-md mb-1 flex justify-between items-center cursor-pointer ${
                  chat.id === activeChatId 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary'
                }`}
                onClick={() => switchToChat(chat.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="text-sm truncate">{chat.title}</span>
                </div>
                {chat.id === activeChatId && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {/* Sidebar footer */}
          <div className="p-3 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSettingsOpen(true)}
              className="w-full flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat header */}
        <div className="p-4 border-b flex items-center justify-between">
          {!sidebarOpen && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(true)}
              className="mr-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-4 flex-1">
            {/* Model selector */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-secondary cursor-pointer"
                    onClick={() => setShowModelSelector(true)}
                  >
                    <Cpu className="h-4 w-4" />
                    <span className="text-sm font-medium truncate max-w-[12rem]">
                      {activeModel?.name || selectedModel}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select AI model</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Personality selector */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-secondary cursor-pointer"
                    onClick={() => setShowPersonaSelector(true)}
                  >
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-medium truncate max-w-[12rem]">
                      {activePersonality?.name || selectedPersonality}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select persona</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLocation('/')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        {/* Chat interface */}
        <div className="flex-1 overflow-hidden">
          <OpenWebUI
            modelId={selectedModel}
            personalityId={selectedPersonality}
            aiName={activePersonality?.name || 'AI Assistant'}
            onSendMessage={handleSendMessage}
            fullScreen={true}
            className="h-full border-0"
          />
        </div>
      </div>
      
      {/* Model selector drawer */}
      <Drawer open={showModelSelector} onOpenChange={setShowModelSelector}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Select AI Model</DrawerTitle>
            <DrawerDescription>
              Choose the AI model that best suits your needs
            </DrawerDescription>
            
            <div className="mt-4 mb-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search models..."
                  className="w-full rounded-md border pl-8 py-2 px-3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </DrawerHeader>
          
          <div className="p-4 overflow-auto">
            <h3 className="font-medium mb-2">Free in OpenRouter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {filteredModels
                .filter(model => model.freeInOpenRouter)
                .map(model => (
                  <div 
                    key={model.id}
                    className={`p-3 rounded-lg border cursor-pointer ${
                      selectedModel === model.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelSelector(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      <div className="font-medium text-sm">{model.name}</div>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                    {model.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {model.description}
                      </p>
                    )}
                    {model.capabilities && model.capabilities.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {model.capabilities.map(cap => (
                          <Badge key={cap} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
            
            <h3 className="font-medium mb-2">Premium Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredModels
                .filter(model => !model.freeInOpenRouter)
                .map(model => (
                  <div 
                    key={model.id}
                    className={`p-3 rounded-lg border cursor-pointer ${
                      selectedModel === model.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelSelector(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      <div className="font-medium text-sm">{model.name}</div>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                    {model.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {model.description}
                      </p>
                    )}
                    {model.capabilities && model.capabilities.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {model.capabilities.map(cap => (
                          <Badge key={cap} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          
          <DrawerFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowModelSelector(false)}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Personality selector drawer */}
      <Drawer open={showPersonaSelector} onOpenChange={setShowPersonaSelector}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Select Persona</DrawerTitle>
            <DrawerDescription>
              Choose a personality for the AI assistant
            </DrawerDescription>
            
            <div className="mt-4 mb-2 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search personas..."
                  className="w-full rounded-md border pl-8 py-2 px-3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button onClick={() => setIsCreatingPersona(true)}>
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </DrawerHeader>
          
          <div className="p-4 overflow-auto">
            <h3 className="font-medium mb-2">FrankX.AI Curated Personas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {filteredPersonalities.map(persona => (
                <div 
                  key={persona.id}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    selectedPersonality === persona.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    setSelectedPersonality(persona.id);
                    setShowPersonaSelector(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="font-medium text-sm">{persona.name}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {persona.description}
                  </p>
                  {persona.traits && persona.traits.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {persona.traits.map(trait => (
                        <Badge key={trait} variant="outline" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Create new persona form */}
            {isCreatingPersona && (
              <Card className="p-4 mb-6">
                <h3 className="font-medium mb-3">Create New Persona</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="persona-name">Name</Label>
                    <input 
                      id="persona-name"
                      className="w-full rounded-md border p-2 mt-1"
                      placeholder="Persona name"
                      value={newPersona.name}
                      onChange={(e) => setNewPersona({...newPersona, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="persona-description">Description</Label>
                    <input 
                      id="persona-description"
                      className="w-full rounded-md border p-2 mt-1"
                      placeholder="Brief description"
                      value={newPersona.description}
                      onChange={(e) => setNewPersona({...newPersona, description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="persona-prompt">System Prompt</Label>
                    <textarea 
                      id="persona-prompt"
                      className="w-full rounded-md border p-2 mt-1 h-24"
                      placeholder="Instructions for the AI"
                      value={newPersona.systemPrompt}
                      onChange={(e) => setNewPersona({...newPersona, systemPrompt: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePersona} className="flex-1">
                      <Save className="h-4 w-4 mr-1" />
                      Save Persona
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatingPersona(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            <h3 className="font-medium mb-2">My Custom Personas</h3>
            <div className="text-center p-6 border rounded-lg">
              <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Your custom personas will appear here once created.
              </p>
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={() => setIsCreatingPersona(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create a Persona
              </Button>
            </div>
          </div>
          
          <DrawerFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPersonaSelector(false)}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Settings drawer */}
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>
              Configure FrankX.AI interface settings
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4">
            <Tabs defaultValue="appearance">
              <TabsList className="mb-4">
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-1" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="api">
                  <Cloud className="h-4 w-4 mr-1" />
                  API
                </TabsTrigger>
                <TabsTrigger value="data">
                  <Database className="h-4 w-4 mr-1" />
                  Data
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        theme === 'light' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-6 w-6 mb-1" />
                      <span className="text-sm">Light</span>
                    </div>
                    
                    <div 
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-6 w-6 mb-1" />
                      <span className="text-sm">Dark</span>
                    </div>
                    
                    <div 
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        theme === 'system' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setTheme('system')}
                    >
                      <Monitor className="h-6 w-6 mb-1" />
                      <span className="text-sm">System</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-scroll">Auto-scroll chat</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically scroll to the latest message
                      </p>
                    </div>
                    <Switch id="auto-scroll" defaultChecked />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <input 
                    id="openai-key"
                    type="password"
                    className="w-full rounded-md border p-2"
                    placeholder="sk-..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally and sent directly to the API
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                  <input 
                    id="openrouter-key"
                    type="password"
                    className="w-full rounded-md border p-2"
                    placeholder="sk-..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Access a wide range of AI models through OpenRouter
                  </p>
                </div>
                
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-1" />
                  Save API Settings
                </Button>
              </TabsContent>
              
              <TabsContent value="data" className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Data Management</h3>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Export Data</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Export your chat history, personas, and settings
                    </p>
                    <Button size="sm" variant="outline">
                      Export All Data
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Import Data</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Import previously exported data
                    </p>
                    <Button size="sm" variant="outline">
                      Import Data
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-5 w-5 text-destructive" />
                      <h4 className="font-medium">Delete Data</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Permanently remove all your data from this device
                    </p>
                    <Button size="sm" variant="destructive">
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DrawerFooter>
            <Button 
              variant="outline" 
              onClick={() => setSettingsOpen(false)}
            >
              Close Settings
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default OpenWebUIPage;