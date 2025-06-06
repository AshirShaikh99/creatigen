"use client";

import type React from "react";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/lib/store";
import {
  addMessage,
  resetChat,
  setDeepSearch,
} from "@/app/lib/messages/messageSlice";
import type { Message } from "@/app/lib/messages/messageSlice";
import MessageList from "@/components/chat-page/MessageList";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  Brain,
  Plus,
  Send,
  ArrowLeft,
  Database,
  Activity,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface ChatInterfaceProps {
  onBackToDashboard: () => void;
  selectedRepository: string | null;
}

interface DiagramResponse {
  diagram_type: string;
  syntax: string;
  description: string;
  metadata: {
    options: Record<string, unknown>;
    model: string;
    tokens: number;
  };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onBackToDashboard,
  selectedRepository,
}) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const isDeepSearch = useSelector(
    (state: RootState) => state.chat.isDeepSearch
  );
  const repositories = useSelector(
    (state: RootState) => state.knowledgebase.repositories
  );

  // Get the selected repository details
  const selectedKnowledgeBase = repositories.find(
    (repo) => repo.uuid === selectedRepository
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(uuidv4());
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState<string>(
    "How can I help you?"
  );

  const placeholders = [
    "/diagram Create a flowchart for user registration",
    "/diagram Draw a sequence diagram for API flow",
    "/diagram Generate an ER diagram for blog",
    "How can I help you?",
    "What's the next big thing in AI?",
  ];

  const diagramKeywords = [
    "draw",
    "diagram",
    "flowchart",
    "sequence",
    "graph",
    "chart",
    "er diagram",
  ];

  const isDiagramRequest = (text: string): boolean => {
    const normalizedText = text.toLowerCase();
    return (
      normalizedText.startsWith("/diagram") ||
      diagramKeywords.some((keyword) => normalizedText.includes(keyword))
    );
  };

  const processDiagramResponse = async (
    response: DiagramResponse
  ): Promise<Message> => {
    let mermaidSyntax = response.syntax;
    if (mermaidSyntax.includes("```")) {
      mermaidSyntax =
        mermaidSyntax.match(/```(?:lua|mermaid)?\n?([\s\S]*?)```/)?.[1] || "";
    }

    return {
      id: uuidv4(),
      sender: "ai",
      text: response.description,
      type: "diagram",
      diagramData: mermaidSyntax.trim(),
    };
  };

  const processTextResponse = (message: string): Message => {
    return {
      id: uuidv4(),
      sender: "ai",
      text: message,
      type: "text",
    };
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const messageContent = text.trim();
    const isDiagram = isDiagramRequest(messageContent);

    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      text: messageContent,
      type: isDiagram ? "diagram" : "text",
    };

    dispatch(addMessage(userMessage));

    try {
      setIsLoading(true);
      const endpoint = isDiagram
        ? "http://localhost:8000/api/v1/diagram"
        : "http://localhost:8000/api/v1/chat";

      console.log("Sending request to:", endpoint, {
        message: messageContent,
        collection_name: selectedKnowledgeBase?.collection_name,
        session_id: sessionId,
      });

      const requestData = {
        message:
          isDiagram && !messageContent.startsWith("/diagram")
            ? `/diagram ${messageContent}`
            : messageContent,
        session_id: sessionId,
        deep_research: isDeepSearch,
        collection_name:
          selectedKnowledgeBase?.collection_name ||
          selectedKnowledgeBase?.name?.toLowerCase().replace(/\s+/g, "_"),
      };

      const response = await axios.post(endpoint, requestData, {
        headers: {
          "Content-Type": "application/json",
          "user-id": sessionId,
        },
      });

      console.log("API Response:", response.data);

      const aiMessage = isDiagram
        ? await processDiagramResponse(response.data as DiagramResponse)
        : processTextResponse(response.data.message);

      dispatch(addMessage(aiMessage));
    } catch (error) {
      console.error("Error in request:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        sender: "ai",
        text: isDiagram
          ? "Sorry, I couldn't generate the diagram. Please try again."
          : "Sorry, I'm having trouble connecting to the server.",
        type: "text",
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

  const handleSwitchChange = (checked: boolean) => {
    dispatch(setDeepSearch(checked));
  };

  // Cycle through placeholders
  useState(() => {
    const interval = setInterval(() => {
      const currentIndex = placeholders.indexOf(currentPlaceholder);
      const nextIndex = (currentIndex + 1) % placeholders.length;
      setCurrentPlaceholder(placeholders[nextIndex]);
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#C1FF00]/20">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Welcome to Your{" "}
            <span className="text-[#d8f3dc]">Creative Space</span>
          </h1>
          <Button
            variant="outline"
            className="border-[#d8f3dc] text-[#d8f3dc] hover:bg-[#C1FF00]/10"
            onClick={onBackToDashboard}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <p className="text-gray-400 mt-2">
          Organize, explore, and interact with your data using AI
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <div className="bg-[#121212] rounded-lg p-4 flex items-center">
          <div className="bg-[#d8f3dc] p-3 rounded-lg mr-4">
            <Database className="h-6 w-6 text-black" />
          </div>
          <div>
            <p className="text-gray-400">Total Knowledge Bases</p>
            <p className="text-3xl font-bold">2</p>
          </div>
        </div>

        <div className="bg-[#121212] rounded-lg p-4 flex items-center">
          <div className="bg-[#d8f3dc] p-3 rounded-lg mr-4">
            <Activity className="h-6 w-6 text-black" />
          </div>
          <div>
            <p className="text-gray-400">Recent Activities</p>
            <p className="text-3xl font-bold">24</p>
          </div>
        </div>

        <div className="bg-[#121212] rounded-lg p-4 flex items-center">
          <div className="bg-[#d8f3dc] p-3 rounded-lg mr-4">
            <MessageSquare className="h-6 w-6 text-black" />
          </div>
          <div>
            <p className="text-gray-400">AI Interactions</p>
            <p className="text-3xl font-bold">128</p>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Brain className="h-16 w-16 text-[#d8f3dc] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Start a Creative Conversation
              </h3>
              <p className="text-gray-400 max-w-md">
                Ask questions, create diagrams, or explore your knowledge base
                with AI assistance.
              </p>
              {selectedKnowledgeBase && (
                <p className="text-[#d8f3dc] mt-4">
                  Chatting with: {selectedKnowledgeBase.name}
                </p>
              )}
            </div>
          ) : (
            <div className="pb-20">
              <MessageList messages={messages} loading={isLoading} />
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-[#C1FF00]/20">
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <div className="w-2 h-6 bg-[#d8f3dc] mr-2"></div>
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            className="bg-[#121212] border-[#C1FF00]/20 hover:bg-[#1a1a1a] h-24 flex flex-col items-center justify-center"
          >
            <div className="bg-[#d8f3dc] p-3 rounded-full mb-2">
              <Plus className="h-6 w-6 text-black" />
            </div>
            <span>Create Knowledge Base</span>
          </Button>

          <Button
            variant="outline"
            className="bg-[#121212] border-[#C1FF00]/20 hover:bg-[#1a1a1a] h-24 flex flex-col items-center justify-center"
            onClick={() => dispatch(resetChat())}
          >
            <div className="bg-[#d8f3dc] p-3 rounded-full mb-2">
              <Brain className="h-6 w-6 text-black" />
            </div>
            <span>Start AI Conversation</span>
          </Button>
        </div>
      </div>

      {/* Input Section - Centered */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm py-6 border-t border-[#C1FF00]/20">
        <div className="max-w-3xl mx-auto px-4">
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col items-center"
          >
            <div className="flex items-center w-full max-w-2xl mx-auto mb-2">
              <div className="flex items-center mr-4">
                <Switch
                  checked={isDeepSearch}
                  onCheckedChange={handleSwitchChange}
                  className="data-[state=checked]:bg-[#d8f3dc]"
                />
                <span className="ml-2 text-sm text-gray-400">Deep Search</span>
              </div>
            </div>

            <div className="flex w-full max-w-2xl mx-auto">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={currentPlaceholder}
                className="flex-1 bg-[#121212] border-[#C1FF00]/20 focus:border-[#d8f3dc] focus:ring-[#d8f3dc] text-white placeholder-gray-500"
              />
              <Button
                type="submit"
                className="ml-2 bg-[#d8f3dc] text-black hover:bg-[#d8f3dc]"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
