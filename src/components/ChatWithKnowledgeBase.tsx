"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function ChatWithKnowledgeBase() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: input.trim(),
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInput("");
      // Here you would typically send the message to your AI backend
      // and then add the AI's response to the messages
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg h-[600px] flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Chat with Knowledge Base
      </h2>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg ${
              message.sender === "user"
                ? "bg-purple-600 ml-auto"
                : "bg-gray-800"
            } max-w-[80%]`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
}
