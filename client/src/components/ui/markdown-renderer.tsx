import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          return !props.inline && match ? (
            <SyntaxHighlighter
              // @ts-ignore - type definition issue with react-syntax-highlighter
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
        h1: (props: any) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
        h2: (props: any) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
        h3: (props: any) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
        p: (props: any) => <p className="mb-4" {...props} />,
        ul: (props: any) => <ul className="list-disc pl-6 mb-4" {...props} />,
        ol: (props: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
        li: (props: any) => <li className="mb-1" {...props} />,
        a: (props: any) => (
          <a className="text-blue-500 hover:underline" target="_blank" {...props} />
        ),
        blockquote: (props: any) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
        ),
        img: (props: any) => (
          <img className="max-w-full h-auto my-4 rounded" {...props} />
        ),
        table: (props: any) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-300" {...props} />
          </div>
        ),
        thead: (props: any) => <thead className="bg-gray-100" {...props} />,
        th: (props: any) => (
          <th className="px-4 py-2 text-left font-semibold" {...props} />
        ),
        td: (props: any) => <td className="px-4 py-2 border-t" {...props} />,
        hr: (props: any) => <hr className="my-6" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;