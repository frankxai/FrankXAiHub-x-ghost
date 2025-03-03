import React from 'react';
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
  // For this simplified version, we'll manually parse markdown-like content
  // In a production app, we'd use a proper markdown parser
  
  // Process the content to detect code blocks and mermaid diagrams
  const processContent = () => {
    const lines = content.split('\n');
    let html = '';
    let inCodeBlock = false;
    let codeContent = '';
    let language = '';
    
    lines.forEach((line, index) => {
      // Detect code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          language = line.slice(3).trim();
          return;
        } else {
          inCodeBlock = false;
          
          // Check if it's a mermaid diagram
          if (language === 'mermaid' || 
              codeContent.trim().startsWith('graph') || 
              codeContent.trim().startsWith('sequenceDiagram') || 
              codeContent.trim().startsWith('classDiagram') || 
              codeContent.trim().startsWith('flowchart') ||
              codeContent.trim().startsWith('erDiagram')) {
            html += `<div class="mermaid-diagram">${codeContent}</div>`;
          } else {
            html += `<pre class="code-block ${language}"><code>${codeContent}</code></pre>`;
          }
          codeContent = '';
          return;
        }
      }
      
      // Inside code block
      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }
      
      // Headers
      if (line.startsWith('# ')) {
        html += `<h1>${line.slice(2)}</h1>`;
      } else if (line.startsWith('## ')) {
        html += `<h2>${line.slice(3)}</h2>`;
      } else if (line.startsWith('### ')) {
        html += `<h3>${line.slice(4)}</h3>`;
      } else if (line.startsWith('#### ')) {
        html += `<h4>${line.slice(5)}</h4>`;
      } else if (line.startsWith('##### ')) {
        html += `<h5>${line.slice(6)}</h5>`;
      } else if (line.startsWith('###### ')) {
        html += `<h6>${line.slice(7)}</h6>`;
      }
      // Bold, italic, links, and other formatting would be processed here
      // For simplicity, we'll just handle empty lines and paragraphs
      else if (line.trim() === '') {
        html += '<br/>';
      } else {
        html += `<p>${line}</p>`;
      }
    });
    
    return html;
  };
  
  // Render the processed content
  return (
    <div 
      className={cn('prose prose-lg dark:prose-invert max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: processContent() }}
    />
  );
};

export default EnhancedBlogContent;