import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram = ({ chart, className = '' }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      try {
        // Clear existing content to prevent duplicates
        containerRef.current.innerHTML = '';
        
        // Create unique ID to prevent mermaid rendering issues
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        containerRef.current.id = id;
        
        // Render the mermaid diagram
        mermaid.render(id, chart).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500 bg-red-50 p-4 rounded-md">
            <p class="font-medium">Error rendering diagram</p>
            <pre class="text-sm mt-2 overflow-auto">${chart}</pre>
          </div>`;
        }
      }
    }
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className={`my-8 overflow-auto rounded-lg dark:bg-black/20 bg-gray-50 p-4 ${className}`}
    />
  );
};

export default MermaidDiagram;