import { useState, useEffect } from "react";
import axios from "axios";
import qs from "query-string";
import { useSocket } from "@/components/providers/socket-provider";

interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
  members: any[];
}

export const useReactions = (
  messageId: string,
  serverId: string,
  currentMemberId: string
) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocket();

  // Toggle reaction (add or remove)
  const toggleReaction = async (emoji: string) => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/messages/${messageId}/reactions`,
        query: {
          serverId: serverId,
        },
      });

      const response = await axios.post(url, { emoji });
      
      // Update local state optimistically
      if (response.data.action === "added") {
        updateReactionState(emoji, "add", currentMemberId);
      } else {
        updateReactionState(emoji, "remove", currentMemberId);
      }

      // Emit socket event for real-time updates
      socket?.emit("message:reaction", {
        messageId,
        emoji,
        action: response.data.action,
        memberId: currentMemberId,
      });
    } catch (error) {
      console.error("[TOGGLE_REACTION]", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update reaction state locally
  const updateReactionState = (
    emoji: string,
    action: "add" | "remove",
    memberId: string
  ) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);

      if (action === "add") {
        if (existing) {
          return prev.map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: r.count + 1,
                  hasReacted: memberId === currentMemberId || r.hasReacted,
                }
              : r
          );
        } else {
          return [
            ...prev,
            {
              emoji,
              count: 1,
              hasReacted: memberId === currentMemberId,
              members: [],
            },
          ];
        }
      } else {
        // remove
        if (existing) {
          const newCount = existing.count - 1;
          if (newCount === 0) {
            return prev.filter((r) => r.emoji !== emoji);
          }
          return prev.map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: newCount,
                  hasReacted:
                    memberId === currentMemberId ? false : r.hasReacted,
                }
              : r
          );
        }
        return prev;
      }
    });
  };

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const reactionHandler = (data: any) => {
      if (data.messageId === messageId) {
        updateReactionState(
          data.emoji,
          data.action === "added" ? "add" : "remove",
          data.memberId
        );
      }
    };

    socket.on("message:reaction", reactionHandler);

    return () => {
      socket.off("message:reaction", reactionHandler);
    };
  }, [socket, messageId, currentMemberId]);

  return {
    reactions,
    toggleReaction,
    isLoading,
  };
};

