import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Button, Card, Input, Spinner } from '@/components/ui';
import MarkdownRenderer from '@/components/ui/markdown-renderer';
import { Mic, MicOff, Send, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface OpenWebUIProps {
  initialMessages?: Message[];
  modelId?: string;
  personalityId?: string;
  aiName?: string;
  aiAvatarUrl?: string;
  userAvatarUrl?: string;
  onSendMessage: (message: string) => Promise<string>;
  className?: string;
  fullScreen?: boolean;
}

export function OpenWebUI({
  initialMessages = [],
  modelId = 'gpt-4o',
  personalityId = 'default',
  aiName = 'AI Assistant',
  aiAvatarUrl = '/ai-avatar.png',
  userAvatarUrl,
  onSendMessage,
  className = '',
  fullScreen = false,
}: OpenWebUIProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize speech recognition if available
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInputValue(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      setSpeechRecognition(recognition);
    }
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await onSendMessage(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleRecording = () => {
    if (!speechRecognition) return;
    
    if (isRecording) {
      speechRecognition.stop();
    } else {
      speechRecognition.start();
    }
    
    setIsRecording(!isRecording);
  };
  
  return (
    <Card className={`flex flex-col ${fullScreen ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} ${className}`}>
      <div className="p-4 border-b flex items-center space-x-2">
        <Avatar src={aiAvatarUrl} alt={aiName} fallbackDelay={1000} />
        <div>
          <h3 className="font-medium">{aiName}</h3>
          <p className="text-sm text-muted-foreground">Model: {modelId}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex max-w-[80%] ${
                message.role === 'user' 
                  ? 'flex-row-reverse' 
                  : 'flex-row'
              }`}
            >
              <div className="flex-shrink-0">
                {message.role === 'user' ? (
                  <Avatar className="h-8 w-8">
                    <User className="h-4 w-4" />
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8" src={aiAvatarUrl} alt={aiName} />
                )}
              </div>
              
              <div 
                className={`mx-2 p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.role === 'assistant' ? (
                  <MarkdownRenderer content={message.content} />
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8" src={aiAvatarUrl} alt={aiName} />
              </div>
              <div className="mx-2 p-3 rounded-lg bg-muted flex items-center space-x-2">
                <Spinner size="sm" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          
          {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={toggleRecording}
              disabled={isLoading}
              className={isRecording ? 'bg-red-100' : ''}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

export default OpenWebUI;