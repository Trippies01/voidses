"use client";

import { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface PushToTalkIndicatorProps {
  isActive: boolean;
  keybind?: string;
  className?: string;
}

export const PushToTalkIndicator = ({
  isActive,
  keybind = "Space",
  className
}: PushToTalkIndicatorProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed bottom-32 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-3 px-6 py-3 rounded-full",
        "bg-zinc-900/95 backdrop-blur-xl border-2",
        "shadow-2xl transition-all duration-300",
        isActive 
          ? "border-green-500/50 scale-110" 
          : "border-white/10 scale-100 opacity-50",
        className
      )}
    >
      <div className={cn(
        "relative flex items-center justify-center h-10 w-10 rounded-full",
        isActive ? "bg-green-500/20" : "bg-zinc-800"
      )}>
        <Mic className={cn(
          "h-5 w-5 transition-colors",
          isActive ? "text-green-400" : "text-zinc-400"
        )} />
        {isActive && (
          <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
        )}
      </div>

      <div className="flex flex-col">
        <span className={cn(
          "text-sm font-medium transition-colors",
          isActive ? "text-green-400" : "text-zinc-400"
        )}>
          {isActive ? "Konuşuyorsunuz" : "Push to Talk"}
        </span>
        <span className="text-xs text-zinc-500">
          {keybind} tuşuna basılı tutun
        </span>
      </div>
    </div>
  );
};
