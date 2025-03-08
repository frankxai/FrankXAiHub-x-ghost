import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { pageVariants } from "@/lib/animations";
import { AICharacter } from "@shared/schema";
import CharacterSelector from "@/components/conversation/CharacterSelector";
import ChatInterface from "@/components/conversation/ChatInterface";

const Conversation = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<AICharacter | null>(null);
  
  const { data: characters, isLoading } = useQuery<AICharacter[]>({
    queryKey: ['/api/ai-characters']
  });
  
  // Set the first character as default if none is selected
  useEffect(() => {
    if (characters && characters.length > 0 && !selectedCharacter) {
      setSelectedCharacter(characters[0]);
    }
  }, [characters, selectedCharacter]);

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
          <h1 className="text-4xl md:text-5xl font-clash font-bold mb-4">AI Agents</h1>
          <p className="text-lg text-overlay mb-6">
            Powerful AI agents to help you achieve financial freedom through passive income, content creation, and AI-powered business.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/chat-fullscreen/1" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#005CB2] via-[#00A3FF] to-[#1CD3FF] text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              Try Full-Screen Experience
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
                  <p className="text-lg text-overlay dark:text-gray-300">Please select an AI character to start a conversation.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-overlay">No AI characters available. Please try again later.</p>
          </div>
        )}
        
        {/* Wealth creation use cases section */}
        <section className="mt-20">
          <h2 className="text-2xl font-clash font-bold mb-8 text-center dark:text-white">AI-Powered Wealth Creation Strategies 💰</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 bg-[#00C2FF]/10 dark:bg-[#00C2FF]/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">💸</div>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2 dark:text-white">Passive Income Agent</h3>
              <p className="text-overlay dark:text-gray-300">Helps you build and manage automated income streams that make money while you sleep using AI-powered systems.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 bg-[#FF3366]/10 dark:bg-[#FF3366]/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">🚀</div>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2 dark:text-white">Content Creator Copilot</h3>
              <p className="text-overlay dark:text-gray-300">Accelerate your content production and maximize monetization across channels using AI-optimized strategies.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 bg-[#171717]/10 dark:bg-[#FFFFFF]/10 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">🤖</div>
              </div>
              <h3 className="font-clash font-bold text-xl mb-2 dark:text-white">AI Business Architect</h3>
              <p className="text-overlay dark:text-gray-300">Design, launch, and scale your own AI-powered businesses with minimal overhead and maximum profit potential.</p>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-[#000B1E] to-[#001E43] text-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-clash font-bold">Start Your Financial Freedom Journey</h3>
              <p className="text-gray-300 mt-2">Our AI agents help you build wealth and achieve time freedom</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl mr-3">⚡</div>
                <div>
                  <h4 className="font-medium text-[#00C2FF]">AI Side Hustles</h4>
                  <p className="text-sm text-gray-300">Launch profitable AI-powered side businesses</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl mr-3">🔄</div>
                <div>
                  <h4 className="font-medium text-[#00C2FF]">Automation Systems</h4>
                  <p className="text-sm text-gray-300">Create self-running income machines</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl mr-3">🔍</div>
                <div>
                  <h4 className="font-medium text-[#00C2FF]">Opportunity Finder</h4>
                  <p className="text-sm text-gray-300">Discover underserved markets and trends</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl mr-3">📱</div>
                <div>
                  <h4 className="font-medium text-[#00C2FF]">Personal AI Stack</h4>
                  <p className="text-sm text-gray-300">Build your own suite of wealth-creation agents</p>
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
