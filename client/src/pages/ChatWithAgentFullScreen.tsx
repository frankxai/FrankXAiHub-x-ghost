import React, { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { AICharacter } from '@shared/schema';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { OpenWebUI } from '@/components/chat/OpenWebUI';
import {
  Volume2, VolumeX, Mic, MicOff, Send, Bot, User,
  Settings, ChevronLeft, Menu, RefreshCw, Download,
  Share2, MoreVertical, Zap, Globe
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerHeader, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

// Define message interface
interface Message {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

// Define conversation thread interface
interface ConversationThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

// Placeholder components -  These would need actual implementations
const ModelSelectionDropdown = ({ selectedModel, onModelSelect }: { selectedModel: string; onModelSelect: (model: string) => void }) => {
  const models = [
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    // Add more models here...
  ];
  return (
    <select value={selectedModel} onChange={(e) => onModelSelect(e.target.value)}>
      {models.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
    </select>
  );
};

const AgentSelector = ({ onAgentSelect, selectedAgentId }: { onAgentSelect: (agentId: string) => void; selectedAgentId: string | undefined }) => {
  const agents = [
    { id: '1', name: 'Agent 1' },
    { id: '2', name: 'Agent 2' },
    // Add more agents here...
  ];
  return (
    <div>
      {agents.map(agent => (
        <button key={agent.id} onClick={() => onAgentSelect(agent.id)}>{agent.name}</button>
      ))}
    </div>
  );
};


const ChatWithAgentFullScreen: React.FC = () => {
  const [, params] = useRoute('/chat-fullscreen/:agentId');
  const agentId = params?.agentId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o'); // Default model
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [showOpenWebUI, setShowOpenWebUI] = useState(true); // Initialize OpenWebUI to be shown by default
  const [models, setModels] = useState([
    // OpenAI models
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },

    // Anthropic models
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { id: 'anthropic/claude-2', name: 'Claude 2', provider: 'Anthropic' },

    // Meta models
    { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', provider: 'Meta' },

    // Mistral models
    { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral AI' },

    // Google models
    { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  ]);
  const [toneOptions, setToneOptions] = useState([
    { id: 'professional', name: 'Professional' },
    { id: 'friendly', name: 'Friendly' },
    { id: 'enthusiastic', name: 'Enthusiastic' },
    { id: 'expert', name: 'Expert' },
    { id: 'creative', name: 'Creative' },
  ]);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [temperature, setTemperature] = useState(0.7);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch agent data
  const { data: agents, isLoading: isLoadingAgents } = useQuery<AICharacter[]>({
    queryKey: ['/api/ai-characters'],
  });

  const agent = agents?.find(a => a.id === Number(agentId));

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize with default thread
  useEffect(() => {
    if (agent) {
      const defaultThread: ConversationThread = {
        id: 'default',
        title: 'New Conversation',
        lastMessage: '',
        timestamp: new Date(),
        messages: []
      };

      setThreads([defaultThread]);
      setActiveThread('default');

      // Add greeting message
      const greeting: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: `Hello! I'm ${agent.name}. I can help you achieve financial freedom using AI agents. What would you like to know about generating wealth with AI?`,
        timestamp: new Date()
      };

      setMessages([greeting]);

      // Update thread with greeting
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === 'default'
            ? { ...thread, lastMessage: greeting.content, messages: [greeting] }
            : thread
        )
      );
    }
  }, [agent]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !agent) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Add thinking message
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      content: '...',
      timestamp: new Date(),
      isThinking: true
    };

    setMessages(prev => [...prev, thinkingMessage]);
    setInput('');
    setIsLoading(true);

    // Update thread
    if (activeThread) {
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === activeThread
            ? {
              ...thread,
              lastMessage: userMessage.content,
              timestamp: new Date(),
              messages: [...thread.messages, userMessage]
            }
            : thread
        )
      );
    }

    try {
      // Make API request
      const response = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: agent.name,
          message: userMessage.content,
          model: selectedModel,
          temperature: temperature,
          tone: selectedTone,
          context: `You are ${agent.name}, an AI agent focusing on helping people achieve financial freedom using AI technologies. You provide expert guidance on building passive income streams, automating tasks, and leveraging AI to create wealth.`
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json();

      // Remove thinking message
      setMessages(prev => prev.filter(msg => !msg.isThinking));

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        content: responseData.message || `I'd be happy to discuss how AI can help you build wealth through passive income streams. There are several approaches we could explore based on your skills and interests. Would you like to focus on creating AI agents for others, developing automated systems, or investing in AI-driven opportunities?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update thread
      if (activeThread) {
        setThreads(prevThreads =>
          prevThreads.map(thread =>
            thread.id === activeThread
              ? {
                ...thread,
                lastMessage: aiMessage.content,
                timestamp: new Date(),
                messages: [...thread.messages.filter(msg => !msg.isThinking), userMessage, aiMessage]
              }
              : thread
          )
        );
      }
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Remove thinking message
      setMessages(prev => prev.filter(msg => !msg.isThinking));

      // Add fallback response
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        content: `I understand you're interested in ${userMessage.content.substring(0, 30)}${userMessage.content.length > 30 ? '...' : ''}. As your financial freedom AI coach, I recommend focusing on creating scalable passive income systems using AI. Would you like me to explain some profitable strategies that have worked for others?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update thread
      if (activeThread) {
        setThreads(prevThreads =>
          prevThreads.map(thread =>
            thread.id === activeThread
              ? {
                ...thread,
                lastMessage: aiMessage.content,
                timestamp: new Date(),
                messages: [...thread.messages.filter(msg => !msg.isThinking), userMessage, aiMessage]
              }
              : thread
          )
        );
      }

      toast({
        title: "Connection Error",
        description: "Using fallback response. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create new thread
  const createNewThread = () => {
    const newThread: ConversationThread = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };

    setThreads(prev => [newThread, ...prev]);
    setActiveThread(newThread.id);
    setMessages([]);

    // Add greeting
    if (agent) {
      const greeting: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: `Hello! I'm ${agent.name}. How can I help you achieve financial freedom using AI today?`,
        timestamp: new Date()
      };

      setMessages([greeting]);

      // Update thread
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === newThread.id
            ? { ...thread, lastMessage: greeting.content, messages: [greeting] }
            : thread
        )
      );
    }
  };

  // Switch thread
  const switchThread = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setActiveThread(threadId);
      setMessages(thread.messages);
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col w-80 border-r border-border bg-card transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Bot className="h-3 w-3 text-primary-foreground" />
            </span>
            FrankX.AI
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* New chat button */}
        <div className="p-4">
          <Button
            className="w-full justify-start gap-2"
            onClick={createNewThread}
          >
            <Zap className="h-4 w-4" />
            New conversation
          </Button>
        </div>

        {/* Conversation threads */}
        <div className="flex-1 overflow-y-auto p-2">
          {threads.map(thread => (
            <button
              key={thread.id}
              onClick={() => switchThread(thread.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg mb-1 text-sm hover:bg-accent transition-colors",
                activeThread === thread.id && "bg-accent"
              )}
            >
              <div className="font-medium truncate">{thread.title}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {thread.lastMessage || "No messages yet"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(thread.timestamp)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-border">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Settings</DrawerTitle>
                <DrawerDescription>Customize your AI experience</DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <h3 className="text-sm font-medium mb-2">Model Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature: {temperature}</Label>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(values) => setTemperature(values[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher values produce more creative responses, lower values more predictable ones.
                    </p>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat header */}
        <header className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {agent && (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {agent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium text-sm">{agent.name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedModel}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share conversation</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export conversation</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showOpenWebUI ? "default" : "ghost"} 
                    size="icon" 
                    onClick={() => setShowOpenWebUI(!showOpenWebUI)}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle OpenWebUI</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ModelSelectionDropdown selectedModel={selectedModel} onModelSelect={setSelectedModel} />
          </div>
        </header>

        {showOpenWebUI ? (
          /* OpenWebUI component */
          <div className="flex-1 h-full w-full">
            <OpenWebUI 
              showOpenWebUI={true}
              fullScreen={true}
              className="border-0"
            />
          </div>
        ) : (
          <>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-background">
              <div className="max-w-3xl mx-auto">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    className={cn(
                      "flex mb-6",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender === 'ai' && (
                      <Avatar className="h-8 w-8 mr-3 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {agent?.name.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-4",
                        message.sender === 'user'
                          ? "bg-primary text-primary-foreground"
                          : message.isThinking
                            ? "bg-muted text-muted-foreground animate-pulse"
                            : "bg-card border border-border"
                      )}
                    >
                      {message.isThinking ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '100ms' }}></div>
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        </div>
                      ) : (
                        <>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            {message.content.split('\n').map((line, i) => (
                              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                                {line}
                              </p>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 text-xs text-muted-foreground border-t border-border/30">
                            <span>{formatTime(message.timestamp)}</span>

                            {message.sender === 'ai' && (
                              <div className="flex gap-2">
                                <button className="hover:text-foreground transition-colors">
                                  <RefreshCw className="h-3 w-3" />
                                </button>
                                <button className="hover:text-foreground transition-colors">
                                  <Volume2 className="h-3 w-3" />
                                </button>
                                <button className="hover:text-foreground transition-colors">
                                  <MoreVertical className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8 ml-3 mt-1">
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <footer className="border-t border-border p-4 bg-background">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message..."
                    disabled={isLoading}
                    className="pr-28 py-6 rounded-full bg-card border-border"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isLoading || isListening}
                            className="text-muted-foreground"
                          >
                            <Mic className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Use voice input</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      type="submit"
                      variant="default"
                      size="icon"
                      disabled={!input.trim() || isLoading}
                      className="rounded-full"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-normal">
                      {selectedModel}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {selectedTone}
                    </Badge>
                  </div>
                  <div>
                    <span>Temp: {temperature.toFixed(1)}</span>
                  </div>
                </div>
              </form>
            </footer>
          </>
        )}
      </div>

      {/* Agent Selector Modal */}
      {showAgentSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-full">
            <h2 className="text-xl font-bold mb-4">Select an Agent</h2>
            <AgentSelector onAgentSelect={(agentId) => {
              setLocation(`/chat-fullscreen/${agentId}`);
              setShowAgentSelector(false);
            }} selectedAgentId={agentId} />
            <Button variant="ghost" onClick={() => setShowAgentSelector(false)} className="mt-4">Close</Button>
          </div>
        </div>
      )}

      {/* Settings Drawer is already included inside the sidebar footer */}
    </div>
  );
};

export default ChatWithAgentFullScreen;