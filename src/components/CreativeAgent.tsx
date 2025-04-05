"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CreativeAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreativeAgent({ isOpen, onClose }: CreativeAgentProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 z-50 bg-[#0A0A0A] rounded-lg shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#1A1A1A] flex items-center justify-between">
              <h2 className="text-primary font-medium">Creative Agent</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-[#1A1A1A] text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="bg-[#121212] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400">
                  Voice agent feature has been removed.
                </p>
              </div>

              <div className="h-[400px] w-full flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  The voice agent functionality has been removed from this
                  application.
                  <br />
                  <br />
                  Please use the text-based chat features instead.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
