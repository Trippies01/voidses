"use client";

import { useState } from "react";
import { Plus, Smile } from "lucide-react";
import { cn, groupReactions } from "@/lib/utils";
import { EmojiPicker } from "@/components/emoji-picker";
import { ActionTooltip } from "@/components/action-tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MessageReactionBarProps {
  reactions: any[];
  currentMemberId: string;
  onReactionToggle: (emoji: string) => void;
  isLoading?: boolean;
}

export const MessageReactionBar = ({
  reactions,
  currentMemberId,
  onReactionToggle,
  isLoading = false,
}: MessageReactionBarProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const groupedReactions = groupReactions(reactions, currentMemberId);

  const handleEmojiSelect = (emoji: string) => {
    onReactionToggle(emoji);
    setShowEmojiPicker(false);
  };

  if (groupedReactions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {groupedReactions.map((reaction) => (
        <ActionTooltip
          key={reaction.emoji}
          label={`${reaction.count} ${reaction.count === 1 ? "kişi" : "kişi"} tepki verdi`}
        >
          <button
            onClick={() => onReactionToggle(reaction.emoji)}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all",
              "hover:scale-110 hover:shadow-sm",
              reaction.hasReacted
                ? "bg-blue-500/20 border border-blue-500/50 text-blue-600 dark:text-blue-400"
                : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
          >
            <span className="text-base">{reaction.emoji}</span>
            <span className="font-semibold">{reaction.count}</span>
          </button>
        </ActionTooltip>
      ))}

      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <button
            disabled={isLoading}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full",
              "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
              "hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:scale-110 transition-all",
              "text-zinc-500 dark:text-zinc-400"
            )}
          >
            <Smile className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          sideOffset={10}
          className="bg-transparent border-none shadow-none drop-shadow-none mb-16 p-0"
        >
          <EmojiPicker
            onChange={(emoji: string) => handleEmojiSelect(emoji)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

