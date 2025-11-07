"use client";

import { useState, useEffect } from "react";
import { Pin, X, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import axios from "axios";
import qs from "query-string";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PinnedMessagesProps {
  channelId: string;
  onClose: () => void;
}

export const PinnedMessages = ({ channelId, onClose }: PinnedMessagesProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPinned = async () => {
      try {
        const url = qs.stringifyUrl({
          url: "/api/messages/pinned",
          query: { channelId },
        });

        const response = await axios.get(url);
        setMessages(response.data);
      } catch (error) {
        console.error("[PINNED_MESSAGES]", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPinned();
  }, [channelId]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#2b2d31]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Pin className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Sabitlenmiş Mesajlar
          </h3>
        </div>
        <button onClick={onClose} className="hover:opacity-75 transition">
          <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400 p-8">
            <Pin className="w-12 h-12 mb-4" />
            <p className="text-sm">Henüz sabitlenmiş mesaj yok</p>
          </div>
        )}

        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              <div className="flex items-start gap-3">
                <UserAvatar
                  src={message.member.profile.imageUrl}
                  className="w-10 h-10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {message.member.profile.name}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {format(new Date(message.createdAt), "dd MMM yyyy HH:mm", {
                        locale: tr,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {message.content}
                  </p>
                  {message.pinnedAt && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <Pin className="w-3 h-3" />
                      <span>
                        Sabitlendi:{" "}
                        {format(new Date(message.pinnedAt), "dd MMM yyyy", {
                          locale: tr,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {messages.length > 0 && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {messages.length} sabitlenmiş mesaj
        </div>
      )}
    </div>
  );
};

