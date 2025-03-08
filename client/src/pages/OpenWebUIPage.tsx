import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import OpenWebUI from '@/components/chat/OpenWebUI';

const OpenWebUIPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (in a real app, this would be a data fetch)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Advanced AI Chat Interface</h1>
          <p className="text-muted-foreground">
            Connect with our AI using a modern, full-featured chat interface with support for multiple models and personalities.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-lg border shadow-sm bg-background">
            <OpenWebUI />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default OpenWebUIPage;