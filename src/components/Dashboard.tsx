"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Sparkles,
  MessageSquare,
  GitBranch,
  FileText,
  HelpCircle,
  Database,
  Activity,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Plus,
} from "lucide-react";

import { motion } from "framer-motion";
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
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const features = [
  {
    icon: Brain,
    title: "Create Creative Repository",
    description: "Start a new repository",
    href: "/create-knowledge-base",
  },
  {
    icon: Sparkles,
    title: "Explore Repositories",
    description: "Browse knowledge bases",
    href: "/explore-repositories",
  },
  {
    icon: MessageSquare,
    title: "Chat with Knowledge Base",
    description: "Interact with AI",
    href: "/chat",
  },
  {
    icon: GitBranch,
    title: "Build Diagrams",
    description: "Visualize concepts",
    href: "/diagrams",
  },
  {
    icon: FileText,
    title: "View Documents",
    description: "Manage files",
    href: "/documents",
  },
  {
    icon: HelpCircle,
    title: "Get Interactive Advice",
    description: "Get insights",
    href: "/advice",
  },
];

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

export function Dashboard() {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const isDeepSearch = useSelector(
    (state: RootState) => state.chat.isDeepSearch
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(uuidv4());
  const [inputValue, setInputValue] = useState<string>("");

  // Chat-related logic
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

    // Reset deep search after sending message
    dispatch(setDeepSearch(false));

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

      // Prepare the message for the diagram endpoint
      const requestData = {
        message:
          isDiagram && !messageContent.startsWith("/diagram")
            ? `/diagram ${messageContent}` // Add /diagram prefix if it's missing
            : messageContent,
        session_id: sessionId,
        deep_research: isDeepSearch,
      };

      const response = await axios.post(endpoint, requestData, {
        headers: {
          "Content-Type": "application/json",
          "user-id": sessionId,
        },
      });

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

  // Dashboard effects
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-black">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-[#C1FF00]/20 text-[#C1FF00] hover:bg-[#C1FF00]/30 transition-all duration-300"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-[#C1FF00]/20 transform lg:translate-x-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="border-b border-[#C1FF00]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br bg-[#C1FF00] flex items-center justify-center">
                <Brain className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white">Creatigen</span>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <motion.li
                  key={feature.title}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#C1FF00]/10 transition-all duration-200 group cursor-pointer"
                    onClick={() => {
                      if (feature.title === "Chat with Knowledge Base") {
                        setShowChat(true);
                      } else if (feature.href) {
                        // For actual link navigation in a real app
                        // window.location.href = feature.href;
                      }
                    }}
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#C1FF00]/10 flex items-center justify-center text-[#C1FF00] group-hover:bg-[#C1FF00]/20 transition-all duration-200">
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <span>{feature.title}</span>
                    <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t border-[#C1FF00]/20 p-4">
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-[#C1FF00]/10 justify-start gap-3"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <motion.main
        className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {!showChat ? (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome to Your{" "}
                <span className="bg-gradient-to-r bg-[#C1FF00] bg-clip-text text-transparent">
                  Creative Space
                </span>
              </h1>
              <p className="text-gray-400">
                Organize, explore, and interact with your data using AI
              </p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: Database,
                  title: "Total Knowledge Bases",
                  value: 3,
                  color: "bg-[#C1FF00]",
                },
                {
                  icon: Activity,
                  title: "Recent Activities",
                  value: 24,
                  color: "bg-[#C1FF00]",
                },
                {
                  icon: MessageSquare,
                  title: "AI Interactions",
                  value: 128,
                  color: "bg-[#C1FF00]",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="relative overflow-hidden bg-[#111111] border-[#222222]">
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${
                          stat.color.split(" ")[1]
                        }, ${stat.color.split(" ")[3]})`,
                      }}
                    ></div>
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                        >
                          <stat.icon className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{stat.title}</p>
                          <h3 className="text-3xl font-bold text-white">
                            {stat.value}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="h-8 w-1 bg-gradient-to-b bg-[#C1FF00] rounded-full"></span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="h-32 group glass-card bg-[#111111] border-[#222222]">
                    <div
                      className="flex flex-col items-center justify-center h-full gap-3 p-4 cursor-pointer"
                      onClick={() => {
                        /* Create Knowledge Base logic */
                      }}
                    >
                      <div className="h-12 w-12 rounded-full bg-[#C1FF00] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Plus className="h-6 w-6 text-black" />
                      </div>
                      <span className="text-white font-medium text-center">
                        Create Knowledge Base
                      </span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="h-32 group glass-card bg-[#111111] border-[#222222]">
                    <div
                      className="flex flex-col items-center justify-center h-full gap-3 p-4 cursor-pointer"
                      onClick={() => setShowChat(true)}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br bg-[#C1FF00] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Brain className="h-6 w-6 text-black" />
                      </div>
                      <span className="text-white font-medium text-center">
                        Start AI Conversation
                      </span>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          // Chat Interface
          <div className="h-[calc(100vh-2rem)] flex flex-col relative">
            <DotPattern
              className={cn(
                "absolute inset-0 w-full h-full opacity-20",
                "[mask-image:radial-gradient(100% 100% at center center,white,transparent)]"
              )}
            />

            <TooltipProvider>
              <div className="flex justify-between pb-4 sticky top-0 bg-black z-20">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ShimmerButton
                      onClick={() => dispatch(resetChat())}
                      className="p-3 text-white flex items-center gap-2"
                    >
                      Start New Chat
                    </ShimmerButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start New Creative Chat</p>
                  </TooltipContent>
                </Tooltip>

                <ShimmerButton
                  onClick={() => setShowChat(false)}
                  className="p-3 text-white flex items-center gap-2"
                >
                  Back to Dashboard
                </ShimmerButton>
              </div>
            </TooltipProvider>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Brain className="h-16 w-16 text-[#C1FF00] mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Start a Creative Conversation
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      Ask questions, create diagrams, or explore your knowledge
                      base with AI assistance.
                    </p>
                  </div>
                ) : (
                  <div className="pb-20">
                    <MessageList messages={messages} loading={isLoading} />
                  </div>
                )}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm py-4 border-t border-[#C1FF00]/20">
              <div className="max-w-3xl mx-auto px-4">
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={handleInputChange}
                  onSubmit={handleFormSubmit}
                  onSwitchChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
}

export default Dashboard;
