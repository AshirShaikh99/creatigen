import type React from "react";
import type { Message } from "@/app/lib/messages/messageSlice";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.sender === "user"
                ? "bg-[#C1FF00] text-black"
                : "bg-[#121212] text-white"
            }`}
          >
            {message.type === "diagram" && message.diagramData ? (
              <div className="space-y-2">
                <p>{message.text}</p>
                <div className="bg-[#1a1a1a] p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    {message.diagramData}
                  </pre>
                </div>
              </div>
            ) : (
              <p>{message.text}</p>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-[#121212] text-white max-w-[80%] rounded-lg p-4 flex items-center">
            <Loader2 className="h-5 w-5 text-[#C1FF00] animate-spin mr-2" />
            <p>Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
