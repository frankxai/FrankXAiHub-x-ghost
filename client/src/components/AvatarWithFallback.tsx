
import React, { useState, useEffect } from 'react';

interface AvatarWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  retryCount?: number;
}

const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({ 
  src, 
  fallbackSrc, 
  alt, 
  className = 'w-10 h-10 rounded-full',
  retryCount = 0
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  
  useEffect(() => {
    setImgSrc(src);
    setLoadFailed(false);
    setAttempts(0);
  }, [src]);

  const handleError = () => {
    // Only console log once
    if (!loadFailed) {
      console.log("Avatar load failed, using fallback");
      setLoadFailed(true);
    }
    
    // If we still have retries left, try again with a slight delay
    if (attempts < retryCount && imgSrc !== fallbackSrc) {
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        // Add cache buster to URL
        const cacheBuster = `?t=${Date.now()}`;
        setImgSrc(`${src}${cacheBuster}`);
      }, 300);
    } else if (imgSrc !== fallbackSrc) {
      // If all retries fail or no retries requested, use fallback
      setImgSrc(fallbackSrc);
    }
  };

  // Pre-load the fallback image to ensure it's available if needed
  useEffect(() => {
    const img = new Image();
    img.src = fallbackSrc;
  }, [fallbackSrc]);

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default AvatarWithFallback;
