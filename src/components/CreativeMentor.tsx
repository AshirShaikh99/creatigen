"use client";

import React, { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Phone, PhoneOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CreativeMentorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreativeMentor({
  isOpen,
  onClose,
}: CreativeMentorProps) {
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Using any type for Vapi instance since the types are complex
  const vapiRef = useRef<any>(null);

  // Initialize Vapi when component mounts
  useEffect(() => {
    if (!isOpen) return;

    // Try to get the public key from environment variables
    let publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

    // IMPORTANT: For testing only - remove in production
    // If no key is found in environment variables, use a hardcoded test key
    if (!publicKey) {
      // This is where you would add a test public key if needed
      // publicKey = "your_test_public_key_here";
      console.warn("Using hardcoded test key - REMOVE IN PRODUCTION");
    }

    // Log the key for debugging (remove in production)
    console.log(
      "Using Vapi key:",
      publicKey ? "[Key available]" : "[No key available]"
    );

    if (!publicKey) {
      console.error("Vapi public key is missing");
      setStatus("error");
      return;
    }

    try {
      // Create Vapi instance
      vapiRef.current = new Vapi(publicKey);

      // Set up event listeners
      vapiRef.current.on("call-start", () => {
        console.log("Call started");
        setStatus("connected");
        startTimer();
      });

      vapiRef.current.on("call-end", () => {
        console.log("Call ended");
        setStatus("idle");
        stopTimer();
      });

      vapiRef.current.on("error", (error: Error) => {
        console.error("Vapi error:", error);

        // Check if it's a key-related error
        const errorStr = String(error);
        if (
          errorStr.includes("Invalid Key") ||
          errorStr.includes("Forbidden")
        ) {
          console.error(
            "This appears to be a key-related error. Please make sure you're using a PUBLIC key, not a private key."
          );
          console.error(
            "You can find your public key in the Vapi dashboard: https://dashboard.vapi.ai/account"
          );
        }

        setStatus("error");
        stopTimer();
      });

      setStatus("idle");

      // Clean up on unmount
      return () => {
        if (vapiRef.current) {
          vapiRef.current.destroy();
          vapiRef.current = null;
        }
        stopTimer();
      };
    } catch (error) {
      console.error("Error initializing Vapi:", error);
      setStatus("error");
    }
  }, [isOpen]);

  // Start call timer
  const startTimer = () => {
    setCallDuration(0);
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // Stop call timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Format call duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle starting a call
  const handleStartCall = async () => {
    if (!vapiRef.current) {
      console.error("Vapi not initialized");
      return;
    }

    try {
      setStatus("connecting");

      // Start the call
      await vapiRef.current.start(
        {
          // Assistant configuration
          assistant: {
            model: {
              provider: "openai",
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a Creative Mentor AI assistant. Your role is to help users with creative projects, brainstorming ideas, and providing guidance on creative processes. Be supportive, insightful, and offer constructive feedback. You should ask clarifying questions to better understand the user's creative needs and tailor your advice accordingly.",
                },
              ],
            },
            voice: {
              provider: "playht",
              voiceId: "jennifer", // A clear, professional voice
            },
            name: "Creative Mentor",
          },
          // These options should be at the top level, not inside assistant
          firstMessage:
            "Hi there! I'm your Creative Mentor. How can I help with your creative projects today?",
          silenceTimeout: 10000, // End call after 10 seconds of silence
        },
        {
          // Optional overrides
          onSpeechStart: () => {
            console.log("User started speaking");
          },
          onSpeechEnd: (transcript: string) => {
            console.log("User finished speaking:", transcript);
          },
        }
      );
    } catch (error) {
      console.error("Error starting call:", error);
      setStatus("error");
    }
  };

  // Handle ending a call
  const handleEndCall = async () => {
    if (!vapiRef.current) return;

    try {
      await vapiRef.current.stop();
      setStatus("idle");
      stopTimer();
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Creative Mentor
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {status === "idle" && "Ready to connect"}
                    {status === "connecting" && "Connecting..."}
                    {status === "connected" &&
                      `Call in progress (${formatDuration(callDuration)})`}
                    {status === "error" && "Connection error"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Call Interface */}
            <div className="p-6 flex flex-col items-center">
              <div
                id="vapi-widget"
                className="w-full h-64 mb-6 rounded-lg bg-background border border-border flex items-center justify-center"
              >
                {status === "idle" && (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground mb-4">
                      Call your Creative Mentor to discuss ideas, get feedback,
                      or brainstorm solutions.
                    </p>
                    <Button
                      onClick={handleStartCall}
                      className="bg-gradient-to-r from-accent to-primary text-primary-foreground hover:opacity-90"
                    >
                      <Phone className="h-4 w-4 mr-2" /> Start Call
                    </Button>
                  </div>
                )}

                {status === "connecting" && (
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="text-muted-foreground mt-4">
                      Connecting to your Creative Mentor...
                    </p>
                  </div>
                )}

                {status === "connected" && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 mx-auto animate-pulse">
                      <Phone className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <p className="text-foreground font-medium">
                      Call in progress
                    </p>
                    <p className="text-muted-foreground">
                      {formatDuration(callDuration)}
                    </p>
                  </div>
                )}

                {status === "error" && (
                  <div className="text-center">
                    <p className="text-destructive mb-2">
                      There was an error connecting to your Creative Mentor.
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      This may be due to an invalid API key. Please make sure
                      you're using a <strong>public key</strong>, not a private
                      key.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        onClick={handleStartCall}
                        className="border-input bg-background text-foreground hover:bg-secondary"
                      >
                        Try Again
                      </Button>
                      <a
                        href="https://dashboard.vapi.ai/account"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Get your public key from Vapi dashboard
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {status === "connected" && (
                <Button
                  onClick={handleEndCall}
                  variant="destructive"
                  className="bg-destructive text-destructive-foreground hover:opacity-90"
                >
                  <PhoneOff className="h-4 w-4 mr-2" /> End Call
                </Button>
              )}
            </div>

            {/* Tips */}
            <div className="p-4 border-t border-border bg-background/50">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Tips for a great conversation:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Be specific about your creative challenges</li>
                <li>• Ask for clarification if needed</li>
                <li>• The call will end after 10 seconds of silence</li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
