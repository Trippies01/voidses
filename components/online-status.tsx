"use client";

import { cn } from "@/lib/utils";

interface OnlineStatusProps {
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const OnlineStatus = ({ isOnline = false, size = "sm", className }: OnlineStatusProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div
      className={cn(
        "rounded-full border-2 border-white dark:border-[#313338]",
        sizeClasses[size],
        isOnline ? "bg-green-500" : "bg-zinc-400 dark:bg-zinc-600",
        className
      )}
    />
  );
};

