import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Sparkles, 
  BrainCircuit, 
  MousePointerClick, 
  LineChart,
  LucideIcon,
  Workflow
} from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => (
  <motion.div 
    className="relative overflow-hidden backdrop-blur-md rounded-xl bg-gradient-to-br from-white/5 to-white/10 dark:from-white/5 dark:to-white/10 p-8 border border-white/10 shadow-xl shadow-accent/5"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ 
      y: -8,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
      borderColor: "rgba(255, 255, 255, 0.2)"
    }}
  >
    {/* Decorative elements */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-16 -left-6 w-28 h-28 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-2xl"></div>
    
    <div className="relative">
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner mb-6">
        <Icon className="h-7 w-7 text-white" />
      </div>
      
      <h3 className="text-xl font-clash font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-200/90 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const CallToAction = () => {
  return (
    <section className="py-28 relative">
      {/* Sophisticated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-secondary/90 overflow-hidden">
        {/* Advanced visual elements */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{ 
                opacity: 0.3,
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`
              }}
              animate={{ 
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`
              }}
              transition={{ 
                duration: 8 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/10 shadow-md"
            >
              <Sparkles className="h-4 w-4 mr-2 text-white" />
              <span className="text-white text-sm font-medium">Join My AI Exploration</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-clash font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover My Personal <br /> AI Journey
            </motion.h2>
            
            <motion.p 
              className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Follow along as I explore the cutting edge of artificial intelligence, creating custom agents, experimenting with generative models, and crafting intelligent interfaces.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard 
              icon={BrainCircuit}
              title="Neural Network Experiments"
              description="See how I'm pushing boundaries with custom neural architectures and training methods for specialized AI tasks."
              index={0}
            />
            
            <FeatureCard 
              icon={MousePointerClick}
              title="Interactive Demos"
              description="Experience hands-on demonstrations of my latest AI projects and explore practical applications for everyday use."
              index={1}
            />
            
            <FeatureCard 
              icon={Workflow}
              title="Process Insights"
              description="Gain behind-the-scenes access to my development process, research methodologies, and technical explorations."
              index={2}
            />
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/assessment">
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-xl shadow-xl shadow-black/10 group"
                  size="lg"
                >
                  <LineChart className="mr-2 h-5 w-5" /> 
                  Assess Your AI Potential 
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/resources">
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 h-14 px-8 rounded-xl backdrop-blur-md"
                  size="lg"
                >
                  Explore AI Resources
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
