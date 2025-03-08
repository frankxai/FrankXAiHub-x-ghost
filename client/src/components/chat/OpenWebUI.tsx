import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Settings, X, ChevronDown, Download, Upload, MoreVertical, Clock, AlignLeft, Image, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import MarkdownRenderer from '@/components/ui/markdown-renderer';

// Types
interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: string;
  model: string;
  personalityId: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  description?: string;
  avatarPath?: string;
  capabilities: string[];
}

interface Personality {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  traits: string[];
  tone: string;
}

// Helper to generate unique IDs
const generateId = (): string => Math.random().toString(36).substring(2, 10);

// Helper for timestamps
const getCurrentTimestamp = (): string => new Date().toISOString();

const OpenWebUI: React.FC = () => {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  const [selectedPersonality, setSelectedPersonality] = useState('helpful-assistant');
  const [showSettings, setShowSettings] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch models and personalities
  const { data: models } = useQuery({
    queryKey: ['/api/ai/models'],
    queryFn: async () => {
      try {
        const response = await apiRequest<AIModel[]>({
          url: '/api/ai/models',
          method: 'GET'
        });
        return response;
      } catch (error) {
        console.error('Failed to fetch AI models:', error);
        return [] as AIModel[];
      }
    }
  });

  const { data: personalities } = useQuery({
    queryKey: ['/api/ai/personalities'],
    queryFn: async () => {
      try {
        const response = await apiRequest<Personality[]>({
          url: '/api/ai/personalities',
          method: 'GET'
        });
        return response;
      } catch (error) {
        console.error('Failed to fetch AI personalities:', error);
        return [] as Personality[];
      }
    }
  });

  // Initialize conversation on first load
  useEffect(() => {
    const newConversationId = generateId();
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Conversation',
      messages: [],
      lastUpdated: getCurrentTimestamp(),
      model: selectedModel,
      personalityId: selectedPersonality
    };
    
    setConversations([newConversation]);
    setCurrentConversationId(newConversationId);
    
    // Set up Web Speech API if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInputMessage(prev => {
          // Only use the new transcript if it's different to avoid infinite loops
          return transcript !== prev ? transcript : prev;
        });
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsSpeechRecognitionActive(false);
      };
      
      recognition.onend = () => {
        setIsSpeechRecognitionActive(false);
      };
      
      setSpeechRecognition(recognition);
    }
    
    return () => {
      if (speechRecognition) {
        speechRecognition.abort();
      }
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === currentConversationId) || null;

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentConversationId) return;
    
    // Create user message
    const userMessageId = generateId();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: inputMessage,
      timestamp: getCurrentTimestamp()
    };
    
    // Create placeholder for assistant response
    const assistantMessageId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: getCurrentTimestamp(),
      isLoading: true
    };
    
    // Update conversation with user message and loading assistant message
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    
    // Update conversation in state
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage, assistantMessage],
          lastUpdated: getCurrentTimestamp()
        };
      }
      return conv;
    }));
    
    // Clear input and set processing state
    setInputMessage('');
    setIsProcessing(true);
    
    try {
      // Get the current model and personality
      const currentModel = models?.find(m => m.id === selectedModel)?.id || 'openai/gpt-4o';
      const currentPersonality = personalities?.find(p => p.id === selectedPersonality)?.id || 'helpful-assistant';
      
      // Create the conversation history for the API
      const conversationMessages = currentConversation?.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })) || [];
      
      // Add the new user message
      conversationMessages.push({
        role: 'user',
        content: userMessage.content
      });
      
      // Call the API
      const response = await apiRequest<{ text: string }>({
        url: '/api/completion',
        method: 'POST',
        body: {
          messages: conversationMessages,
          model: currentModel,
          provider: currentModel.split('/')[0],
          personality: currentPersonality
        }
      });
      
      // Update the assistant message with the response
      setMessages(prev => prev.map(msg => {
        if (msg.id === assistantMessageId) {
          return {
            ...msg,
            content: response.text,
            isLoading: false
          };
        }
        return msg;
      }));
      
      // Update conversation in state
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: conv.messages.map(msg => {
              if (msg.id === assistantMessageId) {
                return {
                  ...msg,
                  content: response.text,
                  isLoading: false
                };
              }
              return msg;
            }),
            lastUpdated: getCurrentTimestamp()
          };
        }
        return conv;
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update assistant message to show error
      setMessages(prev => prev.map(msg => {
        if (msg.id === assistantMessageId) {
          return {
            ...msg,
            content: 'Sorry, there was an error processing your request. Please try again.',
            isLoading: false
          };
        }
        return msg;
      }));
      
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI. Please check your connection and try again.',
        variant: 'destructive'
      });
    }
    
    setIsProcessing(false);
  };

  // Handle creating a new conversation
  const handleNewConversation = () => {
    const newConversationId = generateId();
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Conversation',
      messages: [],
      lastUpdated: getCurrentTimestamp(),
      model: selectedModel,
      personalityId: selectedPersonality
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversationId(newConversationId);
    setMessages([]);
    setInputMessage('');
  };

  // Handle speech recognition toggle
  const toggleSpeechRecognition = () => {
    if (!speechRecognition) {
      toast({
        title: 'Speech Recognition Not Available',
        description: 'Your browser does not support speech recognition.',
        variant: 'destructive'
      });
      return;
    }
    
    if (isSpeechRecognitionActive) {
      speechRecognition.stop();
      setIsSpeechRecognitionActive(false);
    } else {
      try {
        speechRecognition.start();
        setIsSpeechRecognitionActive(true);
      } catch (error) {
        console.error('Speech recognition start error:', error);
        toast({
          title: 'Speech Recognition Error',
          description: 'Could not start speech recognition. It might already be active.',
          variant: 'destructive'
        });
      }
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // For now, just add a message about the file upload
    // In a real implementation, this would process the file and possibly upload it
    setInputMessage(`I'm uploading a file named "${file.name}" (${(file.size / 1024).toFixed(2)} KB)`);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
      {/* Header with model selector and settings */}
      <div className="p-4 border-b flex justify-between items-center bg-muted/30">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>{selectedModel.split('/')[1] || 'Select Model'}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {models && models.map((model) => (
                  <DropdownMenuItem 
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    {model.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>
                  {personalities && personalities.find(p => p.id === selectedPersonality)?.name || 'Personality'}
                </span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Select Personality</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {personalities && personalities.map((personality) => (
                  <DropdownMenuItem 
                    key={personality.id}
                    onClick={() => setSelectedPersonality(personality.id)}
                  >
                    {personality.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chat Settings</SheetTitle>
              </SheetHeader>
              
              <div className="py-4">
                <Tabs defaultValue="model">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="model">Model</TabsTrigger>
                    <TabsTrigger value="personality">Personality</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="model" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Select AI Model</h3>
                      <div className="grid gap-2">
                        {models && models.map((model) => (
                          <div 
                            key={model.id}
                            className={cn(
                              "flex items-center p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
                              selectedModel === model.id && "bg-muted"
                            )}
                            onClick={() => setSelectedModel(model.id)}
                          >
                            <div className="mr-3">
                              <Avatar>
                                <AvatarImage src={model.avatarPath} />
                                <AvatarFallback>{model.provider.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{model.name}</h4>
                              <p className="text-sm text-muted-foreground">{model.provider}</p>
                            </div>
                            {model.capabilities?.includes('vision') && (
                              <Badge variant="outline" className="ml-2">Vision</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="personality" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Select AI Personality</h3>
                      <p className="text-sm text-muted-foreground">
                        Personalities define how the AI responds to your messages.
                      </p>
                      <div className="grid gap-2">
                        {personalities && personalities.map((personality) => (
                          <div 
                            key={personality.id}
                            className={cn(
                              "flex flex-col p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
                              selectedPersonality === personality.id && "bg-muted"
                            )}
                            onClick={() => setSelectedPersonality(personality.id)}
                          >
                            <div className="flex items-center">
                              <h4 className="font-medium">{personality.name}</h4>
                              {personality.traits?.map((trait) => (
                                <Badge key={trait} variant="secondary" className="ml-2">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {personality.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Advanced Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure additional chat settings.
                      </p>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="memory-toggle">Conversation Memory</Label>
                            <p className="text-sm text-muted-foreground">
                              Remember context from previous messages
                            </p>
                          </div>
                          <Switch id="memory-toggle" defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="streaming-toggle">Streaming Responses</Label>
                            <p className="text-sm text-muted-foreground">
                              Show AI responses as they are generated
                            </p>
                          </div>
                          <Switch id="streaming-toggle" defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="voice-toggle">Voice Input</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable microphone for voice messages
                            </p>
                          </div>
                          <Switch id="voice-toggle" defaultChecked={isSpeechRecognitionActive} onCheckedChange={toggleSpeechRecognition} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button>Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          <Button 
            variant="outline"
            size="icon"
            onClick={handleNewConversation}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M12 3v18"/>
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-8"
            >
              <div className="rounded-full bg-muted/60 p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start a New Conversation</h3>
              <p className="text-muted-foreground max-w-md">
                Select your model and personality, then send a message to begin chatting with the AI assistant.
              </p>
            </motion.div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div 
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted rounded-tl-none"
                  )}
                >
                  {message.isLoading ? (
                    <div className="flex items-center justify-center min-h-[40px]">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <div className="markdown-container">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <Textarea
              placeholder="Type your message..."
              className="min-h-[80px] pr-24"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isProcessing}
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFileUpload}
                disabled={isProcessing}
              >
                <Paperclip size={18} />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInputChange}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSpeechRecognition}
                disabled={!speechRecognition || isProcessing}
                className={isSpeechRecognitionActive ? "text-red-500" : ""}
              >
                {isSpeechRecognitionActive ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing}
              >
                {isProcessing ? <Spinner size="sm" /> : <Send size={18} />}
              </Button>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>
              {isSpeechRecognitionActive && (
                <span className="flex items-center text-red-500">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Voice input active
                </span>
              )}
            </div>
            <div>Powered by OpenRouter | <span className="text-primary">FrankX.AI</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenWebUI;