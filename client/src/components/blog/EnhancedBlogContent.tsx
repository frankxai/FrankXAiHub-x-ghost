import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import MermaidDiagram from './MermaidDiagram';

interface CodeBlockProps {
  language: string;
  value: string;
}

interface EnhancedBlogContentProps {
  content: string;
  className?: string;
}

// Custom renderer for code blocks that can handle mermaid diagrams
const CodeBlock = ({ language, value }: CodeBlockProps) => {
  if (language === 'mermaid') {
    return <MermaidDiagram chart={value} />;
  }

  return (
    <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
      <code className={`language-${language || 'text'}`}>{value}</code>
    </pre>
  );
};

const EnhancedBlogContent = ({ content, className = '' }: EnhancedBlogContentProps) => {
  // Custom components for markdown rendering
  const components = {
    h1: ({ node, ...props }: any) => (
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-clash font-bold mt-10 mb-4" 
        {...props} 
      />
    ),
    h2: ({ node, ...props }: any) => (
      <motion.h2 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl md:text-3xl font-clash font-bold mt-8 mb-4" 
        {...props} 
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-xl md:text-2xl font-clash font-bold mt-6 mb-3" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="my-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-6 my-4" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-6 my-4" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="mt-2 text-lg text-gray-800 dark:text-gray-200" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-secondary pl-4 italic my-6" {...props} />
    ),
    a: ({ href, children }: any) => {
      // If internal link, use Wouter Link
      if (href && href.startsWith('/')) {
        return <Link href={href} className="text-secondary hover:underline">{children}</Link>;
      }
      // External link
      return <a href={href} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">{children}</a>;
    },
    img: ({ src, alt, ...props }: any) => (
      <div className="my-8">
        <img 
          src={src} 
          alt={alt || 'Blog image'} 
          className="rounded-xl shadow-md w-full h-auto" 
          {...props}
        />
        {alt && <p className="text-center text-sm text-gray-500 mt-2 italic">{alt}</p>}
      </div>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      
      if (inline) {
        return <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-secondary" {...props}>{children}</code>;
      }
      
      return (
        <CodeBlock
          language={match ? match[1] : ''}
          value={String(children).replace(/\n$/, '')}
        />
      );
    },
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700" {...props} />
      </div>
    ),
    th: ({ node, ...props }: any) => (
      <th className="border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left" {...props} />
    ),
    td: ({ node, ...props }: any) => (
      <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" {...props} />
    ),
    hr: ({ node, ...props }: any) => (
      <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
    ),
  };

  return (
    <div className={`enhanced-blog-content ${className}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
};

export default EnhancedBlogContent;