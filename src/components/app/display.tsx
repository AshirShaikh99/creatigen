import {
  Message,
  MessageTypeEnum,
  TranscriptMessage,
  TranscriptMessageTypeEnum,
} from "@/lib/types/conversation.type";
import { vapi } from "@/lib/vapi.sdk";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVapi } from "@/hooks/useVapi";
import {
  ColorPalette,
  generateRandomPalette,
  generateMonochromaticPalette,
  generateAnalogousPalette,
  generateComplementaryPalette,
} from "./ColorPalette";

// Helper function to convert HSL to hex (duplicated from ColorPalette for convenience)
const hslToHex = ({ h, s, l }: { h: number; s: number; l: number }): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
};

function Display() {
  const { messages, activeTranscript } = useVapi();

  // State for color palettes (no history)
  const [colorPalettes, setColorPalettes] = useState<
    Array<{
      colors: string[];
      name: string;
    }>
  >([]);

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

  // Keep track of the last message ID to avoid duplicate processing
  const lastProcessedMessageRef = useRef<string>("");

  useEffect(() => {
    const onMessageUpdate = (message: Message) => {
      // For transcript messages, we want to process each one to check for color requests
      // For other message types, we'll use a unique ID to avoid duplicates
      if (message.type !== MessageTypeEnum.TRANSCRIPT) {
        // Generate a unique ID for this message
        const messageId = `${message.type}-${Date.now()}`;

        // Skip if we've already processed this message
        if (messageId === lastProcessedMessageRef.current) {
          return;
        }

        // Update the last processed message ID
        lastProcessedMessageRef.current = messageId;
      }
      // Check for transcript messages that mention colors or palettes
      if (message.type === MessageTypeEnum.TRANSCRIPT) {
        const transcript = (message as TranscriptMessage).transcript;
        const lowerTranscript = transcript.toLowerCase();

        // Extract any hex colors from the message
        const hexColors = extractHexColors(transcript);

        // Extract any RGB colors from the message
        const rgbColors = extractRGBColors(transcript);

        // Check if the message contains explicit requests for color generation
        const actionKeywords = [
          "generate",
          "create",
          "make",
          "show",
          "give",
          "display",
          "suggest",
          "recommend",
          "need",
          "want",
          "new",
          "more",
          "another",
          "different",
          "update",
          "change",
        ];

        const colorKeywords = [
          "color",
          "palette",
          "scheme",
          "theme",
          "hue",
          "shade",
          "tint",
          "tone",
        ];

        const specificColorKeywords = [
          "blue",
          "red",
          "green",
          "purple",
          "yellow",
          "orange",
          "pink",
          "brown",
          "black",
          "white",
          "gray",
          "grey",
          "cyan",
          "magenta",
          "teal",
          "violet",
          "indigo",
          "turquoise",
          "maroon",
          "olive",
          "navy",
          "aqua",
          "lime",
          "coral",
          "chocolate",
          "electric",
          "neon",
          "pastel",
        ];

        // Check for explicit color generation requests
        const hasActionKeyword = actionKeywords.some((keyword) =>
          lowerTranscript.includes(keyword)
        );
        const hasColorKeyword = colorKeywords.some((keyword) =>
          lowerTranscript.includes(keyword)
        );
        const hasSpecificColor = specificColorKeywords.some((keyword) =>
          lowerTranscript.includes(keyword)
        );

        // Check for "new" or "more" specifically to force regeneration
        const forceNewPalettes = [
          "new",
          "more",
          "another",
          "different",
          "update",
          "change",
        ].some((keyword) => lowerTranscript.includes(keyword));

        // Only generate colors if there's an action keyword AND either a color keyword or specific color
        const shouldGenerateColors =
          (hasActionKeyword &&
            (hasColorKeyword || hasSpecificColor || forceNewPalettes)) ||
          // Or if there are explicit hex/RGB colors in the message
          hexColors.length > 0 ||
          rgbColors.length > 0;

        // If we should generate color palettes
        if (shouldGenerateColors) {
          // Generate different types of color palettes based on the request
          const newPalettes = [];

          // First priority: Use hex colors if found
          if (hexColors.length > 0) {
            newPalettes.push({
              name: "Extracted Hex Colors",
              colors: hexColors.slice(0, 5), // Limit to 5 colors
            });

            if (hexColors.length > 0) {
              // Also generate variations based on the first hex color
              const baseColor = hexColors[0];

              newPalettes.push({
                name: `Monochromatic Palette`,
                colors: generateMonochromaticPalette(baseColor),
              });

              newPalettes.push({
                name: `Analogous Palette`,
                colors: generateAnalogousPalette(baseColor),
              });
            }
          }
          // Second priority: Use RGB colors if found
          else if (rgbColors.length > 0) {
            newPalettes.push({
              name: "Extracted RGB Colors",
              colors: rgbColors.slice(0, 5), // Limit to 5 colors
            });

            if (rgbColors.length > 0) {
              // Also generate variations based on the first RGB color
              const baseColor = rgbColors[0];

              newPalettes.push({
                name: `Monochromatic Palette`,
                colors: generateMonochromaticPalette(baseColor),
              });

              newPalettes.push({
                name: `Analogous Palette`,
                colors: generateAnalogousPalette(baseColor),
              });
            }
          }
          // Third priority: Check for specific color mentions
          else {
            const colorMatches = lowerTranscript.match(
              /\b(red|blue|green|purple|yellow|orange|pink|teal|cyan|magenta|violet|indigo|brown|black|white|gray|grey)\b/g
            );

            if (colorMatches && colorMatches.length > 0) {
              // Generate palettes based on the mentioned colors
              const baseColor = getColorHex(colorMatches[0]);

              newPalettes.push({
                name: `${
                  colorMatches[0].charAt(0).toUpperCase() +
                  colorMatches[0].slice(1)
                } Monochromatic`,
                colors: generateMonochromaticPalette(baseColor),
              });

              newPalettes.push({
                name: `${
                  colorMatches[0].charAt(0).toUpperCase() +
                  colorMatches[0].slice(1)
                } Analogous`,
                colors: generateAnalogousPalette(baseColor),
              });

              newPalettes.push({
                name: `${
                  colorMatches[0].charAt(0).toUpperCase() +
                  colorMatches[0].slice(1)
                } Complementary`,
                colors: generateComplementaryPalette(baseColor),
              });
            } else {
              // Extract any color-related terms from the transcript
              const words = lowerTranscript.split(/\s+/);

              // Check for theme-based palettes
              if (lowerTranscript.includes("warm")) {
                newPalettes.push({
                  name: "Warm Color Palette",
                  colors: [
                    "#FF5500",
                    "#FF8C00",
                    "#FFA500",
                    "#FFD700",
                    "#FFFF00",
                  ],
                });
              } else if (lowerTranscript.includes("cool")) {
                newPalettes.push({
                  name: "Cool Color Palette",
                  colors: [
                    "#0000FF",
                    "#1E90FF",
                    "#00BFFF",
                    "#87CEEB",
                    "#ADD8E6",
                  ],
                });
              } else if (lowerTranscript.includes("pastel")) {
                newPalettes.push({
                  name: "Pastel Color Palette",
                  colors: [
                    "#FFB6C1",
                    "#FFD700",
                    "#98FB98",
                    "#ADD8E6",
                    "#DDA0DD",
                  ],
                });
              } else if (
                lowerTranscript.includes("dark") ||
                lowerTranscript.includes("deep")
              ) {
                newPalettes.push({
                  name: "Dark Color Palette",
                  colors: [
                    "#800000",
                    "#008000",
                    "#000080",
                    "#4B0082",
                    "#800080",
                  ],
                });
              } else if (
                lowerTranscript.includes("vibrant") ||
                lowerTranscript.includes("bright")
              ) {
                newPalettes.push({
                  name: "Vibrant Color Palette",
                  colors: [
                    "#FF0000",
                    "#00FF00",
                    "#0000FF",
                    "#FFFF00",
                    "#FF00FF",
                  ],
                });
              } else {
                // Generate a completely random palette for variety
                const seed = Date.now() % 360; // Use current time as a seed for variety
                newPalettes.push({
                  name: "Balanced Color Palette",
                  colors: [
                    hslToHex({ h: seed, s: 80, l: 40 }),
                    hslToHex({ h: (seed + 30) % 360, s: 75, l: 45 }),
                    hslToHex({ h: (seed + 60) % 360, s: 70, l: 50 }),
                    hslToHex({ h: (seed + 90) % 360, s: 65, l: 55 }),
                    hslToHex({ h: (seed + 120) % 360, s: 60, l: 60 }),
                  ],
                });
              }
            }
          }

          // Replace existing palettes with new ones (no history)
          setColorPalettes(newPalettes);
        }
      } else if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        message.functionCall.name === "changeUIColor"
      ) {
        // Handle the changeUIColor function call
        const color = message.functionCall.parameters.color;
        const baseColor = getColorHex(color);

        const newPalettes = [
          {
            name: `${color.charAt(0).toUpperCase() + color.slice(1)} Palette`,
            colors: generateMonochromaticPalette(baseColor),
          },
        ];

        setColorPalettes(newPalettes);
      }
    };

    const reset = () => {
      // Reset color palettes when conversation ends
      setColorPalettes([]);
    };

    vapi.on("message", onMessageUpdate);
    vapi.on("call-end", reset);
    return () => {
      vapi.off("message", onMessageUpdate);
      vapi.off("call-end", reset);
    };
  }, []);

  // Helper function to convert color names to hex
  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      red: "#FF0000",
      blue: "#0000FF",
      green: "#00FF00",
      purple: "#800080",
      yellow: "#FFFF00",
      orange: "#FFA500",
      pink: "#FFC0CB",
      teal: "#008080",
      cyan: "#00FFFF",
      magenta: "#FF00FF",
      violet: "#8A2BE2",
      indigo: "#4B0082",
      brown: "#A52A2A",
      black: "#000000",
      white: "#FFFFFF",
      gray: "#808080",
      grey: "#808080",
      // Add more colors as needed
      chocolate: "#D2691E",
      electric: "#7DF9FF",
      neon: "#39FF14",
      cyber: "#7E1E9C",
      deep: "#000033",
    };

    return colorMap[colorName.toLowerCase()] || "#6D28D9"; // Default to purple if color not found
  };

  // Extract hex colors from text
  const extractHexColors = (text: string): string[] => {
    // Match standard hex colors (#RGB or #RRGGBB)
    const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
    const matches = text.match(hexRegex) || [];

    // Also try to match hex colors without the # prefix
    const rawHexRegex = /\b([0-9A-Fa-f]{6})\b/g;
    const rawMatches = text.match(rawHexRegex) || [];

    // Combine and deduplicate
    const allMatches = [...matches, ...rawMatches.map((m) => `#${m}`)];
    return [...new Set(allMatches)];
  };

  // Helper function to blend two colors
  const blendColors = (
    color1: string,
    color2: string,
    ratio: number
  ): string => {
    // Convert hex to RGB
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    // Blend the colors
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // Extract RGB colors from text
  const extractRGBColors = (text: string): string[] => {
    // Match RGB format like rgb(255, 0, 0) or rgb(255 0 0)
    const rgbRegex = /rgb\(\s*(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)\s*\)/gi;
    const colors: string[] = [];

    let match;
    while ((match = rgbRegex.exec(text)) !== null) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);

      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        // Convert RGB to hex
        const hex = `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        colors.push(hex);
      }
    }

    // Also try to match RGB values without the rgb() wrapper
    // This is a bit more complex and might have false positives
    const rawRgbRegex = /\b(\d{1,3})\s+\d{1,3}\s+\d{1,3}\b/g;
    const rawMatches = text.match(rawRgbRegex) || [];

    for (const match of rawMatches) {
      const [r, g, b] = match.split(/\s+/).map((n) => parseInt(n, 10));
      if (r <= 255 && g <= 255 && b <= 255) {
        const hex = `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        colors.push(hex);
      }
    }

    return [...new Set(colors)];
  };

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

      {/* Color Palettes */}
      <div className="space-y-4 mt-4">
        {colorPalettes.length > 0 && (
          <AnimatePresence mode="sync" initial={false}>
            {colorPalettes.map((palette, index) => (
              <motion.div
                key={`palette-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <ColorPalette colors={palette.colors} name={palette.name} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export { Display };
