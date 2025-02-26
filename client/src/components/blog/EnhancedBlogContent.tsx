import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import MermaidDiagram from './MermaidDiagram';
import { useTheme } from '@/hooks/use-theme';

interface EnhancedBlogContentProps {
  content: string;
  className?: string;
}

const EnhancedBlogContent: React.FC<EnhancedBlogContentProps> = ({ 
  content, 
  className = '' 
}) => {
  const { theme } = useTheme();
  
  // Process and convert mermaid code blocks to MermaidDiagram components
  const processedContent = React.useMemo(() => {
    let contentWithMermaid = content;
    const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
    
    let match;
    let index = 0;
    const placeholders: Record<string, string> = {};
    
    while ((match = mermaidRegex.exec(content)) !== null) {
      const placeholder = `MERMAID_PLACEHOLDER_${index++}`;
      placeholders[placeholder] = match[1];
      contentWithMermaid = contentWithMermaid.replace(match[0], placeholder);
    }
    
    return { contentWithMermaid, placeholders };
  }, [content]);

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          code(props) {
            const { className, children, ...rest } = props;
            const value = String(children).replace(/\n$/, '');
            
            // Check if this is a mermaid placeholder
            if (Object.keys(processedContent.placeholders).includes(value)) {
              return <MermaidDiagram chart={processedContent.placeholders[value]} />;
            }
            
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !(rest.node?.tagName === 'pre');
            
            return !isInline && match ? (
              <SyntaxHighlighter
                style={coldarkDark as any}
                language={match[1]}
                PreTag="div"
                className="rounded-md !bg-zinc-900 dark:!bg-black my-8"
                customStyle={{
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                }}
              >
                {value}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`${className} rounded px-1 py-0.5 bg-gray-100 dark:bg-gray-800`}
                {...rest}
              >
                {children}
              </code>
            );
          },
          img(props) {
            return (
              <img 
                className="rounded-lg shadow-md my-8 max-h-[600px] object-cover mx-auto" 
                loading="lazy"
                {...props} 
              />
            );
          },
          blockquote(props) {
            return (
              <blockquote 
                className="border-l-4 border-secondary pl-4 italic my-6 text-gray-700 dark:text-gray-300"
                {...props} 
              />
            );
          },
          a(props) {
            return (
              <a
                className="text-secondary hover:text-secondary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            );
          }
        }}
      >
        {processedContent.contentWithMermaid}
      </ReactMarkdown>
    </div>
  );
};

export default EnhancedBlogContent;