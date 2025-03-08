import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className,
  fullWidth = false
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={cn(
        "flex-1 pt-16", // Account for fixed header
        !fullWidth && "container mx-auto px-4 md:px-6",
        className
      )}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;