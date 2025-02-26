import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with preferred configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
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
        mermaid.contentLoaded();
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    }
  }, [chart]);

  return (
    <div 
      className={`mermaid-diagram ${className} p-6 bg-gray-50 dark:bg-gray-800 rounded-xl my-8 overflow-auto`}
      ref={containerRef}
    >
      <div className="mermaid">{chart}</div>
    </div>
  );
};

export default MermaidDiagram;