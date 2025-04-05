"use client";

import { useVapi } from "../../hooks/useVapi";
import { AssistantButton } from "./assistantButton";
import { Display } from "./display";
import { CALL_STATUS } from "@/hooks/useVapi";
import { AnimatePresence, motion } from "framer-motion";

function Assistant() {
  const { toggleCall, callStatus, audioLevel, messages, activeTranscript } =
    useVapi();

  const hasMessages = messages.length > 0 || activeTranscript;

  return (
    <div className="relative">
      <AnimatePresence>
        {hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 mb-2 w-80 max-h-96 overflow-hidden rounded-2xl bg-black border border-purple-500/20 shadow-lg shadow-purple-500/10"
          >
            <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
              <Display />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="user-input">
        <AssistantButton
          audioLevel={audioLevel}
          callStatus={callStatus}
          toggleCall={toggleCall}
        />
      </div>
    </div>
  );
}

export { Assistant };
