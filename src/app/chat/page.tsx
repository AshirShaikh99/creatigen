"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { addMessage, resetChat } from "@/app/lib/messages/messageSlice";
import MessageList from "@/components/chat-page/MessageList";

import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import GradualSpacing from "@/components/ui/gradual-spacing";
import { Message } from "@/app/lib/messages/messageSlice";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Vortex } from "@/components/ui/vortex";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resID, setResID] = useState<string | null>(null); // State to store resID
  const [inputValue, setInputValue] = useState<string>("");

  const placeholders = [
    "Let's brainstorm some creative ideas!",
    "How can we innovate in the tech industry?",
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
  const handleSendMessage = async (text: string, context_filter?: object) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user", // Explicitly set the sender to "user"
      text,
    };
    dispatch(addMessage(userMessage));

    try {
      setIsLoading(true); // Set loading to true while awaiting AI response

      const response = await axios.post("/api/chat", {
        message: text,
        query_type: "default",
        prompt: "",
        ...(context_filter && { context_filter }), // Add context_filter if provided
      });

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai", // Explicitly set the sender to "ai"
        text: response.data.response || "I don't have a response right now.",
      };
      dispatch(addMessage(aiMessage));
      // Update resID if available
      if (response.data.response_id) {
        setResID(response.data.resID);
      }
    } catch (error: unknown) {
      const errorMessage: Message = {
        id: Date.now() + 2,
        sender: "ai", // Explicitly set the sender to "ai"
        text: "Hi How are you?",
      };
      dispatch(addMessage(errorMessage));
      console.error("Error in handleSendMessage:", error);
    } finally {
      setIsLoading(false); // Set loading to false after the response
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
          {/* Cards Container with Horizontal Scroll */}
          <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[30rem] overflow-hidden">
            <Vortex
              backgroundColor="black"
              className="flex items-center flex-col justify-center px-0 py-4 w-screen h-full"
            >
              <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
                Creative AI
              </h2>
              <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
                Creative AI helps you to generate creative ideas and brainstorm.
              </p>
            </Vortex>
          </div>

          {/* Text Section */}
          <GradualSpacing
            className="font-display text-center text-2xl font-bold tracking-wide text-black sm:text-lg md:text-2xl"
            text="How Can I Assist You Today?"
          />

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
                  <Button
                    onClick={handleStartNewChat}
                    className="start-new-chat-button p-3  text-white flex items-start justify-start gap-2"
                  >
                    <FiPlus />
                  </Button>
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
