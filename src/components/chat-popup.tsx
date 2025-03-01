"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Send, Brain, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatPopupProps {
  onClose: () => void;
  title: string;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ onClose, title }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "Ask about this repository...",
    "What would you like to know?",
    "How can I help with this knowledge base?",
    "Ask me anything about this repository...",
  ];

  const [placeholder, setPlaceholder] = useState(placeholders[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(
        placeholders[Math.floor(Math.random() * placeholders.length)]
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMessages([
      {
        id: uuidv4(),
        text: `# Welcome to the "${title}" repository chat!\n\nHow can I assist you today? Feel free to ask any questions about this repository.`,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  }, [title]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current && !isMinimized) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    scrollToBottom();

    // Add a small delay to ensure smooth scrolling after new messages
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    inputRef.current?.focus();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/chat",
        {
          message: inputValue,
          session_id: uuidv4(),
          deep_research: false,
          collection_name: title,
          system:
            "Please format your responses using markdown for better readability. Use headers, lists, and code blocks where appropriate.",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "user-id": uuidv4(),
          },
        }
      );

      const aiMessage: Message = {
        id: uuidv4(),
        text: response.data.message,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in API request:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, I'm having trouble connecting to the server.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col max-w-md w-full shadow-xl rounded-xl overflow-hidden bg-black">
      <div className="bg-black border-b border-[#C1FF00]/20 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-[#d8f3dc] p-1.5 rounded-full mr-2">
            <Brain className="h-4 w-4 text-black" />
          </div>
          <h3 className="font-medium text-white">{title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-full hover:bg-[#C1FF00]/10 text-[#d8f3dc]"
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#C1FF00]/10 text-[#d8f3dc]"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isMinimized ? "max-h-0" : "max-h-[600px]"
        }`}
      >
        <div className="flex flex-col h-[600px]">
          <div
            className="flex-1 overflow-y-auto p-4 custom-scrollbar"
            ref={chatContainerRef}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } w-full`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      message.sender === "user"
                        ? "bg-[#d8f3dc] text-black ml-auto"
                        : "bg-[#121212] text-white mr-auto"
                    }`}
                  >
                    <div className="text-sm prose prose-invert max-w-none">
                      {renderMarkdown(message.text)}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-black/60"
                          : "text-white/60"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="bg-[#121212] text-white max-w-[80%] rounded-xl p-3 flex items-center mr-auto">
                    <Loader2 className="h-4 w-4 text-[#d8f3dc] animate-spin mr-2" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="bg-black border-t border-[#C1FF00]/20 p-3">
            <div className="flex items-center bg-[#121212] rounded-full overflow-hidden px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`ml-2 p-2 rounded-full ${
                  isLoading || !inputValue.trim()
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-[#d8f3dc] hover:bg-[#C1FF00]/10"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
