import React, { useEffect, useRef } from 'react';

interface OpenWebUIProps {
  showOpenWebUI?: boolean;
  fullScreen?: boolean;
  className?: string;
}

/**
 * OpenWebUI Component
 * 
 * This component loads the OpenWebUI interface, either in an iframe
 * or redirects to the /openwebui/ path based on the configuration.
 */
const OpenWebUI: React.FC<OpenWebUIProps> = ({ 
  showOpenWebUI = true, 
  fullScreen = false,
  className = '' 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // If in fullScreen mode, we'll redirect to OpenWebUI directly
    if (fullScreen && showOpenWebUI) {
      window.location.href = '/openwebui/';
    }
  }, [fullScreen, showOpenWebUI]);

  // If not showing OpenWebUI or we've redirected in fullScreen mode, don't render
  if (!showOpenWebUI || (fullScreen && typeof window !== 'undefined')) {
    return null;
  }

  // If we're here, we're showing OpenWebUI in an iframe (non-fullScreen mode)
  return (
    <iframe
      ref={iframeRef}
      src="/openwebui/"
      title="OpenWebUI Chat Interface"
      className={`w-full h-full border-0 ${className}`}
      allow="microphone; camera; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
};

export default OpenWebUI;