"use client";

import React, { useEffect, useRef } from "react";

// Import toast library
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  reaction?: "thumbsUp" | "thumbsDown" | null;
  feedback?: string;
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  responseID: string;
}
interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-4 overflow-x-hidden">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          } items-start`}
        >
          {/* AI Avatar */}
          {/* {msg.sender === "ai" && (
              <div className="w-10 h-10 rounded-full border-black border-dotted flex items-center justify-center mr-2">
                <Image
                  src="/assets/logo/blockchain.png"
                  alt="Logo"
                  width={100}
                  height={50}
                  className="invert"
                />
              </div>
            )} */}

          {/* Message Content */}
          <div
            className={`p-3 rounded-xl max-w-[60%] ${
              msg.sender === "user"
                ? "bg-white text-black self-end animate-slide-in"
                : "text-white self-start border border-gray-300 animate-fade-text "
            } break-words`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }: CodeProps) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  } else if (match) {
                    return (
                      <SyntaxHighlighter
                        style={docco}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.text}
            </ReactMarkdown>
            {/* Reaction Buttons */}
          </div>
        </div>
      ))}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-start items-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}

      {/* Auto-scroll target */}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessageList;
