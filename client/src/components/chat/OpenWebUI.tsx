import React, { useState, useEffect } from 'react';
import { Card, Spinner, Button } from '@/components/ui';
import { useLocation } from 'wouter';

interface OpenWebUIProps {
  modelId?: string;
  personalityId?: string;
  aiName?: string;
  aiAvatarUrl?: string;
  userAvatarUrl?: string;
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
  fullScreen?: boolean;
  showOpenWebUI?: boolean;
}

export function OpenWebUI({
  modelId = 'openai/gpt-4o',
  personalityId = 'frankx-default',
  aiName = 'AI Assistant',
  aiAvatarUrl = '/frankx-chat-avatar.png',
  userAvatarUrl,
  onSendMessage,
  className = '',
  fullScreen = false,
  showOpenWebUI = true,
}: OpenWebUIProps) {
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Simulate loading time to match the app's state initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleOpenWebUI = () => {
    // Navigate directly to the OpenWebUI interface
    window.location.href = '/openwebui';
  };
  
  return (
    <Card className={`flex flex-col ${fullScreen ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} ${className} overflow-hidden`}>
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground">Preparing OpenWebUI experience...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">OpenWebUI Integration</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Access the full-featured OpenWebUI experience directly from our application, 
            with all your data and preferences synchronized.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleOpenWebUI}
            className="px-6"
          >
            Launch OpenWebUI
          </Button>
          
          <div className="mt-10 text-sm text-muted-foreground max-w-lg">
            <p>OpenWebUI is now integrated directly into the application without iframes or separate servers. 
            Click the button above to experience the full capabilities of OpenWebUI while staying within the FrankX.AI ecosystem.</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default OpenWebUI;