import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, Button, Spinner } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

function OpenWebUIPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Simulate app initialization
  useEffect(() => {
    // For a smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
      // Redirect user immediately to OpenWebUI interface
      window.location.href = '/openwebui/';
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading screen while redirecting
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Card className="p-8 flex flex-col items-center">
        <Spinner size="lg" className="mb-4" />
        <h2 className="text-xl font-semibold mb-2">Launching OpenWebUI</h2>
        <p className="text-muted-foreground text-center mb-4">
          Preparing your seamless OpenWebUI experience...
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setLocation('/')}
          className="flex items-center gap-1 mt-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

export default OpenWebUIPage;