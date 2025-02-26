import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-clash font-bold mb-6">Ready to Transform Your Enterprise with AI?</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Get started with FrankX.AI today and unlock the full potential of AI across your organization.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/assessment">
              <Button 
                className="bg-secondary hover:bg-secondary/90 h-14 px-8 text-white"
                size="lg"
              >
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/resources">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:bg-opacity-10 h-14 px-8"
                size="lg"
              >
                Explore Solutions
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
