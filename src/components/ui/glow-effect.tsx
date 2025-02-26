"use client";

import { useEffect, useRef } from "react";

export function GlowEffect() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);

      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(120, 58, 180, 0.15) 0%, rgba(29, 7, 66, 0.05) 25%, transparent 50%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-10 opacity-70 transition duration-300"
    />
  );
}
