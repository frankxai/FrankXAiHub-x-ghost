import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  User, 
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  
  // Speech recognition states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Text-to-speech states
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech recognition when component mounts
  useEffect(() => {
    // Check if the browser supports speech recognition
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setSpeechSupported(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // Setup event handlers
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice input.",
            variant: "destructive"
          });
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  // Handle speech synthesis
  useEffect(() => {
    // Check if the browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }
    
    // Setup speech synthesis events
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    
    // Initialize speech synthesis
    if (synthesisRef.current) {
      synthesisRef.current.onend = handleSpeechEnd;
      synthesisRef.current.onerror = () => {
        console.error('Speech synthesis error');
        handleSpeechEnd();
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (!speechSupported) {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not start the speech recognition service.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Speak AI message
  const speakMessage = (message: Message) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }
    
    // Stop any current speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      // If clicking on the same message, just stop playback
      if (speakingMessageId === message.id) {
        setSpeakingMessageId(null);
        return;
      }
    }
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    
    // Store the utterance reference
    synthesisRef.current = utterance;
    
    // Speak the message
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setSpeakingMessageId(message.id);
  };
  
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
      const response = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: 'FrankX.AI',
          message: userMessage.content,
          context: pageContext
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
        content: responseData.message || "I'm sorry, I couldn't generate a response. Please try again.",
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#005CB2] via-[#00A3FF] to-[#1CD3FF] hover:shadow-[0_0_15px_rgba(0,195,255,0.5)] shadow-lg flex items-center justify-center border-2 border-white/20"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="w-6 h-6 text-white drop-shadow-md" />
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
      <div className="bg-gradient-to-r from-[#005CB2] via-[#00A3FF] to-[#1CD3FF] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 bg-white/20 border-2 border-white/30 shadow-md">
            <AvatarFallback className="text-white bg-gradient-to-br from-[#005CB2] to-[#00A3FF] text-sm">
              <Bot className="h-6 w-6 drop-shadow-sm" />
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h3 className="text-white font-semibold text-lg tracking-tight">FrankX.AI</h3>
            <p className="text-white/80 text-xs font-light">Personal AI Companion</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
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
                    <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white/20">
                      <AvatarFallback className="bg-gradient-to-br from-[#005CB2] to-[#00A3FF] text-white">
                        <Bot className="h-4 w-4 drop-shadow-sm" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`mx-3 p-4 max-w-[80%] rounded-lg ${
                      message.sender === 'ai' 
                        ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-600 shadow-sm relative group' 
                        : 'bg-gradient-to-r from-[#005CB2] via-[#00A3FF] to-[#1CD3FF] text-white rounded-tr-none shadow-md'
                    }`}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={`${i > 0 ? 'mt-2' : ''} ${message.sender === 'user' ? 'drop-shadow-sm' : ''}`}>
                        {line}
                      </p>
                    ))}
                    
                    {/* Text-to-speech button for AI messages */}
                    {message.sender === 'ai' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => speakMessage(message)}
                              className={`absolute -right-1 -top-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                                ${speakingMessageId === message.id 
                                  ? 'bg-[#00A3FF]/20 text-[#00A3FF] shadow-sm border border-[#00A3FF]/30' 
                                  : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:text-[#00A3FF] hover:bg-[#00A3FF]/10'}`}
                            >
                              {speakingMessageId === message.id ? (
                                <div className="relative">
                                  <Volume2 className="h-3 w-3" />
                                  <span className="absolute top-0 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#00A3FF] animate-pulse"></span>
                                </div>
                              ) : (
                                <Volume2 className="h-3 w-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {speakingMessageId === message.id ? 'Stop speaking' : 'Speak message'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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
                      <Bot className="h-4 w-4 drop-shadow-sm" />
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
            </AnimatePresence>
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Ask me anything..."
                  className="w-full rounded-full border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white 
                  focus-visible:ring-[#00A3FF] focus-visible:ring-offset-0 shadow-sm pr-10"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || isListening}
                />
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleListening}
                        disabled={!speechSupported || isLoading}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full
                          ${isListening ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600' : 
                          'text-gray-400 hover:text-[#00A3FF] hover:bg-[#00A3FF]/10'}`}
                      >
                        {isListening ? (
                          <div className="relative">
                            <MicOff className="h-4 w-4" />
                            <span className="absolute top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                          </div>
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isListening ? 'Stop listening' : 'Start voice input'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Button 
                type="submit"
                size="icon"
                className="ml-2 w-10 h-10 rounded-full bg-gradient-to-r from-[#005CB2] via-[#00A3FF] to-[#1CD3FF] 
                hover:shadow-[0_0_10px_rgba(0,195,255,0.4)] text-white transition-all duration-300"
                disabled={isLoading || (!input.trim() && !isListening)}
              >
                <Send className="h-4 w-4 drop-shadow-sm" />
              </Button>
            </form>
          </div>
        </>
      )}
      
      {isMinimized && (
        <div className="p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between text-gray-800 dark:text-gray-200 group cursor-pointer"
               onClick={() => setIsMinimized(false)}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#005CB2] to-[#00A3FF] animate-pulse"></div>
              <p className="text-sm font-medium truncate">
                {messages.length > 0 
                  ? `${messages[messages.length - 1].content.substring(0, 25)}...` 
                  : 'Ask me anything...'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#00A3FF] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FrankXAI;