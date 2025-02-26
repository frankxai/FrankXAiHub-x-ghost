import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  floatVariants, 
  floatVariantsDelay1, 
  floatVariantsDelay2, 
  containerVariants, 
  itemVariants 
} from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Code, Bot } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-secondary blur-3xl -top-10 -right-10"></div>
        <div className="absolute w-96 h-96 rounded-full bg-accent blur-3xl bottom-20 right-40"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            variants={itemVariants}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-4 inline-block"
            >
              <span className="bg-secondary/10 text-secondary text-sm font-medium px-3 py-1 rounded-full">
                <Sparkles className="inline-block w-4 h-4 mr-1" /> Frank's AI Journey
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-clash font-bold leading-tight mb-6">
              My Personal <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
                AI Experiments
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Welcome to my digital AI laboratory where I share my personal projects, custom agents, and creative explorations with artificial intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/conversation">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="bg-primary hover:bg-primary/90 h-12 px-6 shadow-lg shadow-primary/20 group">
                    Meet My AI Agents <Bot className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/blog">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="h-12 px-6 group">
                    Read My AI Blog <Code className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center">
              <div className="flex items-center bg-secondary/5 p-3 rounded-xl">
                <Brain className="h-8 w-8 text-secondary mr-3" />
                <div>
                  <p className="text-sm font-medium">Creating & sharing innovative AI projects since 2022</p>
                  <p className="text-xs text-muted-foreground">Join me on my journey of exploring AI's creative potential</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-lg mx-auto">
              <motion.div 
                className="absolute top-0 -left-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10"
                variants={floatVariants}
                initial="initial"
                animate="animate"
              ></motion.div>
              <motion.div 
                className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-10"
                variants={floatVariantsDelay1}
                initial="initial"
                animate="animate"
              ></motion.div>
              <motion.div 
                className="absolute -bottom-8 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-10"
                variants={floatVariantsDelay2}
                initial="initial"
                animate="animate"
              ></motion.div>
              
              {/* 3D Floating UI Elements */}
              <div className="relative">
                {/* Main Dashboard Card */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl p-6 mb-4"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-clash font-bold text-lg">My AI Projects Dashboard</h3>
                    <div className="text-overlay">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Agent Intelligence</span>
                        <span className="font-medium">85/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Project Progress</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: "67%" }}></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-overlay text-xs">AI Agents</div>
                        <div className="font-clash font-bold text-xl">16</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-overlay text-xs">Experiments</div>
                        <div className="font-clash font-bold text-xl">42</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating AI Character Card */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg p-4 absolute top-5 -right-20 w-40"
                  variants={floatVariantsDelay1}
                  initial="initial"
                  animate="animate"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg h-20 mb-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-sm">Creative AI</h4>
                    <p className="text-xs text-muted-foreground">Latest Project</p>
                  </div>
                </motion.div>
                
                {/* Floating Stats Card */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg p-4 absolute -bottom-10 -left-16 w-44"
                  variants={floatVariantsDelay2}
                  initial="initial"
                  animate="animate"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Project Stats</span>
                    <span className="text-secondary text-xs">New</span>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-2">
                    <div className="h-10 relative overflow-hidden">
                      {/* Simple chart mockup */}
                      <div className="absolute bottom-0 left-0 w-2 h-6 bg-secondary rounded-sm opacity-30"></div>
                      <div className="absolute bottom-0 left-3 w-2 h-8 bg-secondary rounded-sm opacity-60"></div>
                      <div className="absolute bottom-0 left-6 w-2 h-5 bg-secondary rounded-sm opacity-40"></div>
                      <div className="absolute bottom-0 left-9 w-2 h-9 bg-secondary rounded-sm opacity-80"></div>
                      <div className="absolute bottom-0 left-12 w-2 h-7 bg-secondary rounded-sm opacity-50"></div>
                      <div className="absolute bottom-0 left-15 w-2 h-10 bg-secondary rounded-sm"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
