import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#00C2FF',
        primaryTextColor: '#fff',
        primaryBorderColor: '#00C2FF',
        lineColor: '#999',
        secondaryColor: '#7026E3',
        tertiaryColor: '#f4f4f4'
      },
    });

    const renderChart = async () => {
      if (!chart) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { svg } = await mermaid.render(uniqueId.current, chart.trim());
        setSvg(svg);
        setLoading(false);
      } catch (err) {
        console.error('Mermaid diagram error:', err);
        setError('Failed to render diagram. Please check the syntax.');
        setLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  if (loading) {
    return (
      <Card className={cn("p-4", className)}>
        <Skeleton className="h-40 w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("p-4 border-red-300 bg-red-50 dark:bg-red-900/10", className)}>
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        <pre className="mt-2 text-xs p-2 bg-muted rounded overflow-x-auto">
          {chart}
        </pre>
      </Card>
    );
  }

  return (
    <div 
      className={cn("overflow-auto my-8", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      ref={mermaidRef}
    />
  );
};

export default MermaidDiagram;