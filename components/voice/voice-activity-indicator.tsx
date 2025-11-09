"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceActivityIndicatorProps {
  isSpeaking: boolean;
  volume?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const VoiceActivityIndicator = ({
  isSpeaking,
  volume = 50,
  size = "md",
  className
}: VoiceActivityIndicatorProps) => {
  const [bars, setBars] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!isSpeaking) {
      setBars([0, 0, 0, 0, 0]);
      return;
    }

    const interval = setInterval(() => {
      setBars([
        Math.random() * volume,
        Math.random() * volume * 0.8,
        Math.random() * volume * 1.2,
        Math.random() * volume * 0.9,
        Math.random() * volume,
      ]);
    }, 100);

    return () => clearInterval(interval);
  }, [isSpeaking, volume]);

  const sizeClasses = {
    sm: "h-3 w-0.5",
    md: "h-4 w-1",
    lg: "h-6 w-1.5",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={cn(
            "rounded-full transition-all duration-100",
            sizeClasses[size],
            isSpeaking ? "bg-green-500" : "bg-zinc-600"
          )}
          style={{
            height: isSpeaking ? `${Math.max(20, height)}%` : "20%",
          }}
        />
      ))}
    </div>
  );
};
