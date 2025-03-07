"use client";

import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatSession } from "@/hooks/useChatSession";
import ReactMarkdown from "react-markdown";

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

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "rounded-lg p-4 text-white",
              message.sender === "user"
                ? "bg-[#1A1A1A] border border-[#2A2A2A] mr-12"
                : "bg-[#111] border border-[#2A2A2A] ml-0 mr-0"
            )}
          >
            {message.sender === "ai" || message.sender === "bot" ? (
              <ReactMarkdown
                className="prose prose-invert max-w-none prose-p:my-1 prose-headings:mb-2"
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 text-[15px]">{children}</p>
                  ),
                  a: ({ children, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-2">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    return (
                      <code
                        className={`${
                          isInline
                            ? "bg-black/30 px-1 py-0.5 rounded"
                            : "block bg-black/30 p-2 rounded overflow-auto"
                        } ${className || ""}`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              <p className="text-[15px]">{message.text}</p>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-white bg-[#111] border border-[#2A2A2A] p-4 rounded-lg max-w-full">
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
            <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Describe what you want to discuss..."
          className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg py-3 px-4 pr-12 text-white focus:outline-none focus:border-gray-600 placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          onClick={() => sendMessage(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full",
            !inputValue.trim() || isLoading
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 text-white"
          )}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
