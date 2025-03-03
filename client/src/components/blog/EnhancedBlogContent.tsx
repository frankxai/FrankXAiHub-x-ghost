import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import MermaidDiagram from './MermaidDiagram';

interface EnhancedBlogContentProps {
  content: string;
  className?: string;
}

const EnhancedBlogContent: React.FC<EnhancedBlogContentProps> = ({
  content,
  className = '',
}) => {
  const isMermaidChart = (code: string) => {
    return code.trim().startsWith('graph') || 
           code.trim().startsWith('sequenceDiagram') || 
           code.trim().startsWith('classDiagram') || 
           code.trim().startsWith('flowchart') ||
           code.trim().startsWith('erDiagram') ||
           code.trim().startsWith('gantt') ||
           code.trim().startsWith('pie');
  };

  return (
    <div className={cn('prose prose-lg dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');
            
            if (match && match[1] === 'mermaid' || isMermaidChart(code)) {
              return <MermaidDiagram chart={code} className="my-6" />;
            }
            
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className="rounded-lg my-6 text-[14px]"
                showLineNumbers
                {...props}
              >
                {code}
              </SyntaxHighlighter>
            ) : (
              <code className={cn('px-1 py-0.5 rounded-md bg-muted', className)} {...props}>
                {children}
              </code>
            );
          },
          img({ node, ...props }: any) {
            return (
              <img
                {...props}
                alt={props.alt || 'Blog image'}
                className="rounded-lg shadow-md my-6 mx-auto max-h-[500px] w-auto"
              />
            );
          },
          blockquote({ node, ...props }: any) {
            return (
              <blockquote className="border-l-4 border-primary/70 pl-4 italic my-6" {...props} />
            );
          },
          a({ node, ...props }: any) {
            return (
              <a
                {...props}
                className="text-primary hover:text-primary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              />
            );
          },
          h1({ node, ...props }: any) {
            return <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4" {...props} />;
          },
          h2({ node, ...props }: any) {
            return <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4" {...props} />;
          },
          h3({ node, ...props }: any) {
            return <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-3" {...props} />;
          },
          p({ node, ...props }: any) {
            return <p className="my-4 leading-relaxed" {...props} />;
          },
          ul({ node, ...props }: any) {
            return <ul className="my-4 list-disc pl-6" {...props} />;
          },
          ol({ node, ...props }: any) {
            return <ol className="my-4 list-decimal pl-6" {...props} />;
          },
          table({ node, ...props }: any) {
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-border" {...props} />
              </div>
            );
          },
          th({ node, ...props }: any) {
            return <th className="px-4 py-3 bg-muted font-medium" {...props} />;
          },
          td({ node, ...props }: any) {
            return <td className="px-4 py-3 border-t border-border" {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default EnhancedBlogContent;