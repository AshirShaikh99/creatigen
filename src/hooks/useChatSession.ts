import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai" | "bot";
  timestamp: Date;
}

// Interface for parsed message from localStorage
interface StoredMessage {
  id: string;
  text: string;
  sender: "user" | "ai" | "bot";
  timestamp: string; // Stored as string in JSON
}

interface UseChatSessionProps {
  initialMessages?: Message[];
  persistKey?: string;
}

export function useChatSession({
  initialMessages = [],
  persistKey,
}: UseChatSessionProps = {}) {
  const [sessionId] = useState<string>(() => {
    // Try to restore existing session ID from local storage
    if (persistKey) {
      const storedSession = localStorage.getItem(`${persistKey}_session_id`);
      return storedSession || uuidv4();
    }
    return uuidv4();
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    if (persistKey) {
      // Try to restore messages from local storage
      const storedMessages = localStorage.getItem(`${persistKey}_messages`);
      if (storedMessages) {
        try {
          // Parse and ensure timestamps are Date objects
          const parsedMessages = JSON.parse(storedMessages).map(
            (msg: StoredMessage) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })
          );
          return parsedMessages.length > 0 ? parsedMessages : initialMessages;
        } catch (e) {
          console.error("Failed to parse stored messages", e);
        }
      }
    }
    return initialMessages;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Persist messages to localStorage when they change
  useEffect(() => {
    if (persistKey && messages.length > 0) {
      localStorage.setItem(`${persistKey}_messages`, JSON.stringify(messages));
      localStorage.setItem(`${persistKey}_session_id`, sessionId);
    }
  }, [messages, sessionId, persistKey]);

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      const newMessage: Message = {
        ...message,
        id: uuidv4(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    []
  );

  const clearMessages = useCallback(
    (welcomeMessage?: string) => {
      if (welcomeMessage) {
        setMessages([
          {
            id: uuidv4(),
            text: welcomeMessage,
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages([]);
      }

      // Clear persisted messages if using persistence
      if (persistKey) {
        localStorage.removeItem(`${persistKey}_messages`);
      }
    },
    [persistKey]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (text.trim() === "" || isLoading) return;

      // Add user message to UI immediately
      addMessage({
        text: text.trim(),
        sender: "user",
      });

      setInputValue("");
      setIsLoading(true);

      try {
        // Build URL with query parameters
        const url = new URL("http://localhost:8000/api/v1/chat");
        url.searchParams.append("session_id", sessionId); // Add session_id as query parameter

        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-id": "unique-user-identifier",
          },
          body: JSON.stringify({
            message: text.trim(),
            deep_research: false,
          }),
        });

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log("Raw API Response:", responseText);

        if (!response.ok) {
          console.error("API Error:", {
            status: response.status,
            statusText: response.statusText,
            responseText,
          });
          throw new Error(`API returned ${response.status}: ${responseText}`);
        }

        // Parse the response text
        let data;
        try {
          data = JSON.parse(responseText);
          console.log("Parsed API Response:", data);
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          throw new Error("Invalid JSON response from server");
        }

        // Add AI response
        addMessage({
          // The message is in the 'message' field based on your Postman response
          text: data.message || "Sorry, I couldn't process your request.",
          sender: "ai",
        });
      } catch (error) {
        console.error("Error sending message:", error);

        // Add error message
        addMessage({
          text: "Sorry, I encountered an error while processing your request. Please try again.",
          sender: "ai",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, isLoading, sessionId]
  );

  return {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sessionId,
    sendMessage,
    addMessage,
    clearMessages,
  };
}
