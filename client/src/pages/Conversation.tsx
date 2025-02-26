import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";
import { AICharacter } from "@shared/schema";
import CharacterSelector from "@/components/conversation/CharacterSelector";
import ChatInterface from "@/components/conversation/ChatInterface";

const Conversation = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<AICharacter | null>(null);
  
  const { data: characters, isLoading } = useQuery<AICharacter[]>({
    queryKey: ['/api/ai-characters'],
    onSuccess: (data) => {
      // Set the first character as default if none is selected
      if (data.length > 0 && !selectedCharacter) {
        setSelectedCharacter(data[0]);
      }
    }
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute w-full h-full bg-gradient-to-br from-secondary/20 to-accent/20 blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-clash font-bold mb-4">AI Conversation</h1>
          <p className="text-lg text-overlay">
            Experience our enterprise-grade AI characters, copilots, and agents designed for business use cases.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : characters && characters.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <CharacterSelector 
                characters={characters} 
                selectedCharacter={selectedCharacter}
                onSelectCharacter={setSelectedCharacter}
              />
            </div>
            
            <div className="lg:col-span-2">
              {selectedCharacter ? (
                <ChatInterface character={selectedCharacter} />
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <p className="text-lg text-overlay">Please select an AI character to start a conversation.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-overlay">No AI characters available. Please try again later.</p>
          </div>
        )}
        
        {/* Enterprise use cases section */}
        <section className="mt-20">
          <h2 className="text-2xl font-clash font-bold mb-8 text-center dark:text-white">Enterprise Use Cases 🚀</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 bg-[#00C2FF]/10 dark:bg-[#00C2FF]/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">🛡️</div>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2 dark:text-white">AI Governance Assistant</h3>
              <p className="text-overlay dark:text-gray-300">Provides guidance on AI ethics, regulatory compliance, and governance best practices for your organization.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 bg-[#FF3366]/10 dark:bg-[#FF3366]/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">📊</div>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2 dark:text-white">Business Case Copilot</h3>
              <p className="text-overlay dark:text-gray-300">Helps build comprehensive AI business cases with ROI calculations, implementation timelines, and risk assessments.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 bg-[#171717]/10 dark:bg-[#FFFFFF]/10 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">🎓</div>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2 dark:text-white">AI Training Manager</h3>
              <p className="text-overlay dark:text-gray-300">Creates customized AI training programs for different roles in your organization, from executives to practitioners.</p>
            </div>
          </div>
          
          <div className="mt-12 bg-[#171717] dark:bg-[#171717] text-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-clash font-bold">Start Your AI Transformation Journey</h3>
              <p className="text-gray-300 mt-2">Our AI characters are just the beginning of what we offer</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl mr-3">🤖</div>
                <div>
                  <h4 className="font-medium text-[#00C2FF]">Custom AI Assistants</h4>
                  <p className="text-sm text-gray-300">Tailored to your industry and use cases</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl mr-3">📋</div>
                <div>
                  <h4 className="font-medium text-[#00C2FF]">Maturity Assessment</h4>
                  <p className="text-sm text-gray-300">Evaluate your AI readiness and capabilities</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl mr-3">⚙️</div>
                <div>
                  <h4 className="font-medium text-[#00C2FF]">Integration Services</h4>
                  <p className="text-sm text-gray-300">Connect AI to your existing systems</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl mr-3">🚀</div>
                <div>
                  <h4 className="font-medium text-[#00C2FF]">Implementation Roadmap</h4>
                  <p className="text-sm text-gray-300">Structured plan for AI adoption</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Conversation;
