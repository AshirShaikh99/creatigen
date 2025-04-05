"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface ColorPaletteProps {
  colors: string[];
  name?: string;
  id?: string;
  onSelect?: (colors: string[], name: string, id?: string) => void;
  isSelected?: boolean;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  name,
  id,
  onSelect,
  isSelected = false,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyColor = (
    color: string,
    index: number,
    event: React.MouseEvent
  ) => {
    // Stop the event from propagating to the parent (to prevent palette selection)
    event.stopPropagation();

    navigator.clipboard.writeText(color);
    setCopiedIndex(index);

    // Reset the copied state after 2 seconds
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className={`bg-black/30 rounded-xl p-4 border ${
        isSelected
          ? "border-purple-500 shadow-purple-500/30"
          : "border-purple-500/20"
      } shadow-lg relative group/palette transition-all duration-300 ${
        onSelect ? "hover:border-purple-400/50 cursor-pointer" : ""
      }`}
      onClick={() => onSelect && onSelect(colors, name || "Color Palette", id)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-200">
          {name || "Color Palette"}
        </h3>
        {isSelected && (
          <span className="text-xs px-2 py-1 bg-purple-500 text-white rounded-full">
            Selected
          </span>
        )}
        {onSelect && !isSelected && (
          <span className="text-xs px-2 py-1 bg-purple-500/0 text-purple-500/0 rounded-full group-hover/palette:bg-purple-500/20 group-hover/palette:text-purple-300 transition-all duration-300">
            Select
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="relative group"
              onClick={(e) => handleCopyColor(color, index, e)}
            >
              <div
                className="w-16 h-16 rounded-md shadow-lg cursor-pointer ring-2 ring-transparent group-hover:ring-white/30 transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ backgroundColor: color }}
                title={`Click to copy: ${color}`}
              />

              {/* Checkmark overlay when copied */}
              {copiedIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md animate-fadeIn">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Hover overlay with copy icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </div>
            </div>

            <span className="text-xs text-gray-300 mt-2 font-mono">
              {color}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Generate a random color palette
export const generateRandomPalette = (count: number = 5): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(generateRandomColor());
  }
  return colors;
};

// Generate a random color with better distribution
const generateRandomColor = (): string => {
  // Generate random HSL values for better color distribution
  const h = Math.floor(Math.random() * 360); // Hue: 0-359
  const s = Math.floor(Math.random() * 40) + 60; // Saturation: 60-100%
  const l = Math.floor(Math.random() * 40) + 30; // Lightness: 30-70%

  // Convert HSL to hex
  return hslToHex({ h, s, l });
};

// Generate a monochromatic palette based on a base color
export const generateMonochromaticPalette = (
  baseColor: string,
  count: number = 5
): string[] => {
  const colors: string[] = [];
  const hsl = hexToHSL(baseColor);

  for (let i = 0; i < count; i++) {
    // Vary the lightness while keeping hue and saturation the same
    const lightness = Math.max(
      10,
      Math.min(90, hsl.l + (i - Math.floor(count / 2)) * 15)
    );
    colors.push(hslToHex({ h: hsl.h, s: hsl.s, l: lightness }));
  }

  return colors;
};

// Generate an analogous palette (colors next to each other on the color wheel)
export const generateAnalogousPalette = (
  baseColor: string,
  count: number = 5
): string[] => {
  const colors: string[] = [];
  const hsl = hexToHSL(baseColor);

  for (let i = 0; i < count; i++) {
    // Vary the hue while keeping saturation and lightness similar
    const hue = (hsl.h + (i - Math.floor(count / 2)) * 30 + 360) % 360;
    colors.push(hslToHex({ h: hue, s: hsl.s, l: hsl.l }));
  }

  return colors;
};

// Generate a complementary palette (colors opposite on the color wheel)
export const generateComplementaryPalette = (baseColor: string): string[] => {
  const hsl = hexToHSL(baseColor);
  const complementHue = (hsl.h + 180) % 360;

  return [
    baseColor,
    hslToHex({ h: hsl.h, s: hsl.s, l: hsl.l - 15 }),
    hslToHex({ h: hsl.h, s: hsl.s - 20, l: hsl.l }),
    hslToHex({ h: complementHue, s: hsl.s, l: hsl.l }),
    hslToHex({ h: complementHue, s: hsl.s, l: hsl.l - 15 }),
  ];
};

// Helper function to convert hex to HSL
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h = Math.round(h * 60);
  }

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
};

// Helper function to convert HSL to hex
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
