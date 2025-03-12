import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

/**
 * OpenWebUIPage Component
 * 
 * This is a dedicated page that provides access to the OpenWebUI interface.
 * It redirects users to the actual OpenWebUI experience.
 */
const OpenWebUIPage: React.FC = () => {
  // Redirect to OpenWebUI when component mounts
  useEffect(() => {
    // Redirect to OpenWebUI immediately
    window.location.href = '/openwebui/';
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

export default OpenWebUIPage;