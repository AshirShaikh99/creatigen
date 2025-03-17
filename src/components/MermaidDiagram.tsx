"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

// Initialize mermaid with specific configuration
mermaid.initialize({
  startOnLoad: true,
  theme: "dark",
  securityLevel: "loose",
  themeVariables: {
    primaryColor: "#C1FF00",
    primaryTextColor: "#fff",
    primaryBorderColor: "#1A1A1A",
    lineColor: "#C1FF00",
    secondaryColor: "#111111",
    tertiaryColor: "#0A0A0A",
  },
  flowchart: {
    curve: "basis",
    padding: 20,
    htmlLabels: true,
    useMaxWidth: true,
  },
  er: {
    useMaxWidth: true,
  },
  sequence: {
    useMaxWidth: true,
  },
});

export function MermaidDiagram({ code, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Generate unique ID for the diagram
        const id = `mermaid-${Math.random().toString(36).substring(2)}`;

        // Log the incoming code for debugging
        console.log(`Attempting to render diagram with ID: ${id}`);
        console.log("Code to render:", code);

        containerRef.current.innerHTML = `<div id="${id}">${code}</div>`;

        // First ensure the code is valid
        try {
          await mermaid.parse(code);
          console.log("Mermaid syntax validation passed");
        } catch (parseError) {
          console.error("Mermaid syntax validation failed:", parseError);
          throw new Error(`Invalid Mermaid syntax: ${parseError}`);
        }

        // Render the diagram
        try {
          const { svg } = await mermaid.render(id, code);
          containerRef.current.innerHTML = svg;
          console.log("Mermaid diagram rendered successfully");
        } catch (renderError) {
          console.error("Mermaid rendering failed:", renderError);
          throw new Error(`Failed to render diagram: ${renderError}`);
        }

        // Style the SVG
        const svgElement = containerRef.current.querySelector("svg");
        if (svgElement) {
          svgElement.style.borderRadius = "0.5rem";
          svgElement.style.maxWidth = "100%";
          svgElement.style.height = "auto";
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
        } else {
          console.warn("No SVG element found after rendering");
        }
      } catch (err) {
        console.error("Failed to render Mermaid diagram:", err);
        setError(
          `Failed to render diagram: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
        <p className="text-sm">
          Unable to render diagram. Please check your diagram syntax and try
          again.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative min-h-[100px]", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111111] rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-[#C1FF00]" />
        </div>
      )}
      <div ref={containerRef} className="mermaid" />
    </div>
  );
}
