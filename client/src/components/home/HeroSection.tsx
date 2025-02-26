import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  floatVariants, 
  floatVariantsDelay1, 
  floatVariantsDelay2, 
  containerVariants, 
  itemVariants,
  fadeIn 
} from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Brain, 
  Code, 
  Bot, 
  LineChart, 
  Atom, 
  Layers,
  Lightbulb
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-36 pb-24 overflow-hidden relative">
      {/* Background gradient elements - more sophisticated */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient sphere */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        </div>
        
        {/* Secondary gradient sphere */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary/5 to-accent/5 dark:from-secondary/10 dark:to-accent/10 blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiMyMDIwMjAiIHN0cm9rZS13aWR0aD0iMC4yNSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBoLTMweiIvPjxwYXRoIGQ9Ik0wIDBoMzB2MzBoLTMweiIvPjwvZz48L3N2Zz4=')] opacity-[0.015] dark:opacity-[0.03]"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="md:w-1/2 mb-16 md:mb-0"
            variants={itemVariants}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-5 inline-block"
            >
              <span className="bg-gradient-to-r from-secondary/10 to-accent/10 dark:from-secondary/20 dark:to-accent/20 text-secondary dark:text-white px-4 py-2 rounded-full font-medium text-sm tracking-wide inline-flex items-center">
                <Sparkles className="inline-block w-4 h-4 mr-2" /> The Future of Personal AI
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-clash font-bold leading-tight mb-8">
              <span className="text-slate-900 dark:text-white">Crafting</span> <br />
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent"
                initial={{ backgroundPosition: '0% center' }}
                animate={{ backgroundPosition: '100% center' }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 8,
                  ease: "linear"
                }}
              >
                Digital Intelligence
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl leading-relaxed"
              variants={fadeIn}
            >
              A personal journey exploring the bleeding edge of AI. Discover my custom agents, creative projects, and experimental applications pushing the boundaries of artificial intelligence.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/conversation">
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0, 120, 255, 0.18)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-14 px-8 rounded-xl shadow-xl shadow-primary/10 dark:shadow-primary/20 group">
                    <Atom className="mr-2 h-5 w-5" /> Experience My AI Lab
                  </Button>
                </motion.div>
              </Link>
              <Link href="/blog">
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="h-14 px-8 rounded-xl backdrop-blur-sm border-slate-200 dark:border-slate-700 group">
                    <Lightbulb className="mr-2 h-5 w-5" /> Read My AI Insights
                  </Button>
                </motion.div>
              </Link>
            </div>
            
            <motion.div 
              className="mt-16 flex items-center bg-slate-50/80 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 dark:border-slate-700/30 shadow-sm"
              variants={fadeIn}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="mr-4 h-12 w-12 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center shadow-inner">
                <Brain className="h-6 w-6 text-secondary dark:text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Pushing AI boundaries since 2022</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Building agents that transform how we interact with technology</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-xl mx-auto">
              {/* Floating orbs behind cards */}
              <motion.div 
                className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 blur-[60px]"
                variants={floatVariants}
                initial="initial"
                animate="animate"
              ></motion.div>
              <motion.div 
                className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-secondary/5 to-accent/5 dark:from-secondary/10 dark:to-accent/10 blur-[60px]"
                variants={floatVariantsDelay2}
                initial="initial"
                animate="animate"
              ></motion.div>
              
              {/* 3D Floating UI Elements with glass morphism */}
              <div className="relative">
                {/* Main Dashboard Card - central piece */}
                <motion.div 
                  className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 mb-4 shadow-2xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700/40"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.15)", 
                    transition: { duration: 0.3 } 
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-clash font-bold text-xl text-slate-900 dark:text-white">AI Projects Dashboard</h3>
                    <div className="flex space-x-1">
                      <span className="h-3 w-3 rounded-full bg-accent"></span>
                      <span className="h-3 w-3 rounded-full bg-secondary"></span>
                      <span className="h-3 w-3 rounded-full bg-primary"></span>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Neural Network Training</span>
                        <span className="font-medium text-slate-900 dark:text-white">92/100</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Model Accuracy</span>
                        <span className="font-medium text-slate-900 dark:text-white">87%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }}
                          animate={{ width: "87%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                        ></motion.div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/40">
                        <div className="text-slate-500 dark:text-slate-400 text-xs">Custom Agents</div>
                        <div className="font-clash font-bold text-2xl text-slate-900 dark:text-white flex items-baseline">
                          24 <span className="text-xs ml-1 text-green-500">+3</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/40">
                        <div className="text-slate-500 dark:text-slate-400 text-xs">Active Research</div>
                        <div className="font-clash font-bold text-2xl text-slate-900 dark:text-white flex items-baseline">
                          7 <span className="text-xs ml-1 text-green-500">+2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Top-right floating card */}
                <motion.div 
                  className="absolute top-10 -right-12 sm:-right-24 w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 p-4 border border-slate-100 dark:border-slate-700/40 z-10"
                  variants={floatVariantsDelay1}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)", 
                    transition: { duration: 0.3 } 
                  }}
                >
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg h-24 mb-3 flex items-center justify-center">
                    <Layers className="h-10 w-10 text-primary dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-base text-slate-900 dark:text-white mb-1">Neural Networks</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Generative architecture experiments with custom fine-tuning</p>
                  </div>
                </motion.div>
                
                {/* Bottom-left floating card */}
                <motion.div 
                  className="absolute -bottom-6 -left-12 sm:-left-24 w-56 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 p-4 border border-slate-100 dark:border-slate-700/40 z-10"
                  variants={floatVariantsDelay2}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)", 
                    transition: { duration: 0.3 } 
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-white">Model Performance</h4>
                    <span className="text-accent text-xs font-medium px-2 py-1 bg-accent/10 rounded-full">Live</span>
                  </div>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 overflow-hidden">
                    <div className="h-20 relative">
                      {/* Mini analytics graph */}
                      <svg className="w-full h-full" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 40 L0 30 C5 28, 10 15, 15 20 C20 25, 25 18, 30 15 C35 12, 40 20, 45 25 C50 30, 55 28, 60 22 C65 16, 70 10, 75 8 C80 6, 85 10, 90 12 C95 14, 100 16, 100 16 L100 40 Z" fill="url(#gradient1)" opacity="0.2" />
                        <path d="M0 30 C5 28, 10 15, 15 20 C20 25, 25 18, 30 15 C35 12, 40 20, 45 25 C50 30, 55 28, 60 22 C65 16, 70 10, 75 8 C80 6, 85 10, 90 12 C95 14, 100 16, 100 16" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <defs>
                          <linearGradient id="gradient1" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0ea5e9" />
                            <stop offset="1" stopColor="#6366f1" />
                          </linearGradient>
                          <linearGradient id="gradient2" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0ea5e9" />
                            <stop offset="1" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute bottom-2 right-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <LineChart className="h-3 w-3 inline-block mr-1" /> Real-time
                      </div>
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
