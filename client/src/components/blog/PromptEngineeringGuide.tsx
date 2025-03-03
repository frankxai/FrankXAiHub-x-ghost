import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Download, ExternalLink, Copy, Check, Lightbulb, Brain, Target, Shield } from 'lucide-react';
import { itemVariants } from '@/lib/animations';

interface PromptExample {
  task: string;
  basic: string;
  advanced: string;
}

interface PromptEngineeringGuideProps {
  className?: string;
}

const PromptEngineeringGuide: React.FC<PromptEngineeringGuideProps> = ({ className }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const promptExamples: PromptExample[] = [
    {
      task: "Content Writing",
      basic: "Write a blog post about artificial intelligence.",
      advanced: "Write a 750-word blog post about the ethical implications of deploying artificial intelligence in healthcare. Include three main challenges, potential solutions, and cite relevant regulations. Target audience: healthcare administrators with basic AI knowledge. Tone: informative but accessible."
    },
    {
      task: "Code Generation",
      basic: "Write a function to sort an array.",
      advanced: "Create a TypeScript React hook called useDataFetching that handles API data fetching with loading, error, and success states. Include proper type definitions, error handling for network issues, automatic retry logic (max 3 attempts), and cache the results for 5 minutes. Add JSDoc comments explaining the parameters and return values."
    },
    {
      task: "Data Analysis",
      basic: "Analyze this sales data and tell me the trends.",
      advanced: "Analyze the following quarterly sales data from 2020-2023 and identify: 1) Seasonal patterns with percentage changes, 2) Year-over-year growth rates for each product category, 3) The top 3 underperforming segments with potential causes, and 4) Three actionable recommendations based on the trends. Format the analysis with clear sections and include a brief executive summary at the beginning."
    },
    {
      task: "Creative Writing",
      basic: "Write a short story about space exploration.",
      advanced: "Write a 500-word science fiction story about first contact with an alien civilization. The story should be told from the perspective of an AI translator who discovers nuances in the alien language that humans have missed. Incorporate themes of miscommunication and unintended consequences. Use a lyrical writing style similar to Ted Chiang, with careful attention to sensory details and philosophical implications."
    }
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadGuide = () => {
    // In a real implementation, this would generate or fetch a PDF
    // For now, we'll simulate a download
    const downloadUrl = '/downloads/prompt-engineering-playbook.pdf';
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'FrankX-AI-Prompt-Engineering-Playbook.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your prompt engineering playbook is downloading.",
    });
  };

  return (
    <div className={className}>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm dark:from-background/60 dark:to-background/20">
        <CardHeader className="border-b border-border/20 pb-8">
          <Badge className="uppercase self-center mb-2">Interactive Guide</Badge>
          <CardTitle className="text-2xl md:text-3xl font-clash text-center">
            Prompt Engineering Techniques
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Improve your AI interactions with these expert prompting strategies
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div variants={itemVariants} className="flex flex-col items-center p-6 rounded-lg bg-background/50 border border-border/20">
              <Lightbulb className="h-10 w-10 text-yellow-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">Be Specific</h3>
              <p className="text-center text-muted-foreground">
                Include details about format, length, tone, audience, and purpose in your prompts
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center p-6 rounded-lg bg-background/50 border border-border/20">
              <Brain className="h-10 w-10 text-blue-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">Use Examples</h3>
              <p className="text-center text-muted-foreground">
                Demonstrate the desired output format with examples to guide the AI response
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center p-6 rounded-lg bg-background/50 border border-border/20">
              <Target className="h-10 w-10 text-indigo-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">Iterate</h3>
              <p className="text-center text-muted-foreground">
                Refine your prompts based on the responses to gradually achieve better results
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center p-6 rounded-lg bg-background/50 border border-border/20">
              <Shield className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">Set Constraints</h3>
              <p className="text-center text-muted-foreground">
                Establish clear boundaries and limitations to keep responses focused and relevant
              </p>
            </motion.div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Before & After Examples</h3>
            <p className="text-muted-foreground mb-6">
              See how improving your prompts can dramatically enhance AI-generated results
            </p>
            
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                {promptExamples.map((example, index) => (
                  <TabsTrigger key={index} value={`example-${index}`} className="text-xs md:text-sm">
                    {example.task}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {promptExamples.map((example, index) => (
                <TabsContent key={index} value={`example-${index}`} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-border/50 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-destructive">Basic Prompt</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(example.basic, index)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded">{example.basic}</p>
                      <p className="mt-3 text-xs text-muted-foreground italic">Results: Generic, unfocused output lacking depth and specificity</p>
                    </div>
                    
                    <div className="rounded-lg border border-border/50 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-green-600">Advanced Prompt</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(example.advanced, index + 100)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedIndex === index + 100 ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded">{example.advanced}</p>
                      <p className="mt-3 text-xs text-muted-foreground italic">Results: Detailed, targeted output that precisely matches requirements</p>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-primary/20">
            <h3 className="text-xl font-bold mb-3">Want the Complete Playbook?</h3>
            <p className="mb-4">
              Download our comprehensive Prompt Engineering Playbook featuring 50+ templates, advanced techniques, and industry-specific strategies.
            </p>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <div className="flex items-center mr-4">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span>50+ Prompt Templates</span>
              </div>
              <div className="flex items-center mr-4">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span>Domain-Specific Guides</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span>Expert Techniques</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-border/20 pt-6">
          <Button 
            onClick={handleDownloadGuide} 
            className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300"
            size="lg"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></div>
            <Download className="mr-2 h-5 w-5" />
            Download Playbook (PDF)
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.open('https://frankx.ai', '_blank')}
            className="w-full sm:w-auto border-primary/20"
            size="lg"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Visit FrankX AI
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PromptEngineeringGuide;