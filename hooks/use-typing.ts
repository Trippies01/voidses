import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/components/providers/socket-provider";

export const useTyping = (channelId: string, currentMemberId: string, currentMemberName: string) => {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const { socket } = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const isTypingRef = useRef(false);

  // Start typing
  const startTyping = useCallback(() => {
    if (!socket || !channelId) return;
    
    if (!isTypingRef.current) {
      socket.emit("typing:start", {
        channelId,
        memberId: currentMemberId,
        memberName: currentMemberName,
      });
      isTypingRef.current = true;
    }
  }, [socket, channelId, currentMemberId, currentMemberName]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!socket || !channelId) return;
    
    if (isTypingRef.current) {
      socket.emit("typing:stop", {
        channelId,
        memberId: currentMemberId,
      });
      isTypingRef.current = false;
    }
  }, [socket, channelId, currentMemberId]);

  // Handle typing with debounce
  const handleTyping = useCallback(() => {
    startTyping();

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  }, [startTyping, stopTyping]);

  // Listen for typing events from other users
  useEffect(() => {
    if (!socket) return;

    const typingHandler = ({ memberId, memberName, isTyping }: any) => {
      // Don't show our own typing
      if (memberId === currentMemberId) return;

      if (isTyping) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.add(memberName);
          return next;
        });

        // Auto-remove after 3 seconds
        const timeout = setTimeout(() => {
          setTypingUsers((prev) => {
            const next = new Set(prev);
            next.delete(memberName);
            return next;
          });
        }, 3000);

        // Clear old timeout for this user
        const oldTimeout = typingTimeouts.current.get(memberId);
        if (oldTimeout) {
          clearTimeout(oldTimeout);
        }
        typingTimeouts.current.set(memberId, timeout);
      } else {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(memberName);
          return next;
        });
        
        const timeout = typingTimeouts.current.get(memberId);
        if (timeout) {
          clearTimeout(timeout);
          typingTimeouts.current.delete(memberId);
        }
      }
    };

    socket.on(`chat:${channelId}:typing`, typingHandler);

    return () => {
      socket.off(`chat:${channelId}:typing`, typingHandler);
      
      // Clean up all timeouts
      typingTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      typingTimeouts.current.clear();
      
      // Stop typing when component unmounts
      stopTyping();
    };
  }, [socket, channelId, currentMemberId, stopTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  return {
    typingUsers: Array.from(typingUsers),
    handleTyping,
    stopTyping,
  };
};

