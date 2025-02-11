"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  reaction?: "thumbsUp" | "thumbsDown" | null;
  feedback?: string;
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
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
  }, [messagesEndRef.current]); // Updated dependency

  return (
    <div className="space-y-4 overflow-x-hidden">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } items-start`}
          >
            <motion.div
              className={`p-3 rounded-xl ${
                msg.sender === "user"
                  ? "max-w-[75%] md:max-w-[60%] bg-white text-black self-end"
                  : "max-w-[85%] md:max-w-[75%] bg-black/50 backdrop-blur-sm border border-white/10 text-white self-start"
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
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start items-start pl-4"
        >
          <motion.div
            className="p-4 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-white/90"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            <motion.div className="flex items-center gap-3">
              <span className="text-sm font-medium">Generating</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/80"
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/5"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
