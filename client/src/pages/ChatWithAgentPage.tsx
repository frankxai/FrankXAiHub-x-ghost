
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, ArrowLeft, Info, Settings, Download } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface Agent {
  id: number;
  name: string;
  description: string;
  persona: string;
  avatarUrl: string;
  model: string;
  provider: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatWithAgentPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Load agent data
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        // First try to get from public agents
        let response = await fetch('/api/agent-management/public');
        let data = await response.json();
        let foundAgent = data.find((a: Agent) => a.id === parseInt(agentId || '0'));
        
        // If not found, try from custom agents
        if (!foundAgent) {
          response = await fetch('/api/agent-management/custom/1'); // hardcoded user ID for demo
          data = await response.json();
          foundAgent = data.find((a: Agent) => a.id === parseInt(agentId || '0'));
        }
        
        if (foundAgent) {
          setAgent(foundAgent);
          // Add welcome message
          setMessages([
            {
              role: 'assistant',
              content: `Hello! I'm ${foundAgent.name}. ${foundAgent.description} How can I assist you today?`,
              timestamp: new Date()
            }
          ]);
        } else {
          toast.error('Agent not found');
          navigate('/agents');
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
        toast.error('Error loading agent data');
      }
    };
    
    if (agentId) {
      fetchAgent();
    }
  }, [agentId, navigate]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !agent) return;
    
    const userMessage = {
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterName: agent.name,
          message: inputMessage,
          conversationId: Date.now().toString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Error sending message');
      }
      
      const data = await response.json();
      
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : agent?.name}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-with-${agent?.name}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Conversation exported successfully');
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/agents')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {agent && (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{agent.name}</h2>
                <p className="text-xs text-muted-foreground">Using {agent.model}</p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={exportConversation}>
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Export conversation
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {agent && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h3 className="font-medium">About {agent.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                  <h4 className="text-sm font-medium mt-4">Capabilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities && agent.capabilities.map((capability, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {capability}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Model: {agent.model}<br />
                    Provider: {agent.provider}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message, idx) => (
            <div 
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <CardContent className="p-3">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] bg-muted">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Thinking...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-10 resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWithAgentPage;
