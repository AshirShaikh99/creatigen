\"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { 
  MessageSquare, 
  Send, 
  X, 
  ChevronLeft, 
  Loader2,
  Brain,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface SidebarChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function SidebarChatbot({ isOpen, onClose, title = "AI Assistant" }: SidebarChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionId] = useState<string>(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const placeholders = [
    "Ask me anything...",
    "How can I help you today?",
    "What would you like to know?",
    "Type your message here..."
  ];

  const [placeholder, setPlaceholder] = useState(placeholders[0]);

  // Cycle through placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
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

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          text: `# Welcome to Creatigen Assistant\n\nI'm here to help with your creative projects and answer any questions you might have. How can I assist you today?`,
          sender: "ai",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": sessionId
        },
        body: JSON.stringify({
          message: userMessage.text,
          session_id: sessionId,
          deep_research: false,
          system: "Please format your responses using markdown for better readability. Use headers, lists, and code blocks where appropriate."
        })
      });
      
      const data = await response.json();
      
      const botMessage: Message = {
        id: uuidv4(),
        text: data.message || "Sorry, I couldn't process your request.",
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render markdown content
  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 last:mb-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 last:mb-0">{children}</h2>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
          code: ({ node, inline, className, children, ...props }) => (
            <code
              className={`${
                inline
                  ? "bg-black/20 rounded px-1"
                  : "block bg-black/20 p-2 rounded"
              } ${className}`}
              {...props}
            >
              {children}
            </code>
          ),
          a: ({ node, ...props }) => (
            <a 
              {...props} 
              className="text-[#C1FF00] hover:underline" 
              target="_blank" 
              rel="noopener noreferrer" 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([{
      id: uuidv4(),
      text: `# Welcome to Creatigen Assistant\n\nI'm here to help with your creative projects and answer any questions you might have. How can I assist you today?`,
      sender: "ai",
      timestamp: new Date()
    }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Chatbot sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 h-full z-50 shadow-xl flex flex-col",
              isExpanded ? "w-full md:w-[600px]" : "w-[350px] md:w-[400px]",
              "bg-[#0A0A0A] border-l border-[#1A1A1A]"
            )}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#d8f3dc] to-[#83c5be] flex items-center justify-center">
                  <Brain className="h-4 w-4 text-black" />
                </div>
                <h3 className="font-medium text-white">{title}</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 rounded-full hover:bg-[#1A1A1A] text-gray-400 hover:text-white"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="h-8 w-8 rounded-full hover:bg-[#1A1A1A] text-gray-400 hover:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full hover:bg-[#1A1A1A] text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#333333] scrollbar-track-transparent">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "max-w-[85%] rounded-2xl p-4",
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[#d8f3dc] to-[#83c5be] text-black"
                        : "bg-[#121212] text-white border border-[#1A1A1A]"
                    )}
                  >
                    <div className="prose prose-invert max-w-none text-sm">
                      {message.sender === "ai" ? (
                        renderMarkdown(message.text)
                      ) : (
                        <p>{message.text}</p>
                      )}
                    </div>
                    <div
                      className={cn(
                        "text-xs mt-2",
                        message.sender === "user" ? "text-black/60" : "text-white/60"
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </motion.div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#121212] border border-[#1A1A1A] text-white max-w-[85%] rounded-2xl p-4 flex items-center"
                  >
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                        <Brain className="h-4 w-4 text-[#d8f3dc]" />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#d8f3dc] border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <span className="ml-3 text-sm text-gray-300">Thinking...</span>
                  </motion.div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-[#1A1A1A] bg-[#0A0A0A]">
              <div className="flex items-center bg-[#121212] rounded-full overflow-hidden px-4 py-2 border border-[#1A1A1A] focus-within:border-[#d8f3dc]/50 transition-colors duration-200">
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
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className={