import { useState, useEffect } from "react";
import axios from "axios";
import qs from "query-string";
import { useSocket } from "@/components/providers/socket-provider";

export const useUnreadCount = (channelId: string, serverId: string) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  // Fetch initial unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const url = qs.stringifyUrl({
          url: `/api/channels/${channelId}/read`,
          query: { serverId },
        });

        const response = await axios.get(url);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("[UNREAD_COUNT_FETCH]", error);
      }
    };

    if (channelId && serverId) {
      fetchUnreadCount();
    }
  }, [channelId, serverId]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const messageHandler = () => {
      setUnreadCount((prev) => prev + 1);
    };

    const channelKey = `chat:${channelId}:messages`;
    socket.on(channelKey, messageHandler);

    return () => {
      socket.off(channelKey, messageHandler);
    };
  }, [socket, channelId]);

  // Mark as read function
  const markAsRead = async () => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channelId}/read`,
        query: { serverId },
      });

      await axios.post(url);
      setUnreadCount(0);
    } catch (error) {
      console.error("[MARK_AS_READ]", error);
    }
  };

  return {
    unreadCount,
    markAsRead,
    setUnreadCount,
  };
};

