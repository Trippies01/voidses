"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  content: string;
  deleted?: boolean;
  currentMemberName?: string;
}

export const MessageContent = ({
  content,
  deleted = false,
  currentMemberName = "",
}: MessageContentProps) => {
  if (deleted) {
    return (
      <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
        Bu mesaj silindi
      </p>
    );
  }

  // Process mentions before markdown
  const processedContent = content.replace(/@(\w+)/g, (match, username) => {
    const isMentioningMe = 
      username.toLowerCase() === currentMemberName.toLowerCase() ||
      username === "everyone" ||
      username === "here";
    
    return `<span class="${isMentioningMe ? 'mention mention-me' : 'mention'}">${match}</span>`;
  });

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-2"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
          // Links
          a({ node, children, href, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Blockquotes
          blockquote({ node, children, ...props }) {
            return (
              <blockquote className="quote" {...props}>
                {children}
              </blockquote>
            );
          },
          // Bold
          strong({ node, children, ...props }) {
            return <strong className="font-bold" {...props}>{children}</strong>;
          },
          // Italic
          em({ node, children, ...props }) {
            return <em className="italic" {...props}>{children}</em>;
          },
          // Strikethrough
          del({ node, children, ...props }) {
            return <del className="line-through" {...props}>{children}</del>;
          },
          // Paragraphs
          p({ node, children, ...props }) {
            return <p className="mb-2 last:mb-0" {...props}>{children}</p>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-content {
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .inline-code {
          background: rgba(79, 84, 92, 0.3);
          border-radius: 3px;
          padding: 0.2em 0.4em;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 85%;
        }

        .link {
          color: #00aff4;
          text-decoration: underline;
          cursor: pointer;
        }

        .link:hover {
          text-decoration: none;
        }

        .quote {
          border-left: 4px solid #4e5058;
          padding-left: 1em;
          margin: 0.5em 0;
          color: #b9bbbe;
        }

        .mention {
          background: rgba(88, 101, 242, 0.15);
          color: #dee0fc;
          padding: 0 2px;
          border-radius: 3px;
          font-weight: 500;
        }

        .mention-me {
          background: rgba(250, 166, 26, 0.3);
          color: #faa61a;
        }

        .markdown-content pre {
          margin: 0.5em 0;
          border-radius: 4px;
          overflow-x: auto;
        }

        .markdown-content ul,
        .markdown-content ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }

        .markdown-content li {
          margin: 0.25em 0;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3 {
          margin: 0.5em 0 0.25em 0;
          font-weight: 600;
        }

        .markdown-content h1 { font-size: 1.5em; }
        .markdown-content h2 { font-size: 1.3em; }
        .markdown-content h3 { font-size: 1.1em; }

        .markdown-content table {
          border-collapse: collapse;
          margin: 0.5em 0;
        }

        .markdown-content th,
        .markdown-content td {
          border: 1px solid #4e5058;
          padding: 0.5em;
        }

        .markdown-content th {
          background: rgba(79, 84, 92, 0.3);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};


