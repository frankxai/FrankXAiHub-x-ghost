import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { NAV_LINKS, COMPANY_INFO } from "@/lib/constants";
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
import { Menu, Search, ChevronRight, Brain, BrainCircuit } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, type: "spring", stiffness: 400 }
    }
  };
  
  const navItemVariants = {
    hover: { 
      scale: 1.05, 
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 6px 15px rgba(0, 166, 224, 0.3)",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/90 backdrop-blur-md shadow-sm" 
          : "bg-background/50 backdrop-blur-sm"
      } border-b border-border/80`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="enterprise-container">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <motion.div 
              className="flex items-center gap-2"
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={logoVariants}
            >
              <BrainCircuit className="w-8 h-8 text-secondary" />
              <div className="flex flex-col">
                <span className="text-2xl font-clash font-bold gradient-text">
                  {COMPANY_INFO.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {COMPANY_INFO.tagline}
                </span>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <AnimatePresence>
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05, 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                >
                  <motion.div
                    whileHover="hover"
                    variants={navItemVariants}
                  >
                    <Link 
                      href={link.path}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 relative ${
                        isActive(link.path) 
                          ? "text-secondary" 
                          : "text-foreground hover:text-secondary"
                      }`}
                    >
                      {link.title}
                      {isActive(link.path) && (
                        <motion.span
                          className="absolute bottom-1 left-0 right-0 mx-auto w-1.5 h-1.5 bg-secondary rounded-full"
                          layoutId="navIndicator"
                          transition={{ duration: 0.5, type: "spring" }}
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
                <Button className="bg-secondary hover:bg-secondary/90 text-white h-10 gap-1 group shadow-lg shadow-secondary/20">
                  AI Readiness Assessment
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="rounded-full">
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
                  <BrainCircuit className="w-6 h-6 text-secondary" />
                  <span className="text-2xl font-clash gradient-text">
                    {COMPANY_INFO.name}
                  </span>
                </SheetTitle>
                <SheetDescription>
                  {COMPANY_INFO.tagline}
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
                          ? "bg-secondary/20 text-secondary" 
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
                <div className="pt-4 mt-2 border-t border-border">
                  <Link 
                    href="/assessment"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button 
                      className="bg-secondary hover:bg-secondary/90 text-white w-full mb-4"
                    >
                      AI Readiness Assessment
                    </Button>
                  </Link>
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
