import React from 'react';
import { cn } from '@/lib/utils';

// Create an inline SVG component for the avatar - this way we don't rely on external files
const FrankXSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0072C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9 9h6"/>
    <path d="M9 12h6"/>
    <path d="M9 15h6"/>
  </svg>
);

interface FrankXAIProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusIndicator?: boolean;
  variant?: 'circle' | 'rounded' | 'square';
}

const FrankXAI: React.FC<FrankXAIProps> = ({
  className,
  size = 'md',
  showStatusIndicator = true,
  variant = 'circle'
}) => {
  // Determine size class
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Determine shape class
  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  };

  return (
    <div className={cn(
      'relative overflow-hidden bg-white', 
      sizeClasses[size], 
      shapeClasses[variant],
      className
    )}>
      <FrankXSVG />
      {showStatusIndicator && (
        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-r from-[#005CB2] to-[#00A3FF] animate-pulse shadow-[0_0_5px_rgba(0,163,255,0.5)]"></div>
      )}
    </div>
  );
};

export default FrankXAI;