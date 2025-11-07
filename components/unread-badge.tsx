"use client";

import { cn } from "@/lib/utils";

interface UnreadBadgeProps {
  count: number;
  isMention?: boolean;
  className?: string;
}

export const UnreadBadge = ({ count, isMention = false, className }: UnreadBadgeProps) => {
  if (count === 0) return null;

  const displayCount = count > 99 ? "99+" : count;

  return (
    <div
      className={cn(
        "flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-bold",
        isMention
          ? "bg-red-500 text-white"
          : "bg-zinc-500 dark:bg-zinc-400 text-white",
        className
      )}
    >
      {displayCount}
    </div>
  );
};

