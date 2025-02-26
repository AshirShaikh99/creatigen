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
  glowColor = "amber",
}: GlassCardProps) {
  const glowMap = {
    amber: "before:bg-amber-500/20",
    gold: "before:bg-yellow-600/20",
    brown: "before:bg-amber-800/20",
  };

  const glow = glowMap[glowColor as keyof typeof glowMap] || glowMap.amber;

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
