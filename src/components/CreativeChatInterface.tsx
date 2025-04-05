"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send, PlusCircle, Sparkles, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatSession } from "@/hooks/useChatSession";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreativeChatInterface() {
  const {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    clearMessages,
  } = useChatSession({
    persistKey: "creative_chat",
    initialMessages: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on first render
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      clearMessages(
        `👋 Welcome to the Creative Chat! I can help you brainstorm ideas and provide creative assistance. What would you like to discuss today?`
      );
    }
  }, [clearMessages, messages.length]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const [isInterfaceLoaded, setIsInterfaceLoaded] = useState(false);

  // Simulate loading state for UI components
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInterfaceLoaded(true);
    }, 300); // Short delay for smooth transition
    return () => clearTimeout(timer);
  }, []);

  // Define markdown components with proper types for ReactMarkdown
  const markdownComponents = {
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-3 text-[15px] leading-relaxed" {...props} />
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        {...props}
        className="text-[#A78BFA] hover:text-[#6366F1] hover:underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
    ),
    li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
      <li className="mb-1 text-[15px]" {...props} />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => {
      const { className, children, ...rest } = props;
      const isInline = !className || !className.includes("language-");
      return (
        <code
          className={`${
            isInline
              ? "bg-[#1A1A1A] px-1.5 py-0.5 rounded text-[#A78BFA] font-mono text-sm"
              : "block bg-[#1A1A1A] p-3 rounded-md overflow-auto font-mono text-sm my-3"
          } ${className || ""}`}
          {...rest}
        >
          {children}
        </code>
      );
    },
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-xl font-semibold mb-3 mt-4 text-white" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-lg font-semibold mb-3 mt-4 text-white" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-md font-semibold mb-2 mt-3 text-white" {...props} />
    ),
    blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="border-l-4 border-[#A78BFA]/30 pl-4 italic my-3 text-gray-300"
        {...props}
      />
    ),
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] bg-background rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <AnimatePresence>
        {isInterfaceLoaded ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-4 border-b border-border"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearMessages(
                  `👋 Welcome to the Creative Chat! I can help you brainstorm ideas and provide creative assistance. What would you like to discuss today?`
                );
                inputRef.current?.focus();
              }}
              className="flex items-center gap-2 bg-secondary border-input text-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              New Chat
            </Button>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Creative AI</span>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Skeleton className="h-9 w-24 bg-secondary" />
            <Skeleton className="h-5 w-28 bg-secondary" />
          </div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto py-4 px-4 md:px-6 space-y-6 custom-scrollbar">
        <AnimatePresence>
          {isInterfaceLoaded ? (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1 > 0.5 ? 0.5 : index * 0.1,
                }}
                className={cn(
                  "rounded-lg p-4 text-foreground",
                  message.sender === "user"
                    ? "bg-secondary border border-input mr-12 ml-0 sm:ml-12"
                    : "bg-gradient-to-br from-card to-background border border-input mr-0 sm:mr-12 shadow-sm"
                )}
              >
                <div className="flex items-start gap-3">
                  {message.sender !== "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    {message.sender === "ai" || message.sender === "bot" ? (
                      <ReactMarkdown
                        className="prose prose-invert max-w-none prose-p:my-1 prose-headings:mb-2"
                        components={markdownComponents}
                      >
                        {message.text}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-[15px] leading-relaxed">
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <>
              <Skeleton className="h-24 w-full bg-secondary rounded-lg" />
              <Skeleton className="h-36 w-full bg-secondary rounded-lg" />
              <Skeleton className="h-20 w-3/4 ml-auto bg-secondary rounded-lg" />
            </>
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-gradient-to-br from-card to-background border border-input p-4 rounded-lg shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex items-center space-x-2 h-6">
              <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse delay-150"></div>
              <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse delay-300"></div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <AnimatePresence>
        {isInterfaceLoaded ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-t border-border"
          >
            <div className="relative max-w-4xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message Creative Chat..."
                className="w-full bg-secondary border border-input rounded-lg py-3 px-4 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className={cn(
                  "absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all",
                  !inputValue.trim() || isLoading
                    ? "opacity-50 cursor-not-allowed text-muted-foreground"
                    : "text-primary hover:text-accent hover:bg-primary/10"
                )}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="p-4 border-t border-border">
            <Skeleton className="h-12 w-full bg-secondary rounded-lg" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
