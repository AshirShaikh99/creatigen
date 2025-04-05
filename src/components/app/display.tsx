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

  // State for current color palettes
  const [colorPalettes, setColorPalettes] = useState<
    Array<{
      colors: string[];
      name: string;
      id?: string;
    }>
  >([]);

  // State for palette history (all generated palettes)
  const [paletteHistory, setPaletteHistory] = useState<
    Array<{
      colors: string[];
      name: string;
      id: string;
      timestamp: number;
    }>
  >([]);

  // State for selected palettes
  const [selectedPalettes, setSelectedPalettes] = useState<
    Array<{
      colors: string[];
      name: string;
      id?: string;
    }>
  >([]);

  // State to toggle history visibility
  const [showHistory, setShowHistory] = useState(false);

  // Function to handle palette selection
  const handleSelectPalette = (colors: string[], name: string, id?: string) => {
    // Generate an ID if one wasn't provided
    const paletteId =
      id ||
      `palette-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Check if this palette is already selected
    const isAlreadySelected = selectedPalettes.some(
      (palette) =>
        palette.id === paletteId ||
        (palette.colors.join(",") === colors.join(",") && palette.name === name)
    );

    if (isAlreadySelected) {
      // If already selected, remove it
      setSelectedPalettes(
        selectedPalettes.filter(
          (palette) =>
            !(
              palette.id === paletteId ||
              (palette.colors.join(",") === colors.join(",") &&
                palette.name === name)
            )
        )
      );
    } else {
      // Otherwise add it to selected palettes
      setSelectedPalettes([
        ...selectedPalettes,
        { colors, name, id: paletteId },
      ]);
    }
  };

  // Create refs for the messages container and end element to enable auto-scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages to only show transcript messages
  const transcriptMessages = messages.filter(
    (message) => message.type === MessageTypeEnum.TRANSCRIPT
  ) as TranscriptMessage[];

  // Function to filter out color codes from transcript text
  const filterColorCodes = (text: string): string => {
    // Replace hex color codes
    let filtered = text.replace(/#([0-9A-Fa-f]{3}){1,2}\b/g, "[color]");

    // Replace RGB color values
    filtered = filtered.replace(
      /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi,
      "[color]"
    );

    // Replace sequences of numbers that might be color values
    filtered = filtered.replace(
      /(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3})/g,
      "[color values]"
    );

    return filtered;
  };

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
      // Generate a unique ID for this message
      const messageId = `${message.type}-${Date.now()}`;

      // Skip if we've already processed this message
      if (messageId === lastProcessedMessageRef.current) {
        return;
      }

      // Update the last processed message ID
      lastProcessedMessageRef.current = messageId;

      // Check for transcript messages that mention colors or palettes
      // We need to check both user messages (for requests) and assistant messages (for suggestions)
      if (message.type === MessageTypeEnum.TRANSCRIPT) {
        const transcriptMessage = message as TranscriptMessage;
        const isAssistantMessage = transcriptMessage.role === "assistant";

        // Process both user requests and assistant suggestions
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

        // Different logic for assistant vs user messages
        let shouldGenerateColors = false;

        if (isAssistantMessage) {
          // For assistant messages, we need VERY specific triggers
          // to avoid accidental palette generation

          // Strong indication phrases that clearly suggest the AI is showing colors
          const strongIndicationPhrases = [
            "here are some color",
            "here's a color palette",
            "i've created these color",
            "i have created some color",
            "generated these color",
            "here are the color palette",
            "showing you some color",
            "displaying color palette",
          ];

          // Check if any strong indication phrases are present
          const hasStrongIndication = strongIndicationPhrases.some((phrase) =>
            lowerTranscript.includes(phrase)
          );

          // Only generate colors if there's a strong indication AND specific color mentions
          // OR if there are explicit hex/RGB colors in the message
          shouldGenerateColors =
            (hasStrongIndication && (hasColorKeyword || hasSpecificColor)) ||
            hexColors.length > 0 ||
            rgbColors.length > 0;
        } else {
          // For user messages, require VERY explicit requests
          // Must have a clear action word AND color-related terms
          const explicitColorRequests = [
            "show me color",
            "generate color",
            "create color palette",
            "make color palette",
            "give me color",
            "show color palette",
            "need color palette",
            "want color palette",
          ];

          const hasExplicitRequest = explicitColorRequests.some((phrase) =>
            lowerTranscript.includes(phrase)
          );

          shouldGenerateColors =
            hasExplicitRequest ||
            (hasActionKeyword &&
              hasColorKeyword &&
              (hasSpecificColor || forceNewPalettes)) ||
            hexColors.length > 0 ||
            rgbColors.length > 0;
        }

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

          // Generate unique IDs for new palettes
          const timestamp = Date.now();
          const timestampedPalettes = newPalettes.map((palette, index) => ({
            ...palette,
            id: `palette-${timestamp}-${index}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
          }));

          // Deduplicate palettes by comparing color arrays
          const isDuplicate = (
            palette1: { colors: string[] },
            palette2: { colors: string[] }
          ) => {
            if (palette1.colors.length !== palette2.colors.length) return false;

            // Check if at least 3 colors match (indicating similar palettes)
            let matchCount = 0;
            for (const color1 of palette1.colors) {
              for (const color2 of palette2.colors) {
                // Compare colors with some tolerance for slight variations
                if (areColorsVerySimilar(color1, color2)) {
                  matchCount++;
                  break;
                }
              }
            }

            // If more than 60% of colors match, consider it a duplicate
            return (
              matchCount >=
              Math.min(3, Math.floor(palette1.colors.length * 0.6))
            );
          };

          // Filter out any new palettes that are too similar to existing ones
          const uniquePalettes = timestampedPalettes.filter(
            (newPalette) =>
              !colorPalettes.some((existingPalette) =>
                isDuplicate(newPalette, existingPalette)
              )
          );

          // Only update if we have unique palettes
          if (uniquePalettes.length > 0) {
            // Update current palettes with a smoother transition
            // Instead of clearing and then setting, we'll use a crossfade approach
            // by updating the state directly with the new palettes
            setColorPalettes(uniquePalettes);

            // Add to history with timestamp
            const historyPalettes = uniquePalettes.map((palette) => ({
              ...palette,
              timestamp: Date.now(),
              id:
                palette.id ||
                `palette-${Date.now()}-${Math.random()
                  .toString(36)
                  .substring(2, 9)}`,
            }));

            // Deduplicate history as well
            setPaletteHistory((prevHistory) => {
              // Filter out any palettes from history that are too similar to new ones
              const filteredHistory = prevHistory.filter(
                (historyPalette) =>
                  !historyPalettes.some((newPalette) =>
                    isDuplicate(historyPalette, newPalette)
                  )
              );

              // Limit history to 50 palettes to prevent excessive memory usage
              const combinedHistory = [...historyPalettes, ...filteredHistory];
              return combinedHistory.slice(0, 50);
            });
          }
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

  // Helper function to compare two colors for similarity
  const areColorsVerySimilar = (color1: string, color2: string): boolean => {
    // Handle invalid colors
    if (
      !color1 ||
      !color2 ||
      !color1.startsWith("#") ||
      !color2.startsWith("#")
    ) {
      return false;
    }

    try {
      // Convert hex to RGB
      const r1 = parseInt(color1.substring(1, 3), 16);
      const g1 = parseInt(color1.substring(3, 5), 16);
      const b1 = parseInt(color1.substring(5, 7), 16);

      const r2 = parseInt(color2.substring(1, 3), 16);
      const g2 = parseInt(color2.substring(3, 5), 16);
      const b2 = parseInt(color2.substring(5, 7), 16);

      // Calculate color distance using a simple Euclidean distance in RGB space
      const distance = Math.sqrt(
        Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
      );

      // Colors are considered very similar if their distance is less than 30 (out of 441.67 max distance)
      return distance < 30;
    } catch (e) {
      // If there's any error in parsing, assume they're not similar
      return false;
    }
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
              <p className="text-sm text-gray-200">
                {filterColorCodes(message.transcript)}
              </p>
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
                  {activeTranscript
                    ? filterColorCodes(activeTranscript.transcript)
                    : ""}
                </p>
              </motion.div>
            )}

          {/* Invisible element for auto-scrolling */}
          <div ref={messagesEndRef} className="h-0 w-full" />
        </AnimatePresence>
      </div>

      {/* Color Palettes Section */}
      <div className="space-y-6 mt-4">
        {/* Selected Palettes */}
        {selectedPalettes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-purple-400 px-1">
              Selected Palettes
            </h3>
            <div className="relative">
              <AnimatePresence mode="sync" initial={false}>
                {selectedPalettes.map((palette, index) => (
                  <motion.div
                    key={`selected-palette-${palette.id || index}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      opacity: { duration: 0.8, ease: "easeInOut" },
                      scale: { duration: 0.8, ease: "easeInOut" },
                      layout: { duration: 0.8, ease: "easeInOut" },
                    }}
                    layout
                    className="mb-3"
                  >
                    <ColorPalette
                      colors={palette.colors}
                      name={palette.name}
                      id={palette.id}
                      onSelect={handleSelectPalette}
                      isSelected={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Current Palettes */}
        {colorPalettes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 px-1">
              Suggested Palettes
            </h3>
            <div className="relative">
              <AnimatePresence mode="sync" initial={false}>
                {colorPalettes.map((palette, index) => (
                  <motion.div
                    key={`palette-${palette.id || index}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      opacity: { duration: 0.8, ease: "easeInOut" },
                      scale: { duration: 0.8, ease: "easeInOut" },
                      layout: { duration: 0.8, ease: "easeInOut" },
                    }}
                    layout
                    className="mb-3"
                  >
                    <ColorPalette
                      colors={palette.colors}
                      name={palette.name}
                      id={palette.id}
                      onSelect={handleSelectPalette}
                      isSelected={selectedPalettes.some(
                        (selected) =>
                          selected.id === palette.id ||
                          (selected.colors.join(",") ===
                            palette.colors.join(",") &&
                            selected.name === palette.name)
                      )}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* History Toggle Button */}
        <AnimatePresence>
          {paletteHistory.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-center w-full py-2 px-4 rounded-md bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-200 text-sm text-purple-300"
            >
              <span>
                {showHistory
                  ? "Hide Palette History"
                  : "Show All Generated Palettes"}
              </span>
              <motion.span
                animate={{ rotate: showHistory ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-2"
              >
                {showHistory ? "↑" : "↓"}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Palette History */}
        <AnimatePresence>
          {showHistory && paletteHistory.length > 0 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, height: 0, overflow: "hidden" }}
              animate={{ opacity: 1, height: "auto", overflow: "visible" }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <h3 className="text-sm font-medium text-gray-400 px-1">
                All Generated Palettes
              </h3>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                  {paletteHistory.map((palette) => (
                    <motion.div
                      key={palette.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <ColorPalette
                        colors={palette.colors}
                        name={palette.name}
                        id={palette.id}
                        onSelect={handleSelectPalette}
                        isSelected={selectedPalettes.some(
                          (selected) =>
                            selected.id === palette.id ||
                            (selected.colors.join(",") ===
                              palette.colors.join(",") &&
                              selected.name === palette.name)
                        )}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { Display };
