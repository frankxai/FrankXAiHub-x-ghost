import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb, Brain, GraduationCap } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
      <div className="enterprise-container">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-clash font-bold mb-6">Elevate Your AI Skills</h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join thousands of individuals who are transforming their careers and creativity 
              with our personalized AI learning paths and practical tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <Lightbulb className="h-8 w-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Personal Growth</h3>
              <p className="text-gray-200">Discover your AI strengths and get a personalized learning journey to enhance your skills</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="h-8 w-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Creative AI Tools</h3>
              <p className="text-gray-200">Access practical AI tools that enhance your creativity and productivity in everyday tasks</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <GraduationCap className="h-8 w-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Skill Mastery</h3>
              <p className="text-gray-200">Learn from experts and join a community of AI enthusiasts to accelerate your growth</p>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/assessment">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="bg-secondary hover:bg-secondary/90 h-14 px-8 text-white group shadow-lg shadow-secondary/20"
                  size="lg"
                >
                  Start Your AI Journey <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/resources">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:bg-opacity-10 h-14 px-8"
                  size="lg"
                >
                  Browse AI Resources
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
