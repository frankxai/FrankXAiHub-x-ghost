import { useState } from "react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import RoadmapGenerator from "@/components/assessment/RoadmapGenerator";
import { InsertAssessment, Assessment } from "@shared/schema";

const AssessmentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  
  const handleAssessmentComplete = (completedAssessment: Assessment) => {
    setAssessment(completedAssessment);
    setCurrentStep(2);
  };
  
  const handleRoadmapGenerated = (generatedRoadmap: any) => {
    setRoadmap(generatedRoadmap);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20 relative overflow-hidden gradient-bg"
    >
      {/* Background elements - subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-clash font-bold mb-4">AI Maturity Assessment</h1>
          <p className="text-lg text-overlay">
            Evaluate your organization's AI readiness and get a personalized implementation roadmap.
          </p>
        </div>
        
        {currentStep === 1 && (
          <AssessmentForm onComplete={handleAssessmentComplete} />
        )}
        
        {currentStep === 2 && assessment && (
          <RoadmapGenerator 
            assessment={assessment} 
            onRoadmapGenerated={handleRoadmapGenerated}
          />
        )}
        
        {/* Information section explaining the assessment */}
        <section className="mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-clash font-bold mb-6">About the AI Maturity Assessment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-clash font-bold text-lg mb-3">What We Assess</h3>
                <ul className="space-y-2 text-overlay">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Strategy & Leadership Alignment</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Data Readiness & Infrastructure</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI Skills & Talent Capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI Governance & Ethics Frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Technology & Tool Readiness</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-clash font-bold text-lg mb-3">What You'll Receive</h3>
                <ul className="space-y-2 text-overlay">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Comprehensive AI Maturity Score</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span>Detailed Analysis by Capability Area</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Customized AI Implementation Roadmap</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span>Prioritized Recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <span>Industry Benchmarking</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-primary rounded-xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-clash font-bold text-secondary mb-2">94%</div>
                  <p className="text-gray-300">of companies report increased confidence in AI implementation after assessment</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-clash font-bold text-secondary mb-2">87%</div>
                  <p className="text-gray-300">higher success rate for AI projects guided by assessment-based roadmaps</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-clash font-bold text-secondary mb-2">3.2x</div>
                  <p className="text-gray-300">faster time-to-value for AI initiatives with proper maturity assessment</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default AssessmentPage;
