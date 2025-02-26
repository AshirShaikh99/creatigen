import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlassCard({
  children,
  className,
  glowColor = "purple",
}: GlassCardProps) {
  const glowMap = {
    purple: "before:bg-purple-500/20",
    blue: "before:bg-blue-500/20",
    pink: "before:bg-pink-500/20",
  };

  const glow = glowMap[glowColor as keyof typeof glowMap] || glowMap.purple;

  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl",
        "before:absolute before:-inset-0.5 before:-z-10 before:rounded-xl before:blur-xl",
        glow,
        className
      )}
    >
      {children}
    </div>
  );
}
