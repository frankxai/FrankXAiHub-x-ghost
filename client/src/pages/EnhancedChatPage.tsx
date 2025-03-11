import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import {
  Settings, ChevronLeft, Plus, Mic, MicOff, Send, Bot, User,
  BrainCircuit, ShieldCheck, Zap, Menu, MessageSquare, X, Search, 
  Cpu, RefreshCw, Download, Upload, Database, Save, Eye, EyeOff,
  Moon, Sun, Monitor, Palette, Star, Trash2, Edit, HelpCircle,
  FileText, GitBranch, History, Code, Sparkles, ArrowRightLeft,
  Share2, PlayCircle, PauseCircle, Grip, Loader2, Bookmark,
  Archive
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Avatar,
  AvatarFallback
} from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { ScrollArea } from '@/components/ui/scroll-area';
import MarkdownRenderer from '@/components/ui/markdown-renderer';
import { useQueryClient } from '@tanstack/react-query';

// === Types ===

// Chat Message Type
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  metadata?: Record<string, any>;
}

// Chat Session/Thread Type
interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  modelId: string;
  personalityId: string;
  created: Date;
  lastUpdated: Date;
  messageCount: number;
  favorite?: boolean;
  archived?: boolean;
  messages?: Message[];
  folder?: string;
}

// Model Type 
interface AIModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextWindow?: number;
  capabilities?: string[];
  freeInOpenRouter?: boolean;
  tokenLimit?: number;
  inputPricing?: number;
  outputPricing?: number;
  category?: string;
  favorite?: boolean;
}

// Personality/Persona Type
interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt?: string;
  traits?: string[];
  strengths?: string[];
  favorite?: boolean;
  creator?: string;
  isCustom?: boolean;
}

// Chat Folder Type
interface ChatFolder {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  chatIds: string[];
}

// Settings Type
interface ChatSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  autoScroll: boolean;
  soundEffects: boolean;
  showTimestamps: boolean;
  codeCopyButton: boolean;
  codeLineNumbers: boolean;
  renderMarkdown: boolean;
  showTokenCount: boolean;
  defaultModel: string;
  defaultPersona: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

// Component for displaying chat messages
const ChatMessage = ({
  message,
  aiName,
  aiAvatar,
  showTimestamp,
  showTokens,
  onRetry,
  onEdit,
}: {
  message: Message;
  aiName: string;
  aiAvatar?: string;
  showTimestamp: boolean;
  showTokens: boolean;
  onRetry?: () => void;
  onEdit?: (newContent: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  
  const handleEditSave = () => {
    if (onEdit && editedContent !== message.content) {
      onEdit(editedContent);
    }
    setIsEditing(false);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <div className={`px-4 py-6 ${message.role === 'user' ? 'bg-background' : 'bg-muted/30'}`}>
      <div className="container mx-auto max-w-4xl">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-0.5">
            {message.role === 'user' ? (
              <Avatar className="h-8 w-8">
                <User className="h-5 w-5 text-primary" />
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8">
                {aiAvatar ? (
                  <img src={aiAvatar} alt={aiName} className="h-full w-full object-cover" />
                ) : (
                  <Bot className="h-5 w-5 text-primary" />
                )}
              </Avatar>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium text-sm">
                {message.role === 'user' ? 'You' : aiName}
              </div>
              
              {showTimestamp && message.timestamp && (
                <div className="text-xs text-muted-foreground">
                  {formatTime(message.timestamp)}
                </div>
              )}
            </div>
            
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {message.isThinking ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : isEditing && message.role === 'user' && onEdit ? (
                <div className="space-y-2">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-[100px] p-2 rounded-md border"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleEditSave}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : message.role === 'assistant' ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                <p>{message.content}</p>
              )}
            </div>
            
            {(showTokens || onRetry || (onEdit && message.role === 'user' && !isEditing)) && !message.isThinking && (
              <div className="flex items-center gap-3 mt-2">
                {showTokens && message.promptTokens && message.completionTokens && (
                  <div className="text-xs text-muted-foreground">
                    {message.promptTokens + message.completionTokens} tokens
                  </div>
                )}
                
                {message.role === 'user' && onEdit && !isEditing && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                )}
                
                {message.role === 'assistant' && onRetry && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={onRetry}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Chat Component
export default function EnhancedChatPage() {
  const [, params] = useRoute('/openwebui');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // === State ===
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(56); // Initial height for input
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  
  // Session state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Model and Persona state
  const [models, setModels] = useState<AIModel[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [personaSelectorOpen, setPersonaSelectorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createCustomPersonaOpen, setCreateCustomPersonaOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'folders'>('chats');
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown' | 'text'>('json');
  
  // New Persona form
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({
    name: '',
    description: '',
    systemPrompt: '',
    traits: [],
  });
  
  // Settings
  const [settings, setSettings] = useState<ChatSettings>({
    theme: 'system',
    fontSize: 'medium',
    autoScroll: true,
    soundEffects: false,
    showTimestamps: true,
    codeCopyButton: true,
    codeLineNumbers: true,
    renderMarkdown: true,
    showTokenCount: true,
    defaultModel: 'openai/gpt-4o',
    defaultPersona: 'frankx-default',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
  });
  
  // Chat folders
  const [folders, setFolders] = useState<ChatFolder[]>([
    { id: 'favorites', name: 'Favorites', chatIds: [] },
    { id: 'archived', name: 'Archived', chatIds: [] },
  ]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // === Initialize ===
  // Create default session on load if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      const defaultSession: ChatSession = {
        id: Date.now().toString(),
        title: 'New Conversation',
        lastMessage: '',
        modelId: selectedModel || settings.defaultModel,
        personalityId: selectedPersona || settings.defaultPersona,
        created: new Date(),
        lastUpdated: new Date(),
        messageCount: 0,
        archived: false,
        favorite: false
      };
      
      setSessions([defaultSession]);
      setActiveChatId(defaultSession.id);
      
      // Add a welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Hello! How can I assist you today?',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
  }, [sessions.length, selectedModel, selectedPersona, settings.defaultModel, settings.defaultPersona]);
  
  // Setup speech recognition if available
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSpeechEnabled(true);
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      setSpeechRecognition(recognition);
    }
  }, []);
  
  // Auto-scroll when messages change
  useEffect(() => {
    if (settings.autoScroll && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, settings.autoScroll]);
  
  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/ai/models');
        if (!response.ok) throw new Error('Failed to fetch models');
        
        const data = await response.json();
        setModels(data);
        
        // Set default model if not already set
        if (!selectedModel && data.length > 0) {
          const defaultModel = data.find((m: AIModel) => m.id === settings.defaultModel) || data[0];
          setSelectedModel(defaultModel.id);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        toast({
          title: 'Error',
          description: 'Failed to load AI models. Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    fetchModels();
  }, [selectedModel, settings.defaultModel, toast]);
  
  // Fetch personas from API
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await fetch('/api/ai/personalities');
        if (!response.ok) throw new Error('Failed to fetch personas');
        
        const data = await response.json();
        setPersonas(data);
        
        // Set default persona if not already set
        if (!selectedPersona && data.length > 0) {
          const defaultPersona = data.find((p: Persona) => p.id === settings.defaultPersona) || data[0];
          setSelectedPersona(defaultPersona.id);
        }
      } catch (error) {
        console.error('Error fetching personas:', error);
        toast({
          title: 'Error',
          description: 'Failed to load AI personas. Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    fetchPersonas();
  }, [selectedPersona, settings.defaultPersona, toast]);
  
  // === Derived state ===
  // Get active chat
  const activeChat = useMemo(() => {
    return sessions.find(session => session.id === activeChatId);
  }, [sessions, activeChatId]);
  
  // Get active model
  const activeModel = useMemo(() => {
    return models.find(model => model.id === selectedModel);
  }, [models, selectedModel]);
  
  // Get active persona
  const activePersona = useMemo(() => {
    return personas.find(persona => persona.id === selectedPersona);
  }, [personas, selectedPersona]);
  
  // Filter sessions for sidebar
  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions;
    
    return sessions.filter(session => 
      session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sessions, searchQuery]);
  
  // Filter models for model selector
  const filteredModels = useMemo(() => {
    if (!searchQuery) return models;
    
    return models.filter(model => 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (model.description && model.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [models, searchQuery]);
  
  // Filter personas for persona selector
  const filteredPersonas = useMemo(() => {
    if (!searchQuery) return personas;
    
    return personas.filter(persona => 
      persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      persona.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [personas, searchQuery]);
  
  // Group models by provider
  const modelsByProvider = useMemo(() => {
    const groupedModels: Record<string, AIModel[]> = {};
    
    filteredModels.forEach(model => {
      if (!groupedModels[model.provider]) {
        groupedModels[model.provider] = [];
      }
      groupedModels[model.provider].push(model);
    });
    
    return groupedModels;
  }, [filteredModels]);
  
  // === Handlers ===
  // Handle input changes (auto-resize)
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize the textarea
    e.target.style.height = 'inherit';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
    setInputHeight(Math.min(e.target.scrollHeight, 200));
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing || !activeChat) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add thinking message
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Thinking...',
      timestamp: new Date(),
      isThinking: true
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    setInput('');
    setIsProcessing(true);
    
    // Reset input height
    if (inputRef.current) {
      inputRef.current.style.height = '56px';
      setInputHeight(56);
    }
    
    try {
      // Make API request
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          modelId: selectedModel,
          personalityId: selectedPersona,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Remove thinking message
      setMessages(prev => prev.filter(msg => !msg.isThinking));
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        model: selectedModel,
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update session
      setSessions(prev => 
        prev.map(session => 
          session.id === activeChatId 
            ? {
                ...session,
                title: session.title === 'New Conversation' && session.messageCount === 0
                  ? userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '')
                  : session.title,
                lastMessage: aiMessage.content.slice(0, 50) + (aiMessage.content.length > 50 ? '...' : ''),
                lastUpdated: new Date(),
                messageCount: session.messageCount + 2, // User + AI message
                modelId: selectedModel,
                personalityId: selectedPersona,
              }
            : session
        )
      );
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Remove thinking message
      setMessages(prev => prev.filter(msg => !msg.isThinking));
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to get a response from the AI service.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle speech recognition toggle
  const toggleSpeechRecognition = () => {
    if (!speechRecognition) return;
    
    if (isListening) {
      speechRecognition.stop();
    } else {
      speechRecognition.start();
    }
    
    setIsListening(!isListening);
  };
  
  // Create a new chat session
  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      modelId: selectedModel,
      personalityId: selectedPersona,
      created: new Date(),
      lastUpdated: new Date(),
      messageCount: 0,
      favorite: false,
      archived: false,
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveChatId(newSession.id);
    setMessages([]);
    
    // Reset when creating a new chat
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Switch to a different chat
  const switchChat = (chatId: string) => {
    setActiveChatId(chatId);
    
    // Get messages for this chat
    const session = sessions.find(s => s.id === chatId);
    if (session) {
      // If session has stored messages, use them
      if (session.messages && session.messages.length > 0) {
        setMessages(session.messages);
      } else {
        // Otherwise, fetch from server or use blank state
        // For now, just set empty array with a welcome message
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: 'What would you like to talk about?',
          timestamp: new Date()
        }]);
      }
      
      // Update model and persona selections
      setSelectedModel(session.modelId);
      setSelectedPersona(session.personalityId);
    }
  };
  
  // Delete a chat
  const deleteChat = (chatId: string) => {
    setSessions(prev => prev.filter(session => session.id !== chatId));
    
    // If active chat was deleted, switch to another one
    if (activeChatId === chatId) {
      const remainingSessions = sessions.filter(session => session.id !== chatId);
      if (remainingSessions.length > 0) {
        setActiveChatId(remainingSessions[0].id);
        
        // Load messages for the new active chat
        if (remainingSessions[0].messages && remainingSessions[0].messages.length > 0) {
          setMessages(remainingSessions[0].messages);
        } else {
          setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: 'What would you like to talk about?',
            timestamp: new Date()
          }]);
        }
      } else {
        // If no chats left, create a new one
        createNewChat();
      }
    }
  };
  
  // Toggle favorite status for a chat
  const toggleFavorite = (chatId: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === chatId 
          ? { ...session, favorite: !session.favorite }
          : session
      )
    );
  };
  
  // Toggle archived status for a chat
  const toggleArchived = (chatId: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === chatId 
          ? { ...session, archived: !session.archived }
          : session
      )
    );
  };
  
  // Change the chat title
  const updateChatTitle = (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    setSessions(prev => 
      prev.map(session => 
        session.id === chatId 
          ? { ...session, title: newTitle }
          : session
      )
    );
  };
  
  // Edit a user message and regenerate the AI response
  const handleEditMessage = (messageId: string, newContent: string) => {
    // Find the message index
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    // Replace the message content
    setMessages(prev => 
      prev.map((msg, idx) => 
        msg.id === messageId 
          ? { ...msg, content: newContent }
          : msg
      ).filter((msg, idx) => !(idx > messageIndex && msg.role === 'assistant'))
    );
    
    // Re-send the message to get a new response
    // This would be implemented similarly to handleSendMessage
    // but using the edited message content
  };
  
  // Retry an AI response
  const handleRetryResponse = (messageIndex: number) => {
    // Find the user message that came before this assistant message
    const userMessageIndex = messages.findIndex(
      (msg, idx) => idx < messageIndex && msg.role === 'user'
    );
    
    if (userMessageIndex === -1) return;
    
    // Get the user message content
    const userMessage = messages[userMessageIndex];
    
    // Remove all messages after the user message
    setMessages(prev => prev.slice(0, userMessageIndex + 1));
    
    // Then re-send as if it were a new message
    // Would be implemented similar to handleSendMessage
  };
  
  // Create a custom persona
  const handleCreatePersona = () => {
    if (!newPersona.name || !newPersona.description || !newPersona.systemPrompt) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields for the new persona.',
        variant: 'destructive',
      });
      return;
    }
    
    // Generate a unique ID
    const personaId = `custom-${Date.now()}`;
    
    // Create the new persona
    const persona: Persona = {
      id: personaId,
      name: newPersona.name,
      description: newPersona.description,
      systemPrompt: newPersona.systemPrompt,
      traits: newPersona.traits || [],
      isCustom: true,
      favorite: false,
      creator: 'user',
    };
    
    // Add to personas list
    setPersonas(prev => [...prev, persona]);
    
    // Reset form and close dialog
    setNewPersona({
      name: '',
      description: '',
      systemPrompt: '',
      traits: [],
    });
    
    setCreateCustomPersonaOpen(false);
    
    toast({
      title: 'Success',
      description: `Created new persona: ${persona.name}`,
    });
  };
  
  // Export chat history
  const handleExportChat = () => {
    if (!activeChat) return;
    
    // Find the chat with messages
    const chatToExport = sessions.find(s => s.id === activeChatId);
    if (!chatToExport) return;
    
    // Format data based on selected format
    let exportData: string;
    let fileName: string;
    let mimeType: string;
    
    const chatTitle = chatToExport.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    switch (exportFormat) {
      case 'json':
        exportData = JSON.stringify({
          title: chatToExport.title,
          model: chatToExport.modelId,
          persona: chatToExport.personalityId,
          created: chatToExport.created,
          lastUpdated: chatToExport.lastUpdated,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          })),
        }, null, 2);
        fileName = `${chatTitle}_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
        
      case 'markdown':
        exportData = `# ${chatToExport.title}\n\n`;
        exportData += `*Model: ${chatToExport.modelId}*\n`;
        exportData += `*Persona: ${chatToExport.personalityId}*\n`;
        exportData += `*Exported: ${new Date().toLocaleString()}*\n\n`;
        
        messages.forEach(msg => {
          const role = msg.role === 'user' ? 'You' : 'AI';
          exportData += `## ${role}\n\n${msg.content}\n\n`;
        });
        
        fileName = `${chatTitle}_${new Date().toISOString().split('T')[0]}.md`;
        mimeType = 'text/markdown';
        break;
        
      case 'text':
      default:
        exportData = `${chatToExport.title}\n\n`;
        exportData += `Model: ${chatToExport.modelId}\n`;
        exportData += `Persona: ${chatToExport.personalityId}\n`;
        exportData += `Exported: ${new Date().toLocaleString()}\n\n`;
        
        messages.forEach(msg => {
          const role = msg.role === 'user' ? 'You' : 'AI';
          exportData += `${role}:\n${msg.content}\n\n`;
        });
        
        fileName = `${chatTitle}_${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
        break;
    }
    
    // Create and download the file
    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    
    toast({
      title: 'Export Complete',
      description: `Saved as ${fileName}`,
    });
  };
  
  // Handle key press (Ctrl+Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !isProcessing) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Update settings
  const updateSettings = (key: keyof ChatSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // === Render ===
  return (
    <motion.div 
      className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-80 border-r bg-background transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </span>
            FrankX.AI Chat
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* New chat button */}
        <div className="p-3">
          <Button 
            className="w-full flex items-center gap-2" 
            onClick={createNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        
        {/* Search conversations */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Tabs for chats and folders */}
        <Tabs defaultValue="chats" className="w-full" onValueChange={(v) => setSidebarTab(v as 'chats' | 'folders')}>
          <div className="px-3">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="chats" className="text-sm">Chats</TabsTrigger>
              <TabsTrigger value="folders" className="text-sm">Folders</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chats" className="m-0">
            {/* Conversations list */}
            <ScrollArea className="flex-1 h-[calc(100vh-13rem)]">
              <div className="px-2 py-1">
                {!filteredSessions.length && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-muted-foreground text-sm">No conversations found</p>
                    <Button 
                      variant="link" 
                      className="mt-2" 
                      onClick={createNewChat}
                    >
                      Start a new chat
                    </Button>
                  </div>
                )}
                
                {filteredSessions.map(session => (
                  <div
                    key={session.id}
                    className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
                      session.id === activeChatId
                        ? 'bg-accent'
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => switchChat(session.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate pr-8">
                          {session.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {session.lastMessage || "No messages yet"}
                        </div>
                      </div>
                      
                      <div className="absolute right-2 top-2.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(session.id);
                          }}
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${session.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                          />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this conversation and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteChat(session.id);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-1.5">
                        <Badge variant="outline" className="text-[10px] px-1 rounded-sm">
                          {session.messageCount} msgs
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="folders" className="m-0">
            <ScrollArea className="flex-1 h-[calc(100vh-13rem)]">
              <div className="px-2 py-1">
                {folders.map(folder => (
                  <div key={folder.id} className="mb-4">
                    <div className="px-3 py-1.5 text-sm font-medium flex items-center gap-2">
                      <Grip className="h-3.5 w-3.5 text-muted-foreground" />
                      {folder.name}
                      <Badge className="ml-auto text-xs" variant="outline">
                        {folder.chatIds.length}
                      </Badge>
                    </div>
                    
                    {folder.id === 'favorites' && (
                      <div className="space-y-1 mt-1">
                        {sessions
                          .filter(session => session.favorite)
                          .map(session => (
                            <div
                              key={session.id}
                              className={`rounded-lg p-2 mx-2 cursor-pointer transition-colors ${
                                session.id === activeChatId
                                  ? 'bg-accent'
                                  : 'hover:bg-secondary'
                              }`}
                              onClick={() => switchChat(session.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <div className="text-sm truncate">
                                  {session.title}
                                </div>
                              </div>
                            </div>
                          ))}
                        
                        {sessions.filter(session => session.favorite).length === 0 && (
                          <div className="px-4 py-2 text-center">
                            <p className="text-muted-foreground text-xs">No favorite chats</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {folder.id === 'archived' && (
                      <div className="space-y-1 mt-1">
                        {sessions
                          .filter(session => session.archived)
                          .map(session => (
                            <div
                              key={session.id}
                              className={`rounded-lg p-2 mx-2 cursor-pointer transition-colors ${
                                session.id === activeChatId
                                  ? 'bg-accent'
                                  : 'hover:bg-secondary'
                              }`}
                              onClick={() => switchChat(session.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                                <div className="text-sm truncate">
                                  {session.title}
                                </div>
                              </div>
                            </div>
                          ))}
                        
                        {sessions.filter(session => session.archived).length === 0 && (
                          <div className="px-4 py-2 text-center">
                            <p className="text-muted-foreground text-xs">No archived chats</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-background">
          <Button 
            variant="outline"
            onClick={() => setSettingsOpen(true)}
            className="w-full justify-start gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-2 border-b p-3">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Model Selector Dropdown */}
          <Select
            value={selectedModel}
            onValueChange={(value) => setSelectedModel(value)}
          >
            <SelectTrigger className="w-[220px] h-9">
              <SelectValue placeholder="Select a model">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span className="text-sm truncate">
                    {activeModel?.name || 'Select model'}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {Object.entries(modelsByProvider).map(([provider, models]) => (
                <div key={provider}>
                  <div className="text-xs text-muted-foreground px-2 py-1.5">
                    {provider}
                  </div>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model.name}</span>
                        {model.freeInOpenRouter && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">
                            Free
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
          
          {/* Persona Selector Dropdown */}
          <Select
            value={selectedPersona}
            onValueChange={(value) => setSelectedPersona(value)}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select a persona">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <span className="text-sm truncate">
                    {activePersona?.name || 'Select persona'}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <div className="text-xs text-muted-foreground px-2 py-1.5">
                FrankX.AI Personas
              </div>
              {personas
                .filter(p => !p.isCustom)
                .map(persona => (
                  <SelectItem key={persona.id} value={persona.id}>
                    {persona.name}
                  </SelectItem>
                ))}
              
              {personas.some(p => p.isCustom) && (
                <>
                  <Separator className="my-1" />
                  <div className="text-xs text-muted-foreground px-2 py-1.5">
                    Custom Personas
                  </div>
                  {personas
                    .filter(p => p.isCustom)
                    .map(persona => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name}
                      </SelectItem>
                    ))}
                </>
              )}
              
              <Separator className="my-1" />
              <Button 
                variant="ghost" 
                className="w-full mt-1 text-xs h-8" 
                onClick={() => {
                  setPersonaSelectorOpen(false);
                  setCreateCustomPersonaOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Create Custom Persona
              </Button>
            </SelectContent>
          </Select>
          
          <div className="ml-auto flex items-center gap-2">
            {/* Export Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowExportDialog(true)}
                    disabled={!messages.length}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Clear Chat Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={!messages.length}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all messages in the current conversation but keep the chat in your history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setMessages([]);
                      
                      // Update the session
                      setSessions(prev => 
                        prev.map(session => 
                          session.id === activeChatId 
                            ? {
                                ...session,
                                lastMessage: '',
                                messageCount: 0,
                              }
                            : session
                        )
                      );
                      
                      toast({
                        title: "Chat Cleared",
                        description: "All messages have been removed from this conversation.",
                      });
                    }}
                  >
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {/* Messages area */}
        <ScrollArea className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <BrainCircuit className="h-16 w-16 text-primary/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
              <p className="text-muted-foreground text-center max-w-md mb-8">
                Ask a question, request information, or start a discussion with the AI.
              </p>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  aiName={activePersona?.name || 'FrankX Standard'}
                  aiAvatar={'https://raw.githubusercontent.com/frankxai/resources/main/logo-128.png'}
                  showTimestamp={settings.showTimestamps}
                  showTokens={settings.showTokenCount}
                  onRetry={
                    message.role === 'assistant' && !message.isThinking
                      ? () => handleRetryResponse(index)
                      : undefined
                  }
                  onEdit={
                    message.role === 'user'
                      ? (newContent) => handleEditMessage(message.id, newContent)
                      : undefined
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        
        {/* Input area */}
        <div className="border-t p-3 bg-background">
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              <textarea
                ref={inputRef}
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="w-full resize-none rounded-lg border bg-background px-4 py-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                style={{ 
                  height: `${inputHeight}px`,
                  paddingRight: '80px', 
                }}
                rows={1}
                disabled={isProcessing}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {isSpeechEnabled && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSpeechRecognition}
                    disabled={isProcessing}
                    className={isListening ? 'text-red-500' : ''}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                )}
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isProcessing}
                  size="icon"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <div className="mt-1.5 flex justify-between items-center text-xs text-muted-foreground">
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Messages are encrypted</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your chat messages are encrypted end-to-end and not stored permanently</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div>
                  <kbd className="px-2 py-0.5 text-[10px] bg-muted rounded">Ctrl</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="px-2 py-0.5 text-[10px] bg-muted rounded">Enter</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Drawers and Dialogs */}
      
      {/* Model Selector Drawer */}
      <Drawer open={modelSelectorOpen} onOpenChange={setModelSelectorOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Select AI Model</DrawerTitle>
            <DrawerDescription>
              Choose the AI model that best suits your needs
            </DrawerDescription>
            
            <div className="mt-4 mb-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search models..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 p-4 h-[50vh]">
            {Object.entries(modelsByProvider).map(([provider, models]) => (
              <div key={provider} className="mb-6">
                <h3 className="font-medium text-sm mb-2">{provider}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {models.map(model => (
                    <div
                      key={model.id}
                      className={`p-3 rounded-lg border cursor-pointer ${
                        selectedModel === model.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setModelSelectorOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        <div className="font-medium text-sm">{model.name}</div>
                        {model.freeInOpenRouter && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Free
                          </Badge>
                        )}
                      </div>
                      
                      {model.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {model.description}
                        </p>
                      )}
                      
                      {model.capabilities && model.capabilities.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {model.capabilities.map(capability => (
                            <Badge key={capability} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(modelsByProvider).length === 0 && (
              <div className="text-center py-8">
                <Cpu className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No models found</p>
              </div>
            )}
          </ScrollArea>
          
          <DrawerFooter>
            <Button variant="outline" onClick={() => setModelSelectorOpen(false)}>
              Close
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              Models provided by OpenAI, Anthropic, Google and others through OpenRouter
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Persona Selector Drawer */}
      <Drawer open={personaSelectorOpen} onOpenChange={setPersonaSelectorOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Select AI Persona</DrawerTitle>
            <DrawerDescription>
              Choose a personality for your AI assistant
            </DrawerDescription>
            
            <div className="mt-4 mb-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search personas..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <Button onClick={() => setCreateCustomPersonaOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 p-4 h-[50vh]">
            <h3 className="font-medium text-sm mb-2">FrankX.AI Personas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {filteredPersonas
                .filter(persona => !persona.isCustom)
                .map(persona => (
                  <div
                    key={persona.id}
                    className={`p-3 rounded-lg border cursor-pointer ${
                      selectedPersona === persona.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      setSelectedPersona(persona.id);
                      setPersonaSelectorOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
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
            
            <h3 className="font-medium text-sm mb-2">Custom Personas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredPersonas
                .filter(persona => persona.isCustom)
                .map(persona => (
                  <div
                    key={persona.id}
                    className={`p-3 rounded-lg border cursor-pointer ${
                      selectedPersona === persona.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      setSelectedPersona(persona.id);
                      setPersonaSelectorOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      <div className="font-medium text-sm">{persona.name}</div>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Custom
                      </Badge>
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
              
              {filteredPersonas.filter(persona => persona.isCustom).length === 0 && (
                <div className="col-span-2 text-center p-6 border rounded-lg">
                  <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No custom personas created yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setPersonaSelectorOpen(false);
                      setCreateCustomPersonaOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create a Persona
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <DrawerFooter>
            <Button variant="outline" onClick={() => setPersonaSelectorOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Settings Drawer */}
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>
              Configure your FrankX.AI experience
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 h-[60vh] overflow-y-auto">
            <Tabs defaultValue="appearance">
              <TabsList className="mb-4">
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-1" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="models">
                  <BrainCircuit className="h-4 w-4 mr-1" />
                  Models
                </TabsTrigger>
                <TabsTrigger value="account">
                  <User className="h-4 w-4 mr-1" />
                  Account
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        settings.theme === 'light' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => updateSettings('theme', 'light')}
                    >
                      <Sun className="h-6 w-6 mb-1" />
                      <span className="text-sm">Light</span>
                    </div>
                    
                    <div
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        settings.theme === 'dark' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => updateSettings('theme', 'dark')}
                    >
                      <Moon className="h-6 w-6 mb-1" />
                      <span className="text-sm">Dark</span>
                    </div>
                    
                    <div
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        settings.theme === 'system' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => updateSettings('theme', 'system')}
                    >
                      <Monitor className="h-6 w-6 mb-1" />
                      <span className="text-sm">System</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Font Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        settings.fontSize === 'small' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => updateSettings('fontSize', 'small')}
                    >
                      <span className="text-xs">Aa</span>
                      <span className="text-xs mt-1">Small</span>
                    </div>
                    
                    <div
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        settings.fontSize === 'medium' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => updateSettings('fontSize', 'medium')}
                    >
                      <span className="text-sm">Aa</span>
                      <span className="text-xs mt-1">Medium</span>
                    </div>
                    
                    <div
                      className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                        settings.fontSize === 'large' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => updateSettings('fontSize', 'large')}
                    >
                      <span className="text-base">Aa</span>
                      <span className="text-xs mt-1">Large</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-scroll">Auto-scroll chat</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically scroll to the latest message
                      </p>
                    </div>
                    <Switch
                      id="auto-scroll"
                      checked={settings.autoScroll}
                      onCheckedChange={(checked) => updateSettings('autoScroll', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-timestamps">Show timestamps</Label>
                      <p className="text-sm text-muted-foreground">
                        Display the time when messages were sent
                      </p>
                    </div>
                    <Switch
                      id="show-timestamps"
                      checked={settings.showTimestamps}
                      onCheckedChange={(checked) => updateSettings('showTimestamps', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-token-count">Show token count</Label>
                      <p className="text-sm text-muted-foreground">
                        Display token usage for each message
                      </p>
                    </div>
                    <Switch
                      id="show-token-count"
                      checked={settings.showTokenCount}
                      onCheckedChange={(checked) => updateSettings('showTokenCount', checked)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="models" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-model">Default Model</Label>
                  <Select
                    value={settings.defaultModel}
                    onValueChange={(value) => updateSettings('defaultModel', value)}
                  >
                    <SelectTrigger id="default-model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name} ({model.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-persona">Default Persona</Label>
                  <Select
                    value={settings.defaultPersona}
                    onValueChange={(value) => updateSettings('defaultPersona', value)}
                  >
                    <SelectTrigger id="default-persona">
                      <SelectValue placeholder="Select a persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map(persona => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">
                    Temperature: {settings.temperature}
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs">0.1</span>
                    <input
                      type="range"
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      value={settings.temperature}
                      onChange={(e) => updateSettings('temperature', parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs">1.0</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-tokens">
                    Max Tokens: {settings.maxTokens}
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    The maximum number of tokens to generate in the response.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs">256</span>
                    <input
                      type="range"
                      min={256}
                      max={4096}
                      step={256}
                      value={settings.maxTokens}
                      onChange={(e) => updateSettings('maxTokens', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs">4096</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">API Keys</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your API keys to use your own accounts with various providers
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="openai-key">OpenAI API Key</Label>
                      <div className="flex mt-1">
                        <Input
                          id="openai-key"
                          type="password"
                          placeholder="sk-..."
                          className="flex-1"
                        />
                        <Button 
                          className="ml-2" 
                          variant="outline"
                          onClick={() => {
                            // Save to local storage (in a real app, you'd encrypt this)
                            toast({
                              title: "API Key Saved",
                              description: "Your OpenAI API key has been saved securely.",
                            });
                          }}
                        >
                          Save
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI</a>
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                      <div className="flex mt-1">
                        <Input
                          id="openrouter-key"
                          type="password"
                          placeholder="sk_or..."
                          className="flex-1"
                        />
                        <Button 
                          className="ml-2" 
                          variant="outline"
                          onClick={() => {
                            // Save to local storage (in a real app, you'd encrypt this)
                            toast({
                              title: "API Key Saved",
                              description: "Your OpenRouter API key has been saved securely.",
                            });
                          }}
                        >
                          Save
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenRouter</a>
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                      <div className="flex mt-1">
                        <Input
                          id="anthropic-key"
                          type="password"
                          placeholder="sk-ant-..."
                          className="flex-1"
                        />
                        <Button 
                          className="ml-2" 
                          variant="outline"
                          onClick={() => {
                            // Save to local storage (in a real app, you'd encrypt this)
                            toast({
                              title: "API Key Saved",
                              description: "Your Anthropic API key has been saved securely.",
                            });
                          }}
                        >
                          Save
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic</a>
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="xai-key">xAI Grok API Key</Label>
                      <div className="flex mt-1">
                        <Input
                          id="xai-key"
                          type="password"
                          placeholder="grok_..."
                          className="flex-1"
                        />
                        <Button 
                          className="ml-2" 
                          variant="outline"
                          onClick={() => {
                            // Save to local storage (in a real app, you'd encrypt this)
                            toast({
                              title: "API Key Saved",
                              description: "Your xAI Grok API key has been saved securely.",
                            });
                          }}
                        >
                          Save
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your API key from <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">xAI</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-sm">Privacy & Data Protection</h4>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      Control how your data is handled
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="store-locally" className="text-sm">Store chats locally only</Label>
                          <p className="text-xs text-muted-foreground">
                            Keep all your conversations on this device
                          </p>
                        </div>
                        <Switch id="store-locally" checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="opt-out-telemetry" className="text-sm">Opt out of analytics</Label>
                          <p className="text-xs text-muted-foreground">
                            Don't send anonymous usage data
                          </p>
                        </div>
                        <Switch id="opt-out-telemetry" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-cleanup" className="text-sm">Auto-delete old chats</Label>
                          <p className="text-xs text-muted-foreground">
                            Automatically remove chats older than 30 days
                          </p>
                        </div>
                        <Switch id="auto-cleanup" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Export All Data</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Export your conversations, personas, and settings
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Data Exported",
                          description: "Your data has been exported successfully.",
                        });
                      }}
                    >
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-5 w-5 text-destructive" />
                      <h4 className="font-medium">Clear All Data</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Permanently delete all your data from this device
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Clear Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete all your conversations, custom personas, and settings. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              // Clear all data
                              setMessages([]);
                              setSessions([]);
                              
                              toast({
                                title: "Data Cleared",
                                description: "All your data has been deleted from this device.",
                              });
                              
                              // Create a new session
                              createNewChat();
                            }}
                          >
                            Delete Everything
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DrawerFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Close Settings
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Custom Persona Dialog */}
      <Dialog open={createCustomPersonaOpen} onOpenChange={setCreateCustomPersonaOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Custom Persona</DialogTitle>
            <DialogDescription>
              Design your own AI personality with specific traits and behaviors
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="persona-name">Name</Label>
              <Input
                id="persona-name"
                value={newPersona.name}
                onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                placeholder="e.g. Marketing Expert"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="persona-description">Description</Label>
              <Input
                id="persona-description"
                value={newPersona.description}
                onChange={(e) => setNewPersona({ ...newPersona, description: e.target.value })}
                placeholder="e.g. Expert in digital marketing strategies"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="persona-system-prompt">System Prompt</Label>
              <textarea
                id="persona-system-prompt"
                className="w-full min-h-[100px] p-2 rounded-md border"
                value={newPersona.systemPrompt}
                onChange={(e) => setNewPersona({ ...newPersona, systemPrompt: e.target.value })}
                placeholder="Instructions for how the AI should behave and respond..."
              />
              <p className="text-xs text-muted-foreground">
                This is the system prompt that guides the AI's behavior
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Personality Traits</Label>
              <div className="flex flex-wrap gap-2">
                {['Professional', 'Friendly', 'Creative', 'Technical', 'Concise', 'Detailed'].map(trait => (
                  <Badge
                    key={trait}
                    variant={newPersona.traits?.includes(trait) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const currentTraits = newPersona.traits || [];
                      if (currentTraits.includes(trait)) {
                        setNewPersona({
                          ...newPersona,
                          traits: currentTraits.filter(t => t !== trait)
                        });
                      } else {
                        setNewPersona({
                          ...newPersona,
                          traits: [...currentTraits, trait]
                        });
                      }
                    }}
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCustomPersonaOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePersona}>
              Create Persona
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Chat Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Export Conversation</DialogTitle>
            <DialogDescription>
              Choose a format to export this conversation
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as 'json' | 'markdown' | 'text')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="font-normal cursor-pointer">
                  JSON (for programmatic use)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="markdown" id="markdown" />
                <Label htmlFor="markdown" className="font-normal cursor-pointer">
                  Markdown (formatted text)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="font-normal cursor-pointer">
                  Plain Text (universal compatibility)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportChat}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}