"use client";

import React, { useEffect, useRef } from "react";

import Image from "next/image";
import { TooltipProvider } from "@/components/ui/tooltip";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
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
    <TooltipProvider>
      <div className="space-y-4 overflow-x-hidden">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } items-start`}
          >
            {/* AI Avatar */}
            {msg.sender === "ai" && (
              <div className="w-10 h-10 rounded-full border-black border-dotted flex items-center justify-center mr-2">
                <Image
                  src="/assets/logo/blockchain.png"
                  alt="Logo"
                  width={100}
                  height={50}
                  className="invert"
                />
              </div>
            )}

            {/* Message Content */}
            <div
              className={`p-4 rounded-xl max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-black text-white self-end border border-black animate-slide-in shadow-[0_2px_8px_rgba(0,0,0,0.08)] [&_*]:text-white [&_p]:text-white [&_strong]:text-white"
                  : "text-black self-start border border-gray-100/50 animate-fade-text shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              } break-words`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }: CodeProps) {
                    const match = /language-(\w+)/.exec(className || "");
                    if (inline) {
                      return (
                        <code
                          className="px-1 py-0.5 rounded-md bg-gray-100 text-gray-800 font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    } else if (match) {
                      return (
                        <SyntaxHighlighter
                          style={docco}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md my-4"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    }
                    return (
                      <code
                        className="block p-4 rounded-md bg-gray-100 font-mono text-sm overflow-x-auto my-4"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => (
                    <p className="mb-4 last:mb-0 leading-7 text-[15.5px] text-gray-800 font-normal">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-[28px] font-semibold mb-6 mt-6 text-gray-900 tracking-tight leading-tight">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-[22px] font-semibold mb-4 mt-6 text-gray-800 tracking-tight leading-tight">
                      {children}
                    </h2>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-800">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-3 text-gray-800">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1 text-[15.5px] leading-relaxed pl-2">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-200 pl-4 my-4 text-gray-700 italic font-normal">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading Spinner */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-center space-x-4"
          >
            <motion.div
              className="flex items-center bg-white shadow-sm border border-gray-100 rounded-full px-5 py-2.5"
              animate={{
                scale: [1, 1.01, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <motion.span
                className="text-black font-medium text-sm"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Thinking
              </motion.span>
              <div className="inline-flex ml-2">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 bg-black rounded-full mx-0.5"
                    animate={{
                      y: ["0%", "-35%", "0%"],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Auto-scroll target */}
        <div ref={messagesEndRef}></div>
      </div>
    </TooltipProvider>
  );
};

export default MessageList;
