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
import { Brain } from "lucide-react";

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(uuidv4());
  const [inputValue, setInputValue] = useState<string>("");

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

      const requestData = {
        message:
          isDiagram && !messageContent.startsWith("/diagram")
            ? `/diagram ${messageContent}`
            : messageContent,
        session_id: sessionId,
        deep_research: isDeepSearch,
        repository_id: selectedRepository, // Add the selected repository to the request
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

  return (
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
            onClick={onBackToDashboard}
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
                Ask questions, create diagrams, or explore your knowledge base
                with AI assistance.
              </p>
              {selectedRepository && (
                <p className="text-[#C1FF00] mt-4">
                  Chatting with repository: {selectedRepository}
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
  );
};

export default ChatInterface;
