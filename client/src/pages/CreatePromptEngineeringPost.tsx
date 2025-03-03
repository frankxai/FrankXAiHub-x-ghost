import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

const CreatePromptEngineeringPost: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<number | null>(null);
  const [_, navigate] = useLocation();
  
  const handleCreatePost = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('/api/collaborative-blog-posts/create-prompt-engineering', {
        method: 'POST',
      });
      
      setCreatedPostId(response.id);
      toast({
        title: 'Success!',
        description: 'The blog post has been created successfully.',
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create the prompt engineering blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewPost = () => {
    if (createdPostId) {
      navigate(`/collaborative-blog/${createdPostId}`);
    }
  };
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20"
    >
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Create Prompt Engineering Blog Post</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>The Art of Prompt Engineering</CardTitle>
            <CardDescription>
              Create a collaborative blog post about prompt engineering techniques for effective AI communication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This action will create a new collaborative blog post titled "The Art of Prompt Engineering: Creating AI Communication Excellence". 
              The post covers fundamental principles, advanced techniques, domain-specific strategies, and ethical considerations in prompt engineering.
            </p>
            <p>
              After creation, you'll be able to view the post in the collaborative blog section.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 items-center">
            {!createdPostId ? (
              <Button 
                onClick={handleCreatePost} 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating post...
                  </>
                ) : (
                  'Create Post'
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleViewPost} 
                className="w-full sm:w-auto"
              >
                View Created Post
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/blog")}
              className="w-full sm:w-auto"
            >
              Back to Blog
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default CreatePromptEngineeringPost;