
import React, { useState, useEffect } from 'react';

interface AvatarWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}

const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({ 
  src, 
  fallbackSrc, 
  alt, 
  className = 'w-10 h-10 rounded-full'
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  
  useEffect(() => {
    // Pre-load the image to check if it exists
    const img = new Image();
    
    img.onload = () => {
      setImgSrc(src);
      setImgLoaded(true);
    };
    
    img.onerror = () => {
      console.log("Avatar pre-load failed, using fallback");
      setImgSrc(fallbackSrc);
      setImgLoaded(true);
    };
    
    img.src = src;
    
    // If we already have a valid fallback, use it immediately while checking the primary
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);
  
  const handleError = () => {
    console.log("Avatar runtime error, using fallback");
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  if (!imgLoaded && !imgSrc) {
    // Return a placeholder while loading
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
        <span className="text-gray-400 dark:text-gray-500 text-xs">...</span>
      </div>
    );
  }

  return (
    <img 
      src={imgSrc || fallbackSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
    />
  );
};

export default AvatarWithFallback;
