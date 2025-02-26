import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Award, TrendingUp, BarChart } from "lucide-react";

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
            <h2 className="text-3xl md:text-5xl font-clash font-bold mb-6">Enterprise AI Transformation Excellence</h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join Fortune 500 companies leveraging our AI Center of Excellence framework to 
              accelerate implementation, improve ROI, and drive strategic business outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Award className="h-8 w-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Enterprise AI Readiness</h3>
              <p className="text-gray-200">Comprehensive AI maturity assessment with actionable implementation roadmap</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <TrendingUp className="h-8 w-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Strategic Implementation</h3>
              <p className="text-gray-200">Governance frameworks and change management strategies for AI adoption</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <BarChart className="h-8 w-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">ROI Optimization</h3>
              <p className="text-gray-200">Measurable business outcomes and continuous performance analytics</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/assessment">
              <Button 
                className="bg-secondary hover:bg-secondary/90 h-14 px-8 text-white group"
                size="lg"
              >
                Start AI Assessment <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:bg-opacity-10 h-14 px-8"
                size="lg"
              >
                Enterprise AI Resources
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
