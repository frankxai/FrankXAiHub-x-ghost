import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, itemVariants } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Lightbulb, Brain, Shield, Layers } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

const CreatePromptEngineeringPost: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<number | null>(null);
  const [_, navigate] = useLocation();
  
  const handleCreatePost = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest<BlogPost>({
        url: '/api/collaborative-blog-posts/create-prompt-engineering',
        method: 'POST',
        body: {}
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
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="outline" className="uppercase font-semibold mb-4">FrankX AI</Badge>
          <h1 className="text-4xl md:text-6xl font-clash font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            The Art of Prompt Engineering
          </h1>
          <p className="text-lg text-muted-foreground mx-auto max-w-3xl">
            Create a collaborative AI-driven blog post exploring the art and science of crafting effective prompts for advanced AI systems.
          </p>
        </div>
        
        <motion.div
          variants={containerVariants}
          className="mb-12"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm dark:from-background/60 dark:to-background/20">
            <CardHeader className="border-b border-border/20 pb-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur mb-4 mx-auto">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-clash text-center">
                AI Collaborative Content Creation
              </CardTitle>
              <CardDescription className="text-center text-lg max-w-2xl mx-auto mt-2">
                This unique blog post is crafted by our specialized AI personas, each contributing their unique expertise to deliver a comprehensive guide.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div variants={itemVariants} className="flex flex-col items-center p-6 rounded-lg bg-background/50 border border-border/20">
                  <Lightbulb className="h-10 w-10 text-yellow-500 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Fundamentals</h3>
                  <p className="text-center text-muted-foreground">
                    Core principles of crafting prompts that yield precise, relevant, and coherent AI responses
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex flex-col items-center p-6 rounded-lg bg-background/50 border border-border/20">
                  <Brain className="h-10 w-10 text-blue-500 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Advanced Techniques</h3>
                  <p className="text-center text-muted-foreground">
                    Sophisticated methods to control tone, style, format, and context awareness in AI interactions
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex flex-col items-center p-6 rounded-lg bg-background/50 border border-border/20">
                  <Layers className="h-10 w-10 text-indigo-500 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Domain Strategies</h3>
                  <p className="text-center text-muted-foreground">
                    Tailored approaches for specific sectors, demonstrating how prompt engineering varies across industries
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex flex-col items-center p-6 rounded-lg bg-background/50 border border-border/20">
                  <Shield className="h-10 w-10 text-green-500 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Ethical Considerations</h3>
                  <p className="text-center text-muted-foreground">
                    Responsible practices in AI communication, addressing bias, fairness, and transparency
                  </p>
                </motion.div>
              </div>
              
              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-primary/20">
                <p className="mb-4">
                  This action will create a new collaborative blog post titled "The Art of Prompt Engineering: Creating AI Communication Excellence" featuring insights from all four AI personas in the FrankX Center of Excellence.
                </p>
                <p>
                  After creation, you'll be able to view the complete post with all sections formatted beautifully in the collaborative blog section.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-border/20 pt-6">
              {!createdPostId ? (
                <Button 
                  onClick={handleCreatePost} 
                  disabled={isLoading}
                  className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></div>
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" color="white" />
                      Creating your masterpiece...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Collaborative Post
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleViewPost} 
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300"
                  size="lg"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  View Your Created Post
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/blog")}
                className="w-full sm:w-auto border-primary/20"
                size="lg"
              >
                Back to Blog
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreatePromptEngineeringPost;