import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Minimize2, Maximize2, Send, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Message {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

/**
 * FrankXAI is a floating AI assistant that follows the user across all pages
 * It provides contextualized help based on the current page and serves as a guide for the Center of Excellence
 */
const FrankXAI = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [location] = useLocation();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Initial greeting based on the page
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addGreeting();
    }
  }, [isOpen]);
  
  // Update greeting when location changes
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      // Only add navigation context if already in a conversation
      addNavigationContext();
    }
  }, [location]);
  
  const addGreeting = () => {
    const greeting: Message = {
      id: Date.now().toString(),
      sender: 'ai',
      content: getContextualGreeting(),
      timestamp: new Date(),
    };
    setMessages([greeting]);
  };
  
  const addNavigationContext = () => {
    // Only add navigation context if already chatting
    if (messages.length <= 1) return;
    
    const contextMsg: Message = {
      id: Date.now().toString(),
      sender: 'ai',
      content: `I see you've navigated to ${getPageName()}. Is there anything specific about this section you'd like help with?`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, contextMsg]);
  };
  
  const getPageName = (): string => {
    switch (true) {
      case location === '/':
        return 'the home page';
      case location.startsWith('/blog'):
        return 'the blog section';
      case location.startsWith('/conversation'):
        return 'the AI Characters page';
      case location.startsWith('/resources'):
        return 'the Resources page';
      case location.startsWith('/assessment'):
        return 'the AI Maturity Assessment';
      case location.startsWith('/music'):
        return 'the AI-generated Music page';
      default:
        return 'a new page';
    }
  };
  
  const getContextualGreeting = (): string => {
    const baseGreeting = "Hello! I'm FrankX.AI, your AI companion created by Frank Riemer to guide you through the AI Center of Excellence.";
    
    switch (true) {
      case location === '/':
        return `${baseGreeting} Welcome to our platform! I can help you navigate to our AI resources, blog content, or specialized AI characters. What are you interested in exploring today?`;
      case location.startsWith('/blog'):
        return `${baseGreeting} I see you're exploring our blog content. These articles are written by Frank Riemer based on his AI expertise. Would you like recommendations for specific topics, or help understanding any concepts?`;
      case location.startsWith('/conversation'):
        return `${baseGreeting} You're in the AI Characters section. Each character has specialized knowledge in different aspects of AI implementation. Is there a particular type of expertise you're looking for?`;
      case location.startsWith('/resources'):
        return `${baseGreeting} You're browsing our curated AI resources. These tools, guides, and frameworks are selected to help build and manage your AI Center of Excellence. Can I help you find specific resources?`;
      case location.startsWith('/assessment'):
        return `${baseGreeting} The AI Maturity Assessment will help evaluate your organization's readiness for AI implementation. Would you like me to explain how to get the most value from this assessment?`;
      case location.startsWith('/music'):
        return `${baseGreeting} You're exploring our AI-generated music showcase. These compositions demonstrate the creative capabilities of modern AI systems. Would you like to know more about how they were created?`;
      default:
        return `${baseGreeting} How can I assist you today in your AI journey?`;
    }
  };
  
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
      // Get contextual information to send to the AI
      const pageContext = `The user is currently on ${getPageName()}. Their question is related to this context.`;
      
      // API request to our AI service
      const response = await apiRequest({
        url: '/api/ai/conversation',
        method: 'POST',
        data: {
          characterName: 'FrankX.AI',
          message: userMessage.content,
          context: pageContext
        }
      });
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: response.message as string,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Communication Error",
        description: "I couldn't connect to my knowledge base. Please try again.",
        variant: "destructive"
      });
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "I'm having trouble connecting to my knowledge base right now. Can we try again in a moment?",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Floating button when closed
  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          className="w-14 h-14 rounded-full bg-[#00C2FF] hover:bg-[#00C2FF]/90 shadow-lg flex items-center justify-center"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className={`fixed z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
        isMinimized ? 'bottom-6 right-6 w-72' : 'bottom-6 right-6 w-96 sm:w-[450px]'
      }`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C2FF] to-[#00C2FF]/70 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 bg-white/20 border border-white/30">
            <AvatarFallback className="text-white text-sm">
              <Bot className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h3 className="text-white font-semibold">FrankX.AI</h3>
            <p className="text-white/80 text-xs">Personal AI Companion</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div 
            className="p-4 h-80 overflow-y-auto bg-gray-50 dark:bg-gray-800"
            ref={messageContainerRef}
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex mb-6 ${message.sender === 'user' ? 'justify-end' : ''}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-[#00C2FF] text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`mx-3 p-4 max-w-[80%] rounded-lg shadow-sm ${
                      message.sender === 'ai' 
                        ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-600' 
                        : 'bg-[#00C2FF] text-white rounded-tr-none'
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
                      <AvatarFallback className="bg-[#171717] dark:bg-[#171717] text-white">
                        <User className="h-4 w-4" />
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
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-[#00C2FF] text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="flex items-center">
              <Input
                type="text"
                placeholder="Ask me anything..."
                className="flex-grow rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                type="submit"
                size="icon"
                className="ml-2 w-10 h-10 rounded-full bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
      
      {isMinimized && (
        <div className="p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between text-gray-800 dark:text-gray-200">
            <p className="text-sm truncate">
              {messages.length > 0 
                ? `Last: ${messages[messages.length - 1].content.substring(0, 20)}...` 
                : 'Ask me anything...'}
            </p>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FrankXAI;