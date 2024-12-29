"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiMic, FiArrowUp, FiStopCircle } from "react-icons/fi";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<
  MessageInputProps & React.HTMLAttributes<HTMLDivElement>
> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => prev + transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error, event.message);
        setIsRecording(false);
      };

      recognition.onstart = () => console.log("Speech recognition started");

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsRecording(false);
      };

      setRecorder(recognition);
    } else {
      console.log("Speech recognition is not supported in this browser.");
    }
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Reset height and apply scrollable logic
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 72)}px`; // Max height for 3 lines
  };

  const handleMicClick = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          console.log("Microphone access granted");
          if (recorder) {
            setIsRecording(true);
            recorder.start();
          }
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
          alert(
            "Microphone access is required for voice input. Please check your browser permissions."
          );
        });
    } else if (window.webkitSpeechRecognition) {
      try {
        console.log("Using webkitSpeechRecognition for Safari/iOS.");
        if (recorder) {
          setIsRecording(true);
          recorder.start();
        }
      } catch (err) {
        console.error("Error with webkitSpeechRecognition:", err);
        alert(
          "Speech recognition is not fully supported on this browser. Please try using the latest version of Chrome or update Safari."
        );
      }
    } else {
      console.log("Speech recognition is not supported in this browser.");
      alert(
        "Your browser does not support speech recognition. Please use a compatible browser such as Chrome or Safari."
      );
    }
  };

  const handleStopClick = () => {
    if (recorder) {
      setIsRecording(false);
      recorder.stop();
      console.log("Speech recognition stopped");
    }
  };

  return (
    <div className="flex items-end gap-2 bg-black rounded-2xl px-4 py-3">
      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          autoResize(e);
        }}
        onKeyDown={handleKeyPress}
        placeholder="Ask something..."
        className="flex-1 resize-none bg-transparent text-white placeholder-white focus:outline-black focus:ring-black border-none font-bold"
        style={{
          lineHeight: "24px",
          maxHeight: "120px",
          height: "auto",
        }}
        rows={1}
      />

      {/* Send or Mic Button */}
      {isRecording ? (
        <Button
          variant="destructive"
          size="icon"
          onClick={handleStopClick}
          className="self-end animate-pulse"
        >
          <FiStopCircle className="text-xl" />
        </Button>
      ) : (
        <>
          {message.trim() ? (
            <Button
              variant="default"
              size="icon"
              onClick={handleSend}
              className="self-end bg-blue-500 hover:bg-blue-600"
              style={{ height: "40px", width: "40px" }} // Ensures consistency
            >
              <FiArrowUp className="text-xl text-white" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="icon"
              onClick={handleMicClick}
              className="self-end text-gray-400 hover:text-gray-100"
              style={{ height: "40px", width: "40px" }}
            >
              <FiMic className="text-xl" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default MessageInput;
