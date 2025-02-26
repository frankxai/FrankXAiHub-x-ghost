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
          <h2 className="text-2xl font-clash font-bold mb-8 text-center">Enterprise Use Cases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2">AI Governance Assistant</h3>
              <p className="text-overlay">Provides guidance on AI ethics, regulatory compliance, and governance best practices for your organization.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2">Business Case Copilot</h3>
              <p className="text-overlay">Helps build comprehensive AI business cases with ROI calculations, implementation timelines, and risk assessments.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2">AI Training Manager</h3>
              <p className="text-overlay">Creates customized AI training programs for different roles in your organization, from executives to practitioners.</p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Conversation;
