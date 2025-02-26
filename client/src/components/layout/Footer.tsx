import { Link } from "wouter";
import { COMPANY_INFO, FOOTER_LINKS } from "@/lib/constants";
import { FaLinkedin, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const getSocialIcon = (icon: string) => {
  switch (icon) {
    case 'linkedin':
      return <FaLinkedin className="text-xl" />;
    case 'twitter':
      return <FaTwitter className="text-xl" />;
    case 'youtube':
      return <FaYoutube className="text-xl" />;
    case 'medium':
      return <FaMedium className="text-xl" />;
    default:
      return null;
  }
};

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Modern gradient background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M20 0C9 0 0 9 0 20s9 20 20 20 20-9 20-20S31 0 20 0zm0 37c-9.4 0-17-7.6-17-17S10.6 3 20 3s17 7.6 17 17-7.6 17-17 17z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      <div className="relative pt-20 pb-10">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-70"></div>
        
        {/* Floating particle effects */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-secondary/30 rounded-full"
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`
              }}
              animate={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`
              }}
              transition={{ 
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <Link href="/">
                <motion.div 
                  className="inline-flex items-center mb-6 group"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-3xl font-clash font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary via-secondary to-accent">
                    FrankX.AI
                  </span>
                  <Sparkles className="ml-2 h-5 w-5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </Link>
              
              <p className="text-slate-400 mb-7 max-w-md text-base leading-relaxed">
                {COMPANY_INFO.description}
              </p>
              
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-5 border border-slate-700/60 mb-7">
                <h4 className="flex items-center text-white font-clash font-medium mb-3">
                  <span className="h-5 w-1 bg-secondary mr-3 rounded-full"></span>
                  Join My AI Journey
                </h4>
                <p className="text-slate-400 text-sm mb-4">Get updates on my latest AI experiments, projects, and insights.</p>
                
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-l-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                  <button className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white rounded-r-lg px-4 flex items-center justify-center group">
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                {COMPANY_INFO.social.map((item) => (
                  <motion.a 
                    key={item.name}
                    href={item.url} 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:text-white hover:border-secondary/50 transition-all duration-300"
                    aria-label={item.name}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: "rgba(0, 194, 255, 0.2)",
                      borderColor: "rgba(0, 194, 255, 0.5)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {getSocialIcon(item.icon)}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div>
                  <h4 className="font-clash font-bold text-lg mb-6 text-white">My Projects</h4>
                  <ul className="space-y-3.5">
                    {FOOTER_LINKS.projects.map((item) => (
                      <motion.li 
                        key={item.name}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={item.url}
                          className="text-slate-400 hover:text-secondary transition-colors duration-300 text-sm flex items-center"
                        >
                          <span className="h-0.5 w-0 bg-secondary mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                          {item.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-clash font-bold text-lg mb-6 text-white">My Content</h4>
                  <ul className="space-y-3.5">
                    {FOOTER_LINKS.content.map((item) => (
                      <motion.li 
                        key={item.name}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={item.url}
                          className="text-slate-400 hover:text-secondary transition-colors duration-300 text-sm"
                        >
                          {item.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-clash font-bold text-lg mb-6 text-white">About</h4>
                  <ul className="space-y-3.5">
                    {FOOTER_LINKS.about.map((item) => (
                      <motion.li 
                        key={item.name}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={item.url}
                          className="text-slate-400 hover:text-secondary transition-colors duration-300 text-sm"
                        >
                          {item.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer bottom - copyright and legal */}
          <div className="relative border-t border-slate-800/80 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-slate-500 text-sm">© 2025 <span className="text-slate-400">FrankX.AI</span> • All rights reserved.</p>
              </div>
              <div className="flex space-x-8">
                <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-300">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
