"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useChatSession } from "@/hooks/useChatSession";

const WELCOME_MESSAGE = `# Welcome to Creatigen Assistant\n\nI'm here to help with your creative projects and answer any questions you might have. How can I assist you today?`;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    clearMessages,
  } = useChatSession({
    persistKey: "floating_chat",
    initialMessages: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholders = [
    "Ask me anything...",
    "How can I help you today?",
    "What would you like to know?",
    "Type your message here...",
  ];

  const [placeholder, setPlaceholder] = useState(placeholders[0]);

  // Cycle through placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(
        placeholders[Math.floor(Math.random() * placeholders.length)]
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  // Initialize with welcome message if no messages
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      clearMessages(WELCOME_MESSAGE);
    }
  }, [isOpen, messages.length, clearMessages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Render markdown content
  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2 last:mb-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-2 last:mb-0">{children}</h2>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
          code: ({
            className,
            children,
            ...props
          }: React.HTMLProps<HTMLElement>) => {
            const isInline = !className;
            return (
              <code
                className={`${
                  isInline
                    ? "bg-black/20 rounded px-1"
                    : "block bg-black/20 p-2 rounded"
                } ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({
            children,
            ...props
          }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <a
              {...props}
              className="text-[#C1FF00] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // Clear chat history with welcome message
  const handleClearChat = () => {
    clearMessages(WELCOME_MESSAGE);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-[#2c7a7b] to-[#46919f] hover:from-[#246b6c] hover:to-[#377b87] transition-all duration-300 flex items-center justify-center z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat container */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 350,
                duration: 0.3,
              }}
              className="fixed bottom-[4.5rem] right-4 w-[90vw] max-w-[400px] h-[600px] bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] shadow-2xl flex flex-col z-50 overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-[#1A1A1A] bg-gradient-to-r from-[#0A0A0A] to-[#111111] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#d8f3dc] to-[#83c5be] flex items-center justify-center shadow-md">
                    <Brain className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">
                      Creatigen Assistant
                    </h3>
                    <p className="text-xs text-gray-400">
                      AI-powered assistant
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearChat}
                    className="h-8 w-8 rounded-full hover:bg-[#1A1A1A] text-gray-400 hover:text-white transition-colors duration-200"
                    title="Clear chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#333333] scrollbar-track-transparent bg-[#0A0A0A] bg-opacity-90">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-[#777777] gap-2">
                    <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
                    <h3 className="text-lg font-medium text-[#AAAAAA]">
                      How can I help you today?
                    </h3>
                    <p className="text-sm max-w-xs">
                      I&apos;m your creative assistant. Ask me anything about
                      your projects, ideas, or content.
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={cn(
                          "max-w-[85%] rounded-2xl p-4 shadow-sm",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-[#2c7a7b] to-[#2c7a7b] text-white shadow-[0_2px_10px_rgba(44,122,123,0.15)]"
                            : "bg-[#121212] text-white border border-[#1A1A1A] shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                        )}
                      >
                        <div className="prose prose-invert max-w-none text-sm">
                          {message.sender === "ai" ||
                          message.sender === "bot" ? (
                            renderMarkdown(message.text)
                          ) : (
                            <p>{message.text}</p>
                          )}
                        </div>
                        <div
                          className={cn(
                            "text-xs mt-2 flex items-center gap-1",
                            "text-white/60"
                          )}
                        >
                          {(message.sender === "ai" ||
                            message.sender === "bot") && (
                            <span className="flex items-center gap-1">
                              <Brain className="h-3 w-3" /> AI
                            </span>
                          )}
                          <span>{formatTime(message.timestamp)}</span>
                        </div>
                      </motion.div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        transition: {
                          repeat: Infinity,
                          duration: 2,
                        },
                      }}
                      className="bg-[#121212] border border-[#1A1A1A] text-white max-w-[85%] rounded-2xl p-4 flex items-center shadow-sm"
                    >
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                          <Brain className="h-4 w-4 text-[#d8f3dc]" />
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-[#2c7a7b] border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                      <div className="ml-3">
                        <span className="text-sm text-gray-300">Thinking</span>
                        <motion.div
                          className="flex gap-1 mt-1"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut",
                          }}
                        >
                          <span className="h-1 w-1 rounded-full bg-[#2c7a7b]"></span>
                          <span className="h-1 w-1 rounded-full bg-[#2c7a7b]"></span>
                          <span className="h-1 w-1 rounded-full bg-[#2c7a7b]"></span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-[#1A1A1A] bg-gradient-to-r from-[#0A0A0A] to-[#111111]">
                <motion.div
                  className="flex items-center bg-[#121212] rounded-full overflow-hidden px-4 py-3 border border-[#1A1A1A] shadow-inner transition-all duration-200"
                  whileFocus={{ borderColor: "#2c7a7b" }}
                  animate={{
                    boxShadow: isLoading
                      ? "0 0 0 1px rgba(44,122,123,0.3)"
                      : "none",
                    borderColor: isLoading ? "#2c7a7b" : "#1A1A1A",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={() => sendMessage(inputValue)}
                    disabled={isLoading || !inputValue.trim()}
                    className={cn(
                      "p-2 rounded-full transition-all duration-200 flex items-center justify-center",
                      isLoading || !inputValue.trim()
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-[#2c7a7b] hover:bg-[#1A1A1A] hover:text-[#d8f3dc]"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </motion.div>
                <div className="text-xs text-center mt-2 text-gray-500">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
