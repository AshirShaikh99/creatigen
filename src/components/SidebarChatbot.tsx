"use client";

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
import { Vapi } from '@vapi-ai/web';
import { Mic, MicOff } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState(false);
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionId] = useState<string>(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize Vapi
  useEffect(() => {
    if (isOpen) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        if (!apiKey) {
          console.error('Vapi API key is missing');
          return;
        }
        
        const vapiInstance = new Vapi({
          apiKey: apiKey,
        });
        
        setVapi(vapiInstance);
        console.log('Vapi SDK initialized');
        
        return () => {
          vapiInstance.destroy();
        };
      } catch (error) {
        console.error('Error initializing Vapi:', error);
      }
    }
  }, [isOpen]);
  
  // Add voice chat handler
  // In the handleVoiceChat function
  const handleVoiceChat = async () => {
    if (!vapi) {
      console.error('Vapi not initialized');
      return;
    }
  
    if (!isRecording) {
      setIsRecording(true);
      try {
        console.log('Starting Vapi voice chat...');
        await vapi.start({
          assistantConfig: {
            name: "Creative Agent",
            prompt: "You are a creative AI assistant helping with creative tasks and projects.",
          },
          onSpeechStart: () => {
            console.log('Speech started');
            setIsLoading(true);
          },
          onSpeechEnd: async (transcript) => {
            console.log('Speech ended with transcript:', transcript);
            setInputValue(transcript);
            await handleSendMessage();
            setIsRecording(false);
          },
          onError: (error) => {
            console.error('Voice chat error:', error);
            setIsRecording(false);
          }
        });
      } catch (error) {
        console.error('Voice chat error:', error);
        setIsRecording(false);
      }
    } else {
      console.log('Stopping Vapi voice chat...');
      setIsRecording(false);
      await vapi.stop();
    }
  };
  
  // Add mic button to chat input
  return (
    <div className="p-4 border-t border-[#1A1A1A] bg-[#0A0A0A]">
      <div className="flex items-center bg-[#121212] rounded-full overflow-hidden px-4 py-2 border border-[#1A1A1A] focus-within:border-[#d8f3dc]/50 transition-colors duration-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleVoiceChat}
          className="h-8 w-8 mr-2 rounded-full hover:bg-[#1A1A1A] text-gray-400 hover:text-white"
        >
          {isRecording ? (
            <MicOff className="h-4 w-4 text-[#d8f3dc]" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
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