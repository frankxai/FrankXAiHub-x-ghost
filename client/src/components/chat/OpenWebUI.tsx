/**
 * OpenWebUI-inspired Chat Interface for FrankX.AI
 * 
 * This component provides a full-screen, immersive chat experience similar to OpenWebUI,
 * with support for multiple models, personalities, and advanced features.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import FrankXAI from '../ai/FrankXAI';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import {
  Cog,
  FileText,
  Send,
  Mic,
  Image,
  LayoutGrid,
  Settings,
  Trash,
  Save,
  ChevronLeft,
  MessageSquare,
  PlusCircle,
  Users,
  User,
  Lightbulb,
  Bot
} from 'lucide-react';

// Message interface
interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string;
  personalityId?: string;
  pending?: boolean;
}

// Chat session interface
interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  modelId: string;
  personalityId: string;
}

// Model interface
interface Model {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  freeInOpenRouter: boolean;
  capabilities: string[];
  description: string;
  category: string;
}

// Personality interface
interface Personality {
  id: string;
  name: string;
  description: string;
  traits: string[];
  tone: string;
}

const OpenWebUI: React.FC = () => {
  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('google/gemini-pro');
  const [selectedPersonalityId, setSelectedPersonalityId] = useState<string>('frankx-default');
  const { toast } = useToast();

  // Fetch models and personalities
  const { data: models = [] } = useQuery({
    queryKey: ['/api/models'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const { data: personalities = [] } = useQuery({
    queryKey: ['/api/personalities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Current session
  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages]);

  // Effect to focus input when session changes
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [currentSessionId]);

  // Function to create a new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      modelId: selectedModelId,
      personalityId: selectedPersonalityId
    };
    
    setSessions([...sessions, newSession]);
    setCurrentSessionId(newSession.id);
  };

  // Function to send a message
  const sendMessage = async () => {
    if (!message.trim() || !currentSessionId) return;
    
    try {
      setSending(true);

      // Add user message to session
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      // Update sessions with the new message
      const updatedSessions = sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage],
            updatedAt: new Date()
          };
        }
        return session;
      });
      
      setSessions(updatedSessions);
      setMessage('');
      
      // Add a pending assistant message
      const pendingMessage: Message = {
        id: `pending-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        pending: true,
        modelId: currentSession?.modelId,
        personalityId: currentSession?.personalityId
      };
      
      setSessions(sessions => sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage, pendingMessage],
            updatedAt: new Date()
          };
        }
        return session;
      }));

      // Get model and personality for the current session
      const session = sessions.find(s => s.id === currentSessionId);
      
      // API request to get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          modelId: session?.modelId || selectedModelId,
          personalityId: session?.personalityId || selectedPersonalityId,
          sessionId: currentSessionId,
          history: session?.messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Update sessions with the AI response
      setSessions(sessions => sessions.map(session => {
        if (session.id === currentSessionId) {
          const messages = session.messages.filter(m => !m.pending);
          return {
            ...session,
            title: session.messages.length <= 2 ? userMessage.content.substring(0, 30) + '...' : session.title,
            messages: [
              ...messages,
              {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
                modelId: session.modelId,
                personalityId: session.personalityId
              }
            ],
            updatedAt: new Date()
          };
        }
        return session;
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
      
      // Remove pending message
      setSessions(sessions => sessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: session.messages.filter(m => !m.pending),
            updatedAt: new Date()
          };
        }
        return session;
      }));
    } finally {
      setSending(false);
    }
  };

  // Function to handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Function to delete a session
  const deleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(sessions[0]?.id || null);
    }
  };

  // Function to update session settings
  const updateSessionSettings = (modelId: string, personalityId: string) => {
    if (!currentSessionId) return;
    
    setSessions(sessions.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          modelId,
          personalityId,
          updatedAt: new Date()
        };
      }
      return session;
    }));
    
    setSelectedModelId(modelId);
    setSelectedPersonalityId(personalityId);
    setShowSettings(false);
  };

  // Create a new session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [sessions]);

  // Format message content (handle markdown, code blocks, etc.)
  const formatMessageContent = (content: string) => {
    // Simple formatting - you can enhance this with a markdown parser
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // Render pending message with typing animation
  const renderPendingMessage = () => (
    <div className="flex gap-1 h-6 items-end">
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col w-80 border-r border-border transition-all duration-300 ease-in-out bg-muted/30",
        showSidebar ? "block" : "hidden"
      )}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FrankXAI size="sm" />
            <h2 className="text-lg font-semibold">FrankX.AI</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
            <ChevronLeft size={16} />
          </Button>
        </div>
        
        {/* New chat button */}
        <div className="p-3">
          <Button className="w-full justify-start gap-2" onClick={createNewSession}>
            <PlusCircle size={16} />
            New Chat
          </Button>
        </div>
        
        {/* Chat sessions list */}
        <div className="flex-1 overflow-y-auto">
          {sessions.map(session => (
            <div 
              key={session.id}
              className={cn(
                "flex items-center justify-between p-3 cursor-pointer hover:bg-muted transition-colors",
                currentSessionId === session.id ? "bg-muted" : ""
              )}
              onClick={() => setCurrentSessionId(session.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare size={16} />
                <span className="truncate">{session.title || 'New Chat'}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
              >
                <Trash size={14} />
              </Button>
            </div>
          ))}
        </div>
        
        {/* Sidebar footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="text-sm">User</span>
            </div>
            <Button variant="ghost" size="sm">
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full relative">
        {/* Chat header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-background z-10">
          <div className="flex items-center gap-2">
            {!showSidebar && (
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(true)}>
                <LayoutGrid size={16} />
              </Button>
            )}
            <h2 className="font-semibold">
              {currentSession?.title || 'New Chat'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>
        
        {/* Settings panel - shown when settings button is clicked */}
        {showSettings && (
          <div className="absolute top-16 right-4 w-80 bg-card border border-border rounded-lg shadow-lg z-20 p-4">
            <h3 className="font-semibold mb-4">Chat Settings</h3>
            
            {/* Model selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Model</label>
              <select 
                className="w-full p-2 border border-input rounded-md bg-transparent"
                value={currentSession?.modelId || selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
              >
                {models.map((model: Model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Personality selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Personality</label>
              <select
                className="w-full p-2 border border-input rounded-md bg-transparent"
                value={currentSession?.personalityId || selectedPersonalityId}
                onChange={(e) => setSelectedPersonalityId(e.target.value)}
              >
                {personalities.map((personality: Personality) => (
                  <option key={personality.id} value={personality.id}>
                    {personality.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => updateSessionSettings(selectedModelId, selectedPersonalityId)}>
                Apply
              </Button>
            </div>
          </div>
        )}
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          {currentSession?.messages.map((msg, index) => (
            <div key={`${msg.id}-${index}`} className={cn(
              "mb-6 max-w-3xl mx-auto",
              msg.role === 'assistant' ? "" : "ml-auto"
            )}>
              <div className="flex gap-4">
                {msg.role === 'assistant' && (
                  <div className="mt-1">
                    <FrankXAI size="md" />
                  </div>
                )}
                <div className={cn(
                  "flex-1 p-4 rounded-lg",
                  msg.role === 'assistant' 
                    ? "bg-muted text-foreground" 
                    : "bg-primary text-primary-foreground"
                )}>
                  {msg.pending 
                    ? renderPendingMessage()
                    : formatMessageContent(msg.content)
                  }
                  
                  {/* Message metadata */}
                  {msg.role === 'assistant' && !msg.pending && (
                    <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-2">
                      <Bot size={12} />
                      <span>{models.find((m: Model) => m.id === msg.modelId)?.name || msg.modelId}</span>
                      <Lightbulb size={12} className="ml-2" />
                      <span>{personalities.find((p: Personality) => p.id === msg.personalityId)?.name || msg.personalityId}</span>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User size={16} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t border-border absolute bottom-0 left-0 right-0 bg-background">
          <div className="max-w-3xl mx-auto relative">
            <Textarea
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="pr-10 min-h-[60px] max-h-[200px]"
              disabled={sending}
            />
            <Button
              className="absolute right-2 bottom-2"
              size="sm"
              onClick={sendMessage}
              disabled={!message.trim() || sending}
            >
              {sending ? <Spinner size="sm" /> : <Send size={16} />}
            </Button>
          </div>
          
          {/* Additional input options */}
          <div className="max-w-3xl mx-auto mt-2 flex gap-2">
            <Button variant="ghost" size="sm">
              <Mic size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <Image size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <FileText size={16} />
            </Button>
            <div className="flex-1" />
            <div className="text-xs text-muted-foreground flex items-center">
              <Bot size={12} className="mr-1" />
              {models.find((m: Model) => m.id === (currentSession?.modelId || selectedModelId))?.name || selectedModelId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenWebUI;