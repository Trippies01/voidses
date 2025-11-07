"use client";

import { useState } from "react";
import { Search, X, Loader2, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface MessageSearchProps {
  serverId: string;
  onClose: () => void;
}

export const MessageSearch = ({ serverId, onClose }: MessageSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: "/api/messages/search",
        query: {
          serverId,
          query: query.trim(),
        },
      });

      const response = await axios.get(url);
      setResults(response.data);
    } catch (error) {
      console.error("[MESSAGE_SEARCH]", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (channelId: string) => {
    router.push(`/servers/${serverId}/channels/${channelId}`);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#2b2d31]">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Mesajlarda ara..."
            className="pl-10 pr-4 bg-zinc-100 dark:bg-zinc-900 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Ara"
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1">
        {results.length === 0 && !isLoading && query && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400 p-8">
            <Search className="w-12 h-12 mb-4" />
            <p className="text-sm">Sonuç bulunamadı</p>
          </div>
        )}

        {results.length === 0 && !query && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400 p-8">
            <Search className="w-12 h-12 mb-4" />
            <p className="text-sm">Mesaj aramak için yukarıdaki alanı kullanın</p>
          </div>
        )}

        <div className="p-4 space-y-3">
          {results.map((message) => (
            <div
              key={message.id}
              onClick={() => handleResultClick(message.channelId)}
              className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition"
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
                  <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    <Hash className="w-3 h-3" />
                    <span>{message.channel.name}</span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {results.length > 0 && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {results.length} sonuç bulundu
        </div>
      )}
    </div>
  );
};

