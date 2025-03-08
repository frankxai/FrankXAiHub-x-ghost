
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Mic, X, Loader2, VolumeX, Volume2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

// Avatar URLs - using direct file references for stability
const AVATAR_URLS = [
  '/frankx-avatar-updated.png',
  '/frankx-avatar.png',
  '/frankx-avatar-fallback.png',
  '/frankx-avatar-simple.svg',
];

// Preload function with enhanced error handling
const preloadAvatarImages = () => {
  try {
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
      // Log success or failure for debugging
      img.onload = () => console.log(`Successfully loaded ${src}`);
      img.onerror = () => console.warn(`Failed to load ${src}`);
    };
    
    // Preload all avatar images
    AVATAR_URLS.forEach(url => preloadImage(url));
  } catch (error) {
    console.warn("Error preloading avatar images:", error);
  }
};

// Call preload on module load
preloadAvatarImages();

// Define responsive styles to improve mobile experience
const MOBILE_BREAKPOINT = 640; // Corresponds to sm in Tailwind

// Main component for FrankX.AI chat interface
const FrankXAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [avatarImageIndex, setAvatarImageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize recognition if supported by browser
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        stopRecording();
      };
    }
  }, []);
  
  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello, I'm FrankX.AI. How can I assist you with AI strategy, implementation, or anything else related to this platform?"
      }
    ]);
  }, []);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        // On mobile, auto-close the chat when the window gets smaller
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Simulate AI thinking
    setIsLoading(true);
    
    try {
      // Call AI service here
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMessage }],
          model: 'frankx'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      
      // Optional: Speak the response if audio is enabled
      if (!isMuted) {
        speakText(data.content);
      }
    } catch (error) {
      console.error('Error communicating with AI:', error);
      toast({
        title: "Communication Error",
        description: "There was a problem connecting to FrankX.AI. Please try again.",
        variant: "destructive",
      });
      
      // Add error message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my knowledge base. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Voice commands
  const startRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Text-to-speech functionality
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') && voice.name.includes('Male')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Stop speaking if muting
    if (!isMuted) {
      window.speechSynthesis?.cancel();
    }
  };
  
  const handleAvatarError = () => {
    // Cycle through available avatar images if current one fails
    if (avatarImageIndex < AVATAR_URLS.length - 1) {
      setAvatarImageIndex(avatarImageIndex + 1);
    }
  };

  // Chat toggle button that stays fixed at the bottom right
  const triggerButton = (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        aria-label={isOpen ? "Close chat" : "Open chat with FrankX AI"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </motion.div>
  );

  // Main chat interface
  const chatInterface = (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="fixed bottom-20 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-7rem)]"
    >
      <Card className="flex flex-col h-full shadow-xl border-2 border-primary/10">
        {/* Chat header */}
        <div className="flex items-center p-3 border-b bg-primary/5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-muted/30">
                <img 
                  src={AVATAR_URLS[avatarImageIndex]}
                  onError={handleAvatarError}
                  alt="FrankX.AI" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-r from-[#005CB2] to-[#00A3FF] animate-pulse shadow-[0_0_5px_rgba(0,163,255,0.5)]"></div>
              </div>
              <div>
                <h3 className="font-semibold">FrankX.AI</h3>
                <p className="text-xs text-muted-foreground">AI Strategy Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="ml-auto"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn("flex", {
                "justify-end": message.role === "user",
                "justify-start": message.role === "assistant",
              })}
            >
              <div
                className={cn("max-w-[85%] rounded-lg p-3", {
                  "bg-primary text-primary-foreground": message.role === "user",
                  "bg-muted": message.role === "assistant",
                })}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown className="prose prose-sm dark:prose-invert">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg p-3 bg-muted">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-3 border-t">
          <div className="flex items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex flex-col ml-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="mb-2"
                onClick={toggleRecording}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                <Mic className={cn("h-4 w-4", {
                  "text-red-500": isRecording,
                })} />
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );

  return (
    <>
      {triggerButton}
      {isOpen && chatInterface}
    </>
  );
};

export default FrankXAI;
