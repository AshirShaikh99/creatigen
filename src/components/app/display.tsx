import { shows } from "@/data/shows";
import {
  Message,
  MessageTypeEnum,
  TranscriptMessage,
  TranscriptMessageTypeEnum,
} from "@/lib/types/conversation.type";
import { vapi } from "@/lib/vapi.sdk";
import React, { useEffect, useRef } from "react";
import { ShowsComponent } from "./shows";
import { Ticket } from "./ticket";
import { motion, AnimatePresence } from "framer-motion";
import { useVapi } from "@/hooks/useVapi";

function Display() {
  const { messages, activeTranscript } = useVapi();
  const [showList, setShowList] = React.useState<Array<(typeof shows)[number]>>(
    []
  );
  const [status, setStatus] = React.useState<"show" | "confirm" | "ticket">(
    "show"
  );
  const [selectedShow, setSelectedShow] = React.useState<
    (typeof shows)[number] | null
  >(null);
  const [confirmDetails, setConfirmDetails] = React.useState<{}>({});

  // Create refs for the messages container and end element to enable auto-scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages to only show transcript messages
  const transcriptMessages = messages.filter(
    (message) => message.type === MessageTypeEnum.TRANSCRIPT
  ) as TranscriptMessage[];

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (messagesContainerRef.current) {
        // Fallback method if the end ref isn't available
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    };

    // Scroll immediately
    scrollToBottom();

    // Also set a short timeout to ensure scrolling happens after rendering
    const timeoutId = setTimeout(scrollToBottom, 100);

    // Set up a MutationObserver to detect when new content is added
    if (messagesContainerRef.current) {
      const observer = new MutationObserver(scrollToBottom);
      observer.observe(messagesContainerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    }

    return () => clearTimeout(timeoutId);
  }, [messages, activeTranscript]);

  useEffect(() => {
    const onMessageUpdate = (message: Message) => {
      if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        message.functionCall.name === "suggestShows"
      ) {
        setStatus("show");
        vapi.send({
          type: MessageTypeEnum.ADD_MESSAGE,
          message: {
            role: "system",
            content: `Here is the list of suggested shows: ${JSON.stringify(
              shows.map((show) => show.title)
            )}`,
          },
        });
        setShowList(shows);
      } else if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        (message.functionCall.name === "confirmDetails" ||
          message.functionCall.name === "bookTickets")
      ) {
        const params = message.functionCall.parameters;

        setConfirmDetails(params);
        console.log("parameters", params);

        const result = shows.find(
          (show) => show.title.toLowerCase() == params.show.toLowerCase()
        );
        setSelectedShow(result ?? shows[0]);

        setStatus(
          message.functionCall.name === "confirmDetails" ? "confirm" : "ticket"
        );
      }
    };

    const reset = () => {
      setStatus("show");
      setShowList([]);
      setSelectedShow(null);
    };

    vapi.on("message", onMessageUpdate);
    vapi.on("call-end", reset);
    return () => {
      vapi.off("message", onMessageUpdate);
      vapi.off("call-end", reset);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      {/* Conversation transcript */}
      <div
        ref={messagesContainerRef}
        className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {transcriptMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 1,
              }}
              className={`p-3 rounded-xl max-w-[85%] ${
                message.role === "user"
                  ? "bg-purple-900/30 ml-auto"
                  : "bg-gray-800 mr-auto"
              }`}
            >
              <p className="text-sm text-gray-200">{message.transcript}</p>
            </motion.div>
          ))}

          {/* Active transcript (typing effect) */}
          {activeTranscript &&
            activeTranscript.transcriptType ===
              TranscriptMessageTypeEnum.PARTIAL && (
              <motion.div
                key="active-transcript"
                initial={{ opacity: 0.5, y: 20, scale: 0.95 }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  opacity: { repeat: Infinity, duration: 1.5 },
                  y: { type: "spring", stiffness: 500, damping: 30 },
                  scale: { type: "spring", stiffness: 500, damping: 30 },
                }}
                className={`p-3 rounded-xl max-w-[85%] ${
                  activeTranscript.role === "user"
                    ? "bg-purple-900/30 ml-auto"
                    : "bg-gray-800 mr-auto"
                }`}
              >
                <p className="text-sm text-gray-300">
                  {activeTranscript.transcript}
                </p>
              </motion.div>
            )}

          {/* Invisible element for auto-scrolling */}
          <div ref={messagesEndRef} className="h-0 w-full" />
        </AnimatePresence>
      </div>

      {/* Show displays */}
      <AnimatePresence>
        {showList.length > 0 && status === "show" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ShowsComponent showList={showList} />
          </motion.div>
        )}

        {status !== "show" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Ticket
              type={status}
              show={selectedShow ?? shows[0]}
              params={confirmDetails}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Display };
