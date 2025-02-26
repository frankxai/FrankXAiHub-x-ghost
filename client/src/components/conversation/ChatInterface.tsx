import { useState, useRef, useEffect } from "react";
import type { AICharacter } from "@shared/schema";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Volume2, MoreHorizontal, Send, Bot, User, Code, Briefcase } from "lucide-react";

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
  
  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: getAIResponse(input.trim()),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const getAIResponse = (query: string) => {
    // This is just a simple mock response logic
    if (query.toLowerCase().includes('center of excellence') || query.toLowerCase().includes('coe')) {
      return "An AI Center of Excellence (AI CoE) is a centralized team or function within an organization that provides leadership, best practices, research, and support for AI initiatives across the enterprise.\n\nYour company might benefit from an AI CoE for several reasons:\n• Standardize AI governance and practices\n• Build internal AI expertise and capabilities\n• Prioritize and coordinate AI initiatives\n• Ensure responsible and ethical AI implementation\n• Accelerate AI adoption across departments\n\nWould you like me to explain how to get started with building an AI CoE in your organization?";
    } else if (query.toLowerCase().includes('maturity') || query.toLowerCase().includes('assessment')) {
      return "AI maturity assessments evaluate your organization's AI capabilities across multiple dimensions, including strategy, data, technology, talent, and governance. The assessment provides a benchmark of your current state and identifies priority areas for improvement.\n\nYou can take our AI Maturity Assessment by visiting the Assessment page on our website. The results will include a comprehensive report with specific recommendations tailored to your organization's unique context.";
    } else {
      return "That's an interesting question. Based on my understanding, AI transformation requires a strategic approach that balances technical implementation with organizational change management. I'd be happy to dive deeper into this topic or any specific aspect you'd like to explore further.";
    }
  };
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'robot':
        return <Bot className="h-4 w-4 text-secondary" />;
      case 'chart-line':
        return <User className="h-4 w-4 text-primary" />;
      case 'code':
        return <Code className="h-4 w-4 text-accent" />;
      case 'briefcase':
        return <Briefcase className="h-4 w-4 text-gray-700" />;
      default:
        return <Bot className="h-4 w-4 text-secondary" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="py-4 border-b border-gray-100 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 bg-secondary bg-opacity-10">
            <AvatarFallback className="bg-secondary bg-opacity-10">
              {getIcon(character.icon)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h4 className="font-medium">{character.name}</h4>
            <p className="text-xs text-overlay">{character.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Volume2 className="h-4 w-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
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
              <Avatar className="h-8 w-8 flex-shrink-0 bg-secondary bg-opacity-10">
                <AvatarFallback className="bg-secondary bg-opacity-10">
                  {getIcon(character.icon)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div 
              className={`mx-3 p-4 max-w-3xl whitespace-pre-line ${
                message.sender === 'ai' 
                  ? 'bg-gray-50 rounded-r-lg rounded-bl-lg' 
                  : 'bg-secondary text-white rounded-l-lg rounded-br-lg'
              }`}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
            
            {message.sender === 'user' && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gray-200">
                  <User className="h-4 w-4 text-gray-500" />
                </AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex mb-6">
            <Avatar className="h-8 w-8 flex-shrink-0 bg-secondary bg-opacity-10">
              <AvatarFallback className="bg-secondary bg-opacity-10">
                {getIcon(character.icon)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 bg-gray-50 rounded-r-lg rounded-bl-lg p-4">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 p-4">
        <form onSubmit={handleSubmit} className="w-full flex items-center">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-secondary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit"
            size="icon"
            className="ml-3 w-10 h-10 rounded-lg bg-secondary text-white"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
