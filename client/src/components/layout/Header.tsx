import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { NAV_LINKS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, ChevronRight, Brain, BrainCircuit, Cog, Network, Cpu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => location === path;
  
  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for modern feel
      }
    },
    hover: {
      scale: 1.05,
      filter: "brightness(1.1)",
      transition: { 
        duration: 0.3, 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };
  
  const navItemVariants = {
    hover: { 
      scale: 1.05, 
      y: -2,
      color: "var(--secondary)",
      transition: { 
        duration: 0.3, 
        ease: [0.34, 1.56, 0.64, 1] // Custom elastic-like cubic-bezier
      }
    }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(0, 166, 224, 0.25)",
      background: "var(--secondary)",
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    },
    tap: { 
      scale: 0.97,
      transition: { 
        duration: 0.1 
      }
    }
  };
  
  // Logo animation variants with 3D effects
  const logoIconVariants = {
    initial: { 
      rotateY: 0,
      scale: 1
    },
    animate: { 
      rotateY: [0, 10, 0, -10, 0],
      scale: [1, 1.1, 1, 1.1, 1],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  };

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/95 backdrop-blur-md shadow-md dark:shadow-none" 
          : "bg-background/50 backdrop-blur-sm"
      } border-b border-border/60 dark:border-border/30`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="enterprise-container">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <motion.div 
              className="flex items-center gap-2.5"
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={logoVariants}
            >
              <div className="flex flex-col">
                <motion.span 
                  className="text-2xl font-clash font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-secondary"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
                >
                  FrankX.AI
                </motion.span>
                <span className="text-xs text-muted-foreground font-medium leading-tight">
                  AI Excellence for People
                </span>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-0.5">
            <AnimatePresence>
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05, 
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <motion.div
                    whileHover="hover"
                    variants={navItemVariants}
                  >
                    <Link 
                      href={link.path}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative ${
                        isActive(link.path) 
                          ? "text-secondary dark:text-secondary" 
                          : "text-foreground dark:text-foreground hover:text-secondary dark:hover:text-secondary"
                      }`}
                    >
                      {link.title}
                      {isActive(link.path) && (
                        <motion.span
                          className="absolute bottom-0 left-0 right-0 mx-auto w-1 h-1 bg-secondary rounded-full"
                          layoutId="navIndicator"
                          transition={{ 
                            duration: 0.5, 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 30 
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
          
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/assessment">
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button className="bg-secondary hover:bg-secondary text-white h-10 px-4 gap-1.5 group shadow-md shadow-secondary/20 dark:shadow-secondary/10 font-medium">
                  Start Your AI Journey
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button variant="outline" size="icon" className="rounded-full border-border/60 dark:border-border/30">
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>
            <ThemeToggle />
          </div>
          
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l border-border">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-clash font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-secondary">
                      FrankX.AI
                    </span>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  AI Excellence for People
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link 
                      href={link.path}
                      className={`px-3 py-2.5 rounded-md text-base font-medium hover:bg-secondary/10 flex items-center transition-colors ${
                        isActive(link.path) 
                          ? "bg-secondary/15 text-secondary" 
                          : "text-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.title}
                      {isActive(link.path) && (
                        <motion.div 
                          className="ml-auto"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="h-4 w-4 text-secondary" />
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="py-3 px-3 mt-4 rounded-md bg-muted/50">
                  <Badge variant="outline" className="mb-2 bg-secondary/10 text-secondary border-secondary/20">
                    Featured
                  </Badge>
                  <h4 className="text-sm font-medium mb-1">Personal AI Excellence</h4>
                  <p className="text-xs text-muted-foreground mb-2">Elevate your AI skills and transform how you work</p>
                  <Link 
                    href="/assessment"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button 
                      className="bg-secondary hover:bg-secondary/90 text-white w-full"
                      size="sm"
                    >
                      Start Your AI Journey
                    </Button>
                  </Link>
                </div>
                
                <div className="pt-4 mt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <ThemeToggle />
                    <Button variant="outline" size="sm" onClick={() => setMobileMenuOpen(false)}>
                      Close Menu
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
