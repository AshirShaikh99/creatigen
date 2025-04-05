import { CALL_STATUS, useVapi } from "@/hooks/useVapi";
import { Loader2, Mic, Square } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const AssistantButton = ({
  toggleCall,
  callStatus,
  audioLevel = 0,
}: Partial<ReturnType<typeof useVapi>>) => {
  // Calculate the pulse animation based on audio level
  const pulseScale = 1 + audioLevel * 0.5;

  // Determine button color based on call status
  const getButtonClasses = () => {
    switch (callStatus) {
      case CALL_STATUS.ACTIVE:
        return "bg-red-600 hover:bg-red-700 text-white";
      case CALL_STATUS.LOADING:
        return "bg-purple-400 hover:bg-purple-500 text-white";
      default:
        return "bg-purple-500 hover:bg-purple-600 text-white";
    }
  };

  return (
    <div className="relative">
      {/* Pulse animation for active call */}
      {callStatus === CALL_STATUS.ACTIVE && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/20"
          animate={{
            scale: [1, pulseScale, 1],
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Main button */}
      <Button
        className={`relative rounded-full w-14 h-14 shadow-lg ${getButtonClasses()} flex items-center justify-center transition-all duration-300 ease-in-out ${
          callStatus === CALL_STATUS.ACTIVE
            ? "shadow-red-500/30"
            : "shadow-purple-500/30"
        }`}
        onClick={toggleCall}
      >
        {callStatus === CALL_STATUS.ACTIVE ? (
          <Square className="h-5 w-5" />
        ) : callStatus === CALL_STATUS.LOADING ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export { AssistantButton };
