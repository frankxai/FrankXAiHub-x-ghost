import React from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/hooks/use-theme';

// Use a simpler approach to avoid TypeScript issues
const MarkdownRenderer: React.FC<{ content: string; className?: string }> = ({ 
  content, 
  className 
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Basic processing to handle markdown-like syntax
  const processContent = (text: string) => {
    // Process code blocks (```code```)
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    const withCodeBlocks = text.replace(codeBlockRegex, (_, lang, code) => {
      return `<div class="code-block" data-language="${lang || 'text'}">${code}</div>`;
    });

    // Process inline code (`code`)
    const inlineCodeRegex = /`([^`]+)`/g;
    const withInlineCode = withCodeBlocks.replace(inlineCodeRegex, (_, code) => {
      return `<code class="inline-code">${code}</code>`;
    });

    // Process bold (**text**)
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const withBold = withInlineCode.replace(boldRegex, (_, text) => {
      return `<strong>${text}</strong>`;
    });

    // Process italics (*text*)
    const italicRegex = /\*([^*]+)\*/g;
    const withItalic = withBold.replace(italicRegex, (_, text) => {
      return `<em>${text}</em>`;
    });

    // Process links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const withLinks = withItalic.replace(linkRegex, (_, text, url) => {
      return `<a href="${url}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });

    // Process headers
    const headerRegex = /^(#{1,6})\s+(.+)$/gm;
    const withHeaders = withLinks.replace(headerRegex, (_, level, text) => {
      const headerLevel = level.length;
      const className = `text-${headerLevel === 1 ? '2xl' : headerLevel === 2 ? 'xl' : 'lg'} font-bold my-2`;
      return `<h${headerLevel} class="${className}">${text}</h${headerLevel}>`;
    });

    // Process lists
    const ulRegex = /^\s*-\s+(.+)$/gm;
    const withUl = withHeaders.replace(ulRegex, (_, text) => {
      return `<li class="ml-6 list-disc">${text}</li>`;
    });

    // Process paragraphs (simple approach)
    const paragraphs = withUl.split(/\n\n+/).map(p => {
      // Skip if it's already a header, code block, etc.
      if (p.startsWith('<h') || p.startsWith('<div class="code-block"') || p.trim() === '') {
        return p;
      }
      
      // Skip if it's a list item (already processed)
      if (p.startsWith('<li')) {
        return `<ul>${p}</ul>`;
      }
      
      return `<p>${p}</p>`;
    }).join('\n\n');

    return paragraphs;
  };

  return (
    <div className={cn('markdown-renderer prose prose-sm max-w-none', 
      isDarkTheme ? 'prose-invert' : 'prose-stone', 
      className
    )}>
      <div 
        className="whitespace-pre-wrap" 
        dangerouslySetInnerHTML={{ __html: processContent(content) }} 
      />
    </div>
  );
};

export default MarkdownRenderer;