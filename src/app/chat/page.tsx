"use client";

import type React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/lib/store";
import { addMessage, resetChat } from "@/app/lib/messages/messageSlice";
import MessageList from "@/components/chat-page/MessageList";
import GradualSpacing from "@/components/ui/gradual-spacing";
import type { Message } from "@/app/lib/messages/messageSlice";
import axios from "axios";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { v4 as uuidv4 } from "uuid";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Marquee } from "@/components/magicui/marquee";
import { PromptCard } from "@/components/prompt-cards";
import { reviews } from "@/app/utils/text";

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(uuidv4());
  const [inputValue, setInputValue] = useState<string>("");
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  const placeholders = [
    "Let's brainstorm some creative ideas!",
    "How can I help you?",
    "What's the next big thing in AI?",
    "How to build an app?",
    "What is frontend?",
  ];

  const handleStartNewChat = () => {
    dispatch(resetChat());
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      text,
    };
    dispatch(addMessage(userMessage));

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/chat",
        {
          message: text,
          session_id: sessionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "user-id": sessionId,
          },
        }
      );

      const aiMessage: Message = {
        id: uuidv4(),
        sender: "ai",
        text: response.data.message || "I don't have a response right now.",
      };
      dispatch(addMessage(aiMessage));
    } catch (error: unknown) {
      console.error("Error in chat request:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        sender: "ai",
        text: "Sorry, I'm having trouble connecting to the server. Please make sure the backend server is running at http://localhost:8000/api/chat",
      };
      dispatch(addMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-800 relative">
      <DotPattern
        className={cn(
          "absolute inset-0 w-full h-full opacity-20",
          "[mask-image:radial-gradient(100% 100% at center center,white,transparent)]"
        )}
      />

      {messages.length === 0 ? (
        <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
          {/* Title Section */}
          <div className="text-center mb-12 sm:mb-16">
            <GradualSpacing
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white mb-6"
              text="Creatigen"
            />
            <p className="text-white text-lg sm:text-xl">
              Unleash Infinite Creativity, One Idea at a Time! 🚀✨
            </p>
          </div>

          {/* Prompt Cards Section */}
          <div className="w-full max-w-5xl mx-auto mb-12 sm:mb-16">
            <div className="relative">
              <Marquee pauseOnHover className="[--duration:20s] mb-6">
                {firstRow.map((review) => (
                  <PromptCard key={review.prompt} {...review} />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                  <PromptCard key={review.prompt} {...review} />
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
            </div>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-2xl mx-auto px-4">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleInputChange}
              onSubmit={handleFormSubmit}
              value={inputValue}
              className="w-full"
            />
          </div>
        </main>
      ) : (
        <div className="flex flex-col h-screen">
          <TooltipProvider>
            <Tooltip>
              <div className="flex justify-start p-4">
                <TooltipTrigger asChild>
                  <RainbowButton
                    onClick={handleStartNewChat}
                    className="start-new-chat-button p-3 text-white flex items-center gap-2"
                  >
                    Start New Chat
                  </RainbowButton>
                </TooltipTrigger>
              </div>
              <TooltipContent>
                <p>Start New Creative Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1 overflow-y-auto px-4">
            <div className="max-w-4xl mx-auto">
              <MessageList messages={messages} loading={isLoading} />
            </div>
          </div>

          <div className="border-t border-gray-800 bg-black/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto p-4">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleInputChange}
                onSubmit={handleFormSubmit}
                value={inputValue}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
