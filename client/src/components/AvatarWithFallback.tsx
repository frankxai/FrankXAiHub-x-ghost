
import React, { useState } from 'react';

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
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
    />
  );
};

export default AvatarWithFallback;
