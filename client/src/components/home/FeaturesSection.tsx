import { FEATURES } from "@/lib/constants";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { 
  Brain, 
  Bot, 
  Music,
  Sparkles,
  LineChart,
  ChevronRight 
} from "lucide-react";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'brain':
      return <Brain className="w-6 h-6" />;
    case 'bot':
      return <Bot className="w-6 h-6" />;
    case 'music':
      return <Music className="w-6 h-6" />;
    case 'sparkles':
      return <Sparkles className="w-6 h-6" />;
    case 'line-chart':
      return <LineChart className="w-6 h-6" />;
    default:
      return <Sparkles className="w-6 h-6" />;
  }
};

const getIconColor = (colorName: string) => {
  switch (colorName) {
    case 'primary':
      return 'text-primary dark:text-white';
    case 'secondary':
      return 'text-secondary';
    case 'accent':
      return 'text-accent';
    default:
      return 'text-secondary';
  }
};

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-clash font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-secondary dark:to-accent">
            My AI Explorations
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl">
            A showcase of my personal projects and experiments pushing the boundaries of what's possible with artificial intelligence.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {FEATURES.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-slate-700/30 shadow-lg shadow-slate-200/50 dark:shadow-black/10 p-8 relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(0, 194, 255, 0.15)"
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Decorative gradient blob in background */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-secondary/5 to-accent/5 rounded-full blur-2xl" />
              
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 dark:from-secondary/20 dark:to-accent/20 flex items-center justify-center mb-7 shadow-inner`}>
                <span className={getIconColor(feature.iconColor)}>
                  {getIcon(feature.icon)}
                </span>
              </div>
              
              <h3 className="font-clash font-bold text-2xl mb-4 text-gray-800 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-slate-300 mb-6 text-base">{feature.description}</p>
              
              <Link href={feature.link}>
                <motion.div
                  className={`inline-flex items-center font-medium ${feature.iconColor === 'primary' ? 'text-primary dark:text-white' : feature.iconColor === 'secondary' ? 'text-secondary' : 'text-accent'}`}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.linkText} <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
