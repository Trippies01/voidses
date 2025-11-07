import { useEffect, useState } from "react";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatTypingProps {
  chatId: string;
  userId: string;
  userName: string;
}

export const useChatTyping = ({
  chatId,
  userId,
  userName
}: ChatTypingProps) => {
  const { socket } = useSocket();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingKey = `chat:${chatId}:typing`;

  useEffect(() => {
    if (!socket) return;

    socket.on(typingKey, (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId === userId) return; // Don't show own typing

      setTypingUsers((prev) => {
        if (data.isTyping) {
          if (!prev.includes(data.userName)) {
            return [...prev, data.userName];
          }
          return prev;
        } else {
          return prev.filter((name) => name !== data.userName);
        }
      });

      // Auto clear after 3 seconds
      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((name) => name !== data.userName));
        }, 3000);
      }
    });

    return () => {
      socket.off(typingKey);
    };
  }, [socket, typingKey, userId]);

  const sendTyping = (isTyping: boolean) => {
    if (!socket) return;
    
    socket.emit(typingKey, {
      userId,
      userName,
      isTyping
    });
  };

  return {
    typingUsers,
    sendTyping
  };
};

