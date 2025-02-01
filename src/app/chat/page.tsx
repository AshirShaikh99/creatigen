"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { addMessage, resetChat } from "@/app/lib/messages/messageSlice";
import MessageList from "@/components/chat-page/MessageList";

import GradualSpacing from "@/components/ui/gradual-spacing";
import { Message } from "@/app/lib/messages/messageSlice";
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

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();

  const messages = useSelector((state: RootState) => state.chat.messages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resID, setResID] = useState<string | null>(null); // State to store resID
  const [inputValue, setInputValue] = useState<string>("");

  const placeholders = [
    "Let's brainstorm some creative ideas!",
    "How can I help you?",
    "What's the next big thing in AI?",
    "How to build an app?",
    "What is frontend?",
  ];
  // Start a new chat by clearing the message list
  const handleStartNewChat = () => {
    dispatch(resetChat());
    setResID(null);
  };

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: "user", // Explicitly set the sender to "user"
      text,
    };
    dispatch(addMessage(userMessage));

    try {
      setIsLoading(true); // Set loading to true while awaiting AI response

      const response = await axios.post("/api/chat", {
        message: text,
      });

      const aiResponseText =
        response.data.candidates[0]?.content.parts[0]?.text ||
        "I don't have a response right now.";

      const aiMessage: Message = {
        id: uuidv4(),
        sender: "ai", // Explicitly set the sender to "ai"
        text: aiResponseText,
      };
      dispatch(addMessage(aiMessage));
      // Update resID if available
      if (response.data.response_id) {
        setResID(response.data.resID);
      }
    } catch (error: unknown) {
      console.error("Error in POST /api/chat:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false); // Set loading to false after the response is received
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue(""); // Clear the input field after sending the message
  };

  // Once connected, render the entire UI
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-black text-gray-800">
      {/* Header */}
      {/* <div className="w-full max-w-4xl flex items-center justify-center p-4">
        <Image
          src="/assets/logo/blockchain.png"
          alt="Logo"
          width={100}
          height={50}
          className="invert"
        />
      </div> */}

      {/* Initial State with Heading and Input */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-grow space-y-4">
          <div className="relative flex flex-col h-[500px] w-full items-center justify-center overflow-hidden bg-black md:shadow-xl">
            <GradualSpacing
              className="font-display text-center text-2xl font-bold tracking-wide text-white sm:text-lg md:text-6xl"
              text="LightingChat"
            />
            <p className="text-white text-center mt-4">
              LightingChat is your complete solution for creating AI-powered
              applications. Whether youre a developer, designer, or project
              manager, LightingChat has you covered.
            </p>
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
              )}
            />
          </div>

          {/* Text Section */}

          {/* Message Input Section */}
          <div className="flex justify-center w-full px-2 sm:px-4">
            <div className="w-full max-w-full sm:max-w-[400px]">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleInputChange}
                onSubmit={handleFormSubmit}
                // Ensure the input value is controlled
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat State */}
      {messages.length > 0 && (
        <div className="flex flex-col w-full max-w-4xl h-screen flex-grow overflow-x-hidden">
          <TooltipProvider>
            {/* New Chat Button (Visible on all screen sizes) */}
            <Tooltip>
              <div className="flex justify-start py-4 px-3">
                <TooltipTrigger asChild>
                  <RainbowButton
                    onClick={handleStartNewChat}
                    className="start-new-chat-button p-3  text-white flex items-start justify-start gap-2"
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

          {/* Messages Container: Scrollable only on mobile */}
          <div className="w-full flex-grow p-4 overflow-y-auto flex-1 sm:overflow-y-auto sm:flex-grow max-h-[calc(100vh-150px)]">
            <MessageList
              messages={messages}
              loading={isLoading}
              responseID={resID || ""}
            />
          </div>

          {/* Message Input: Fixed at the bottom */}
          <div className="flex justify-center w-full px-2 sm:px-4 pb-4">
            {" "}
            {/* Added pb-4 */}
            <div className="w-full max-w-full sm:max-w-[900px]">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleInputChange}
                onSubmit={handleFormSubmit}
                // Ensure the input value is controlled
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
