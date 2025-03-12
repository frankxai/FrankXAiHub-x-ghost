import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

/**
 * ChatWithAgentFullScreen Component
 * This component redirects users to the OpenWebUI interface
 */
const ChatWithAgentFullScreen: React.FC = () => {
  // Redirect to OpenWebUI when component mounts
  useEffect(() => {
    // Redirect to OpenWebUI after a short delay
    const timer = setTimeout(() => {
      window.location.href = '/openwebui/';
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Show a loading screen while redirecting
  return (
    <div className="flex h-screen items-center justify-center bg-background dark:bg-background">
      <Card className="p-8 flex flex-col items-center">
        <Spinner size="lg" className="mb-4" />
        <h2 className="text-xl font-semibold mb-2">Launching OpenWebUI</h2>
        <p className="text-muted-foreground text-center mb-4">
          Preparing your seamless OpenWebUI experience...
        </p>
      </Card>
    </div>
  );
};

export default ChatWithAgentFullScreen;