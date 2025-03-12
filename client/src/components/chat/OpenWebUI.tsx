import React, { useState, useEffect, useRef } from 'react';
import { Card, Spinner } from '@/components/ui';

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
  const [iframeLoading, setIframeLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    setIframeLoading(false);
  };
  
  // Set up postMessage communication if needed in the future
  useEffect(() => {
    const handleMessageFromIframe = (event: MessageEvent) => {
      // Handle messages from the iframe if needed
      if (event.origin !== window.location.origin) return;
      
      // Example: Process messages from OpenWebUI
      if (event.data && event.data.type === 'openwebui-message') {
        console.log('Message from OpenWebUI:', event.data);
      }
    };
    
    window.addEventListener('message', handleMessageFromIframe);
    
    return () => {
      window.removeEventListener('message', handleMessageFromIframe);
    };
  }, []);
  
  return (
    <Card className={`flex flex-col ${fullScreen ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} ${className} overflow-hidden`}>
      {iframeLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground">Loading OpenWebUI...</p>
          </div>
        </div>
      )}
      
      {showOpenWebUI && (
        <iframe
          ref={iframeRef}
          src="/openwebui"
          title="OpenWebUI Interface"
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          allow="camera; microphone; clipboard-read; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
        />
      )}
    </Card>
  );
}

export default OpenWebUI;