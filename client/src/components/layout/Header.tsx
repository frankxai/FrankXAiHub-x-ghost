import { useState } from "react";
import { Link, useLocation } from "wouter";
import { NAV_LINKS } from "@/lib/constants";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-sm z-50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex flex-col">
                <motion.span 
                  className="text-2xl font-clash font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-[#00C2FF]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  FrankX.AI
                </motion.span>
                <span className="text-xs text-muted-foreground">AI that's frankly good™</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`text-primary hover:text-secondary transition-colors duration-300 ${
                  isActive(link.path) ? "font-medium text-secondary" : ""
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/assessment">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">
                Get Frank Advice
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
          
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-2xl font-clash bg-clip-text text-transparent bg-gradient-to-r from-foreground to-[#00C2FF]">
                  FrankX.AI
                </SheetTitle>
                <SheetDescription>
                  AI that's frankly good™
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col space-y-3">
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={`px-3 py-2 rounded-md text-base font-medium hover:bg-accent ${
                      isActive(link.path) ? "bg-accent text-secondary" : "text-primary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                ))}
                <Link 
                  href="/assessment"
                  className="px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Frank Advice
                </Link>
                <div className="px-3 py-2">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
