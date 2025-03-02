import { useState, useRef, useEffect } from "react";
import type { AICharacter } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Volume2, MoreHorizontal, Send, Bot, User, Code, Briefcase, Zap, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  character: AICharacter;
}

const ChatInterface = ({ character }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Initial greeting message
  useEffect(() => {
    // Clear messages when character changes
    setMessages([]);
    
    // Add greeting message after a short delay
    const timer = setTimeout(() => {
      const greeting: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: getGreetingMessage(),
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [character]);
  
  const getGreetingMessage = () => {
    switch (character.name) {
      case 'FrankBot':
        return "Hello! I'm FrankBot, your enterprise AI assistant. I can help with AI strategy, implementation roadmaps, and answering questions about AI technologies. How can I assist you today?";
      case 'StrategyGPT':
        return "Welcome! I'm StrategyGPT, your AI strategy advisor. I can help you develop AI transformation strategies, prioritize use cases, and build business cases. What strategic challenge can I help with?";
      case 'DevOpsBot':
        return "Hi there! I'm DevOpsBot, your technical copilot. I can assist with AI implementation, deployment architecture, and technical integration questions. What technical challenge are you facing?";
      case 'SalesGPT':
        return "Hello! I'm SalesGPT, your sales assistant. I can help with customer qualification, proposal development, and competitive positioning for AI solutions. How can I support your sales efforts?";
      default:
        return `Hello! I'm ${character.name}. How can I assist you today?`;
    }
  };
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Make real API request to get AI response
      const response = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: character.name,
          message: userMessage.content,
          context: `The user is talking to ${character.name}, who is a ${character.description}. The AI should respond in character.`
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: responseData.message || getBackupResponse(userMessage.content),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Communication Error",
        description: "There was a problem connecting to the AI service. Using backup response.",
        variant: "destructive"
      });
      
      // Fallback response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: getBackupResponse(userMessage.content),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Backup responses in case of API failure
  const getBackupResponse = (query: string) => {
    // This is just a fallback response logic
    if (query.toLowerCase().includes('center of excellence') || query.toLowerCase().includes('coe')) {
      return "An AI Center of Excellence (AI CoE) is a centralized team or function within an organization that provides leadership, best practices, research, and support for AI initiatives across the enterprise.\n\nYour company might benefit from an AI CoE for several reasons:\n• Standardize AI governance and practices\n• Build internal AI expertise and capabilities\n• Prioritize and coordinate AI initiatives\n• Ensure responsible and ethical AI implementation\n• Accelerate AI adoption across departments\n\nWould you like me to explain how to get started with building an AI CoE in your organization?";
    } else if (query.toLowerCase().includes('maturity') || query.toLowerCase().includes('assessment')) {
      return "AI maturity assessments evaluate your organization's AI capabilities across multiple dimensions, including strategy, data, technology, talent, and governance. The assessment provides a benchmark of your current state and identifies priority areas for improvement.\n\nYou can take our AI Maturity Assessment by visiting the Assessment page on our website. The results will include a comprehensive report with specific recommendations tailored to your organization's unique context.";
    } else {
      return `I understand you're asking about "${query.substring(0, 30)}${query.length > 30 ? '...' : ''}". As ${character.name}, I should note that AI transformation requires a strategic approach that balances technical implementation with organizational change management. I'd be happy to dive deeper into this topic or any specific aspect you'd like to explore further.`;
    }
  };
  
  const getIcon = (iconName: string | null) => {
    if (!iconName) return <Bot className="h-4 w-4 text-white" />;
    
    switch (iconName) {
      case 'robot':
        return <Bot className="h-4 w-4 text-white" />;
      case 'chart-line':
        return <Zap className="h-4 w-4 text-white" />;
      case 'code':
        return <Code className="h-4 w-4 text-white" />;
      case 'briefcase':
        return <Briefcase className="h-4 w-4 text-white" />;
      default:
        return <Bot className="h-4 w-4 text-white" />;
    }
  };

  return (
    <Card className="h-full border border-gray-100 dark:border-gray-700">
      <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-row items-center justify-between bg-gradient-to-r from-[#005CB2] via-[#00A3FF] to-[#1CD3FF]">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 bg-white/20 border-2 border-white/30 shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-[#005CB2] to-[#00A3FF] text-white">
              {getIcon(character.icon)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h4 className="font-semibold text-white tracking-tight">{character.name}</h4>
            <p className="text-xs text-white/80 font-light">{character.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent 
        className="h-96 overflow-y-auto p-6"
        ref={messageContainerRef}
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex mb-6 ${message.sender === 'user' ? 'justify-end' : ''}`}
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            {message.sender === 'ai' && (
              <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white/20">
                <AvatarFallback className="bg-gradient-to-br from-[#005CB2] to-[#00A3FF] text-white">
                  {getIcon(character.icon)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div 
              className={`mx-3 p-4 max-w-3xl whitespace-pre-line ${
                message.sender === 'ai' 
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-lg border border-gray-100 dark:border-gray-600 shadow-sm' 
                  : 'bg-gradient-to-r from-[#005CB2] via-[#00A3FF] to-[#1CD3FF] text-white rounded-tr-none rounded-tl-lg rounded-bl-lg rounded-br-lg shadow-md'
              }`}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={`${i > 0 ? 'mt-2' : ''} ${message.sender === 'user' ? 'drop-shadow-sm' : ''}`}>
                  {line}
                </p>
              ))}
            </div>
            
            {message.sender === 'user' && (
              <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white/20">
                <AvatarFallback className="bg-gradient-to-br from-[#151515] to-[#272727] text-white">
                  <User className="h-4 w-4 drop-shadow-sm" />
                </AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            className="flex mb-6"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white/20">
              <AvatarFallback className="bg-gradient-to-br from-[#005CB2] to-[#00A3FF] text-white">
                {getIcon(character.icon)}
              </AvatarFallback>
            </Avatar>
            <div className="mx-3 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-600 rounded-tl-none">
              <div className="flex space-x-3">
                <div className="h-2.5 w-2.5 bg-gradient-to-r from-[#005CB2] to-[#00A3FF] rounded-full animate-pulse" 
                     style={{ animationDelay: '0ms', animationDuration: '1.2s' }}></div>
                <div className="h-2.5 w-2.5 bg-gradient-to-r from-[#005CB2] to-[#00A3FF] rounded-full animate-pulse" 
                     style={{ animationDelay: '300ms', animationDuration: '1.2s' }}></div>
                <div className="h-2.5 w-2.5 bg-gradient-to-r from-[#005CB2] to-[#00A3FF] rounded-full animate-pulse" 
                     style={{ animationDelay: '600ms', animationDuration: '1.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="w-full flex items-center">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-full border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white 
            focus-visible:ring-[#00A3FF] focus-visible:ring-offset-0 shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit"
            size="icon"
            className="ml-3 w-10 h-10 rounded-full bg-gradient-to-r from-[#005CB2] via-[#00A3FF] to-[#1CD3FF] 
            hover:shadow-[0_0_10px_rgba(0,195,255,0.4)] text-white transition-all duration-300"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4 drop-shadow-sm" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
