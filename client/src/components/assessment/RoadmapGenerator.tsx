import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Assessment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ChevronRight, ChevronLeft } from "lucide-react";

interface RoadmapGeneratorProps {
  assessment: Assessment;
  onRoadmapGenerated: (roadmap: any) => void;
}

const RoadmapGenerator = ({ assessment, onRoadmapGenerated }: RoadmapGeneratorProps) => {
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const { toast } = useToast();
  
  // Generate roadmap on component mount
  useEffect(() => {
    generateRoadmap();
  }, []);
  
  // Simulate progress while generating
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);
  
  const generateRoadmap = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const response = await apiRequest("POST", "/api/generate-roadmap", {
        industry: assessment.industry,
        objectives: assessment.objectives,
      });
      
      const data = await response.json();
      setRoadmap(data);
      onRoadmapGenerated(data);
      
      toast({
        title: "Roadmap Generated",
        description: "Your AI implementation roadmap has been created successfully.",
      });
    } catch (error) {
      console.error("Error generating roadmap:", error);
      
      toast({
        title: "Generation Failed",
        description: "There was an error creating your roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };
  
  const handleNextPhase = () => {
    if (roadmap && activePhase < roadmap.phases.length - 1) {
      setActivePhase(activePhase + 1);
    }
  };
  
  const handlePrevPhase = () => {
    if (activePhase > 0) {
      setActivePhase(activePhase - 1);
    }
  };
  
  const downloadReport = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "Download Started",
      description: "Your report is being downloaded.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-md overflow-hidden mb-8">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-2xl font-clash">AI Maturity Assessment Results</CardTitle>
          <CardDescription>Based on your organization's profile and objectives</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {isGenerating ? (
            <div className="py-8 text-center">
              <h3 className="text-xl font-clash font-bold mb-4">Generating Your AI Implementation Roadmap</h3>
              <p className="text-overlay mb-6">
                Our AI is analyzing your assessment data and creating a customized implementation plan...
              </p>
              <Progress value={progress} className="mb-4" />
              <p className="text-sm text-overlay">{progress}% complete</p>
            </div>
          ) : roadmap ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Maturity Score</h3>
                  <div className="flex items-center mb-2">
                    <div className="text-4xl font-clash font-bold text-secondary mr-2">{assessment.maturityScore}</div>
                    <div className="text-lg">/100</div>
                  </div>
                  <p className="text-sm text-overlay mb-4">
                    Your organization is at the {getMaturityLevel(assessment.maturityScore || 0)} stage of AI maturity.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full" 
                      style={{ width: `${assessment.maturityScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Key Recommendations</h3>
                  <ul className="space-y-2">
                    {assessment.recommendations && assessment.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <h3 className="text-xl font-clash font-bold mb-4">Implementation Roadmap</h3>
              
              <div className="flex mb-6 border-b overflow-x-auto">
                {roadmap.phases.map((phase: any, index: number) => (
                  <button
                    key={index}
                    className={`px-4 py-3 border-b-2 text-sm whitespace-nowrap ${
                      activePhase === index 
                        ? 'border-secondary text-secondary font-medium' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActivePhase(index)}
                  >
                    Phase {index + 1}
                  </button>
                ))}
              </div>
              
              {roadmap.phases[activePhase] && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-clash font-bold">{roadmap.phases[activePhase].title}</h4>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePrevPhase}
                        disabled={activePhase === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleNextPhase}
                        disabled={activePhase === roadmap.phases.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-overlay mb-4">{roadmap.phases[activePhase].description}</p>
                  
                  <h5 className="font-medium mb-2">Key Steps:</h5>
                  <ul className="space-y-2 mb-4">
                    {roadmap.phases[activePhase].steps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-white border border-secondary text-secondary flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => generateRoadmap()}
                >
                  Regenerate Roadmap
                </Button>
                
                <Button 
                  className="flex items-center bg-secondary hover:bg-secondary/90 text-white"
                  onClick={downloadReport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p>An error occurred while generating your roadmap. Please try again.</p>
              <Button 
                className="mt-4" 
                onClick={() => generateRoadmap()}
              >
                Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-md overflow-hidden">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Schedule a Consultation</h4>
                <p className="text-sm text-overlay">
                  Speak with our AI strategy experts to discuss your assessment results and refine your implementation roadmap.
                </p>
                <Button 
                  variant="link" 
                  className="px-0 text-secondary"
                >
                  Book a Meeting
                </Button>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">AI Center of Excellence Workshop</h4>
                <p className="text-sm text-overlay">
                  Join our 2-day workshop to build the foundation for your organization's AI Center of Excellence.
                </p>
                <Button 
                  variant="link" 
                  className="px-0 text-secondary"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Download Additional Resources</h4>
                <p className="text-sm text-overlay">
                  Access our library of AI implementation guides, templates, and case studies.
                </p>
                <Button 
                  variant="link" 
                  className="px-0 text-secondary"
                >
                  Access Resources
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to determine maturity level based on score
const getMaturityLevel = (score: number): string => {
  if (score < 30) return "Beginning";
  if (score < 50) return "Developing";
  if (score < 70) return "Established";
  if (score < 85) return "Advanced";
  return "Leading";
};

export default RoadmapGenerator;
