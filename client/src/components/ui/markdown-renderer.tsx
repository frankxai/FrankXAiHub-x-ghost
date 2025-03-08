import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        code: ({ className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter
              // @ts-ignore - Type issue with style property
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Add styling for other markdown elements
        h1: ({ children }: any) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-xl font-bold my-3">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-lg font-bold my-2">{children}</h3>,
        p: ({ children }: any) => <p className="my-2">{children}</p>,
        ul: ({ children }: any) => <ul className="list-disc ml-6 my-2">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal ml-6 my-2">{children}</ol>,
        li: ({ children }: any) => <li className="my-1">{children}</li>,
        a: ({ href, children }: any) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary underline hover:text-primary/80"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }: any) => (
          <blockquote className="border-l-4 border-muted pl-4 italic my-2">
            {children}
          </blockquote>
        ),
        img: ({ src, alt }: any) => (
          <img 
            src={src} 
            alt={alt || 'Image'} 
            className="max-w-full my-2 rounded-md"
          />
        ),
        table: ({ children }: any) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }: any) => <thead className="bg-muted/50">{children}</thead>,
        th: ({ children }: any) => (
          <th className="py-2 px-4 border border-border text-left">
            {children}
          </th>
        ),
        td: ({ children }: any) => (
          <td className="py-2 px-4 border border-border">
            {children}
          </td>
        ),
        hr: () => <hr className="my-4 border-t border-border" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;