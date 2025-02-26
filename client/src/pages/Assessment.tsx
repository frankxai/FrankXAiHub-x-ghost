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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-clash font-bold text-lg mb-3 dark:text-white">What We Assess</h3>
                <ul className="space-y-2 text-overlay dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#00C2FF]">✅</div>
                    <span>Strategy & Leadership Alignment</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#00C2FF]">✅</div>
                    <span>Data Readiness & Infrastructure</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#00C2FF]">✅</div>
                    <span>AI Skills & Talent Capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#00C2FF]">✅</div>
                    <span>AI Governance & Ethics Frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#00C2FF]">✅</div>
                    <span>Technology & Tool Readiness</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-clash font-bold text-lg mb-3 dark:text-white">What You'll Receive</h3>
                <ul className="space-y-2 text-overlay dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#FF3366]">📊</div>
                    <span>Comprehensive AI Maturity Score</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#FF3366]">📋</div>
                    <span>Detailed Analysis by Capability Area</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#FF3366]">⚡</div>
                    <span>Customized AI Implementation Roadmap</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#FF3366]">🔍</div>
                    <span>Prioritized Recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 flex-shrink-0 mt-0.5 text-[#FF3366]">📈</div>
                    <span>Industry Benchmarking</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#171717] dark:bg-[#171717] rounded-xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-clash font-bold text-[#00C2FF] mb-2">94% 🚀</div>
                  <p className="text-gray-300">of companies report increased confidence in AI implementation after assessment</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-clash font-bold text-[#00C2FF] mb-2">87% 📈</div>
                  <p className="text-gray-300">higher success rate for AI projects guided by assessment-based roadmaps</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-clash font-bold text-[#00C2FF] mb-2">3.2x ⚡</div>
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
