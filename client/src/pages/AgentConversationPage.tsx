import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, RefreshCw, X, Save, Download, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';
import { fadeIn, pageVariants } from '@/lib/animations';

// Agent types
interface AgentConfig {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  defaultModel: string;
  defaultProvider: string;
  avatarUrl?: string;
  memoryEnabled: boolean;
}

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationSession {
  id: string;
  title: string;
  lastMessage: string;
  lastUpdated: Date;
}

const AgentConversationPage: React.FC = () => {
  const [, params] = useRoute('/agent-conversation/:agentId?');
  const agentId = params?.agentId || 'assistant';
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch available agents
  const { data: agents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['/api/agents'],
    select: (data: AgentConfig[]) => data,
  });

  // Fetch or find the current agent
  const currentAgent = agents?.find(agent => agent.id === agentId) || null;

  // Create a new conversation
  const createConversation = useMutation({
    mutationFn: async (initialMessage?: string) => {
      return apiRequest({
        url: '/api/agents/conversation',
        method: 'POST',
        body: {
          agentId,
          userId: '1', // Hardcoded for demo, should be dynamic in production
          initialMessage
        }
      });
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      if (data.initialResponse) {
        setMessages([
          {
            id: 'initial',
            role: 'assistant',
            content: data.initialResponse,
            timestamp: new Date(data.timestamp)
          }
        ]);
      }
    },
    onError: () => {
      toast.error('Failed to create conversation');
    }
  });

  // Send a message
  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!sessionId) {
        // Create a new conversation with this message
        createConversation.mutate(message);
        return null;
      }
      
      return apiRequest({
        url: '/api/agents/message',
        method: 'POST',
        body: {
          agentId,
          userId: '1', // Hardcoded for demo
          sessionId,
          message
        }
      });
    },
    onSuccess: (data) => {
      if (data) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.response,
            timestamp: new Date(data.timestamp)
          }
        ]);
        scrollToBottom();
      }
    },
    onError: () => {
      toast.error('Failed to send message');
    }
  });

  // Clear conversation
  const clearConversation = useMutation({
    mutationFn: async () => {
      if (!sessionId) return null;
      
      return apiRequest({
        url: '/api/agents/clear-conversation',
        method: 'POST',
        body: {
          agentId,
          userId: '1', // Hardcoded for demo
          sessionId
        }
      });
    },
    onSuccess: () => {
      setMessages([]);
      toast.success('Conversation cleared');
    },
    onError: () => {
      toast.error('Failed to clear conversation');
    }
  });

  useEffect(() => {
    // Initialize a conversation when component mounts or agent changes
    if (currentAgent && !sessionId && !createConversation.isPending) {
      createConversation.mutate(undefined);
    }
  }, [currentAgent, agentId]);

  useEffect(() => {
    // Reset state when agent changes
    setSessionId(null);
    setMessages([]);
    setInput('');
  }, [agentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to state
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        timestamp: new Date()
      }
    ]);
    
    // Send to API
    sendMessage.mutate(input);
    
    // Clear input
    setInput('');
    
    // Focus back on input
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoadingAgents) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto py-4 px-4 md:px-0 h-[calc(100vh-4rem)]"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="flex h-full flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <Card>
            <CardHeader className="py-4 px-4">
              <CardTitle className="text-lg">Available Agents</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
              <div className="space-y-1">
                {agents?.map((agent) => (
                  <Button
                    key={agent.id}
                    variant={agent.id === agentId ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      window.location.href = `/agent-conversation/${agent.id}`;
                    }}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={agent.avatarUrl || `/images/agents/${agent.id}.png`} />
                      <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{agent.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {currentAgent && (
            <Card>
              <CardHeader className="py-4 px-4">
                <CardTitle className="text-lg">Agent Info</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-0">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Model</p>
                    <p className="text-sm text-muted-foreground">{currentAgent.defaultModel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Provider</p>
                    <p className="text-sm text-muted-foreground">{currentAgent.defaultProvider}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Capabilities</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentAgent.capabilities.map((capability) => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Memory</p>
                    <p className="text-sm text-muted-foreground">
                      {currentAgent.memoryEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-auto space-y-2">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => clearConversation.mutate(undefined)}
              disabled={!sessionId || clearConversation.isPending || messages.length === 0}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              New Conversation
            </Button>
          </div>
        </div>
        
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="py-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle>
                {currentAgent ? currentAgent.name : 'Select an Agent'}
              </CardTitle>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Agent Settings</SheetTitle>
                    <SheetDescription>
                      Configure how this agent responds to your questions.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Response Temperature</p>
                      <Select defaultValue="0.7">
                        <SelectTrigger>
                          <SelectValue placeholder="Select temperature" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.1">0.1 - Very Precise</SelectItem>
                          <SelectItem value="0.4">0.4 - More Focused</SelectItem>
                          <SelectItem value="0.7">0.7 - Balanced</SelectItem>
                          <SelectItem value="0.9">0.9 - More Creative</SelectItem>
                          <SelectItem value="1.0">1.0 - Very Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Model</p>
                      <Select defaultValue={currentAgent?.defaultModel || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai/gpt-4o">GPT-4o (OpenAI)</SelectItem>
                          <SelectItem value="anthropic/claude-3-opus">Claude 3 Opus (Anthropic)</SelectItem>
                          <SelectItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Anthropic)</SelectItem>
                          <SelectItem value="meta/llama-3-70b">Llama 3 70B (Meta)</SelectItem>
                          <SelectItem value="mistral/mistral-large">Mistral Large (Mistral AI)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {currentAgent && (
              <p className="text-sm text-muted-foreground mt-1">{currentAgent.description}</p>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                  >
                    <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={currentAgent?.avatarUrl || `/images/agents/${agentId}.png`} />
                          <AvatarFallback>{currentAgent?.name.substring(0, 2) || 'AI'}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                        <div className={`text-xs text-muted-foreground mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </motion.div>
                ))}
                {(createConversation.isPending || sendMessage.isPending) && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] flex-row">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={currentAgent?.avatarUrl || `/images/agents/${agentId}.png`} />
                        <AvatarFallback>{currentAgent?.name.substring(0, 2) || 'AI'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="rounded-lg px-3 py-2 bg-muted">
                          <Spinner size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!currentAgent || createConversation.isPending}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim() || !currentAgent || createConversation.isPending || sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Spinner size="sm" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default AgentConversationPage;