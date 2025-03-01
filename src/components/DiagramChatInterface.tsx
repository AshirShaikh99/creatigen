"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Download,
  Copy,
  Maximize2,
  ChevronDown,
  Code,
  FileLineChartIcon as FlowChart,
  GitBranch,
  Network,
  Workflow,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MermaidDiagram } from "./MermaidDiagram";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  diagram?: {
    type: string;
    code: string;
    rendered?: boolean;
  };
}

interface DiagramChatInterfaceProps {
  onBackToDashboard: () => void;
}

const diagramTypes = [
  { name: "Sequence Diagram", icon: Workflow },
  { name: "Flowchart", icon: FlowChart },
  { name: "Entity Relationship", icon: Network },
  { name: "Class Diagram", icon: Code },
  { name: "State Diagram", icon: GitBranch },
];

const exampleDiagrams = {
  "Sequence Diagram": `sequenceDiagram
    participant User as User
    participant API as API
    participant Database as Database
    
    User->>API: Send API request (e.g. GET, POST)
    API->>Database: Forward request to database
    Database-->>API: Return response to API
    API-->>User: Return response to user`,

  Flowchart: `flowchart TD
    A[Start] --> B{Is it valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Reject]
    C --> E[Save to Database]
    E --> F[End]`,

  "Entity Relationship": `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date created
    }
    LINE-ITEM {
        string product
        int quantity
        float price
    }`,

  "Class Diagram": `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +fetch()
    }
    class Cat {
        +scratch()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,

  "State Diagram": `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Submit
    Processing --> Success: Valid
    Processing --> Error: Invalid
    Success --> Idle: Reset
    Error --> Idle: Reset`,
};

export default function DiagramChatInterface({
  onBackToDashboard,
}: DiagramChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Welcome to the Diagram Builder! I can help you create various types of diagrams using Creatigen syntax. What type of diagram would you like to create today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDiagramType, setSelectedDiagramType] = useState<string | null>(
    null
  );
  const [fullscreenDiagram, setFullscreenDiagram] = useState<string | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, []);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = "";
      let diagramType = "";
      let diagramCode = "";

      // Check if user is asking for a specific diagram type
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("sequence") || lowerInput.includes("api flow")) {
        diagramType = "Sequence Diagram";
        diagramCode = exampleDiagrams["Sequence Diagram"];
        responseContent =
          "Here's a sequence diagram showing API interaction flow:";
      } else if (
        lowerInput.includes("flow") ||
        lowerInput.includes("process")
      ) {
        diagramType = "Flowchart";
        diagramCode = exampleDiagrams["Flowchart"];
        responseContent = "I've created a flowchart based on your request:";
      } else if (
        lowerInput.includes("entity") ||
        lowerInput.includes("database") ||
        lowerInput.includes("er")
      ) {
        diagramType = "Entity Relationship";
        diagramCode = exampleDiagrams["Entity Relationship"];
        responseContent = "Here's an entity relationship diagram:";
      } else if (
        lowerInput.includes("class") ||
        lowerInput.includes("object")
      ) {
        diagramType = "Class Diagram";
        diagramCode = exampleDiagrams["Class Diagram"];
        responseContent = "I've created a class diagram for you:";
      } else if (
        lowerInput.includes("state") ||
        lowerInput.includes("transition")
      ) {
        diagramType = "State Diagram";
        diagramCode = exampleDiagrams["State Diagram"];
        responseContent = "Here's a state diagram showing transitions:";
      } else {
        // Default to sequence diagram if no specific type is detected
        diagramType = "Sequence Diagram";
        diagramCode = exampleDiagrams["Sequence Diagram"];
        responseContent =
          "I've created a sequence diagram based on your request:";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        diagram: {
          type: diagramType,
          code: diagramCode,
          rendered: false,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderDiagram = (code: string) => {
    return (
      <div className="relative w-full overflow-hidden rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#C1FF00]"></div>
            <span className="text-xs text-gray-400">Creatigen Diagram</span>
          </div>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-[#1A1A1A]"
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy diagram code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-[#1A1A1A]"
                    onClick={() => setFullscreenDiagram(code)}
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View fullscreen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-[#1A1A1A]"
                  >
                    <Download className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download diagram</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-4 p-4 bg-[#111111] rounded-md overflow-hidden">
          <div className="flex justify-center">
            <MermaidDiagram code={code} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-[#111111] hover:bg-[#1A1A1A]"
            onClick={onBackToDashboard}
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Diagram Builder</h1>
            <p className="text-sm text-gray-400">
              Create and visualize diagrams with Creatigen
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#111111] border-[#1A1A1A] hover:bg-[#1A1A1A] text-white"
            >
              <span className="mr-2">Diagram Templates</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#111111] border-[#1A1A1A] text-white">
            {diagramTypes.map((type) => (
              <DropdownMenuItem
                key={type.name}
                className="flex items-center gap-2 hover:bg-[#1A1A1A] cursor-pointer"
                onClick={() => {
                  setSelectedDiagramType(type.name);
                  setInput(`Create a ${type.name.toLowerCase()} for me`);
                }}
              >
                <type.icon className="h-4 w-4 text-[#C1FF00]" />
                <span>{type.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl p-4",
                  message.role === "user"
                    ? "bg-[#C1FF00] text-black"
                    : "bg-[#111111] text-white border border-[#1A1A1A]"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.diagram && (
                  <div className="mt-4">
                    {renderDiagram(message.diagram.code)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl p-4 bg-[#111111] text-white border border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#C1FF00]" />
                <p className="text-sm text-gray-400">Generating diagram...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the diagram you want to create..."
          className="min-h-[48px] max-h-[200px] pr-12 bg-[#111111] border-[#1A1A1A] focus:border-[#C1FF00]/50 focus:ring-[#C1FF00]/20 rounded-xl resize-none placeholder:text-gray-500"
        />
        <Button
          className={cn(
            "absolute right-2 bottom-2 h-8 w-8 rounded-lg bg-[#C1FF00] hover:bg-[#d2ff4d] text-black transition-opacity",
            !input.trim() && "opacity-50 cursor-not-allowed"
          )}
          disabled={!input.trim()}
          onClick={handleSendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Fullscreen diagram modal */}
      <AnimatePresence>
        {fullscreenDiagram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setFullscreenDiagram(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#0A0A0A] rounded-xl border border-[#1A1A1A] p-6 w-full max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  Diagram Preview
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-[#1A1A1A]"
                  onClick={() => setFullscreenDiagram(null)}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </Button>
              </div>

              <div className="bg-[#111111] rounded-lg p-6 overflow-auto">
                <MermaidDiagram
                  code={fullscreenDiagram}
                  className="max-w-full"
                />
              </div>

              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  className="bg-[#111111] border-[#1A1A1A] hover:bg-[#1A1A1A] text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(fullscreenDiagram);
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>

                <Button className="bg-[#C1FF00] hover:bg-[#d2ff4d] text-black">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
