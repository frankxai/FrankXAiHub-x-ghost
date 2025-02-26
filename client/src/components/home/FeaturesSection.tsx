import { FEATURES } from "@/lib/constants";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { 
  Brain, 
  Bot, 
  Music, 
  ChevronRight 
} from "lucide-react";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'brain':
      return <Brain className="text-2xl" />;
    case 'robot':
      return <Bot className="text-2xl" />;
    case 'music':
      return <Music className="text-2xl" />;
    default:
      return null;
  }
};

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-clash font-bold mb-4">Enterprise AI Expertise</h2>
          <p className="text-lg text-overlay">We help organizations build and scale AI capabilities with strategic frameworks and implementation roadmaps.</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {FEATURES.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-2xl shadow-sm p-8"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-14 h-14 bg-${feature.iconColor} bg-opacity-10 rounded-lg flex items-center justify-center mb-6`}>
                {getIcon(feature.icon)}
              </div>
              <h3 className="font-clash font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-overlay mb-4">{feature.description}</p>
              <Link href={feature.link} className={`text-${feature.iconColor} font-medium flex items-center`}>
                {feature.linkText} <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
