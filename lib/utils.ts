import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Group message reactions by emoji
export interface GroupedReaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
  memberIds: string[];
}

export function groupReactions(
  reactions: any[],
  currentMemberId: string
): GroupedReaction[] {
  const grouped = reactions.reduce((acc: any, reaction: any) => {
    const emoji = reaction.emoji;
    if (!acc[emoji]) {
      acc[emoji] = {
        emoji: emoji,
        count: 0,
        hasReacted: false,
        memberIds: [],
      };
    }
    acc[emoji].count++;
    acc[emoji].memberIds.push(reaction.memberId);
    if (reaction.memberId === currentMemberId) {
      acc[emoji].hasReacted = true;
    }
    return acc;
  }, {});

  return Object.values(grouped);
}

