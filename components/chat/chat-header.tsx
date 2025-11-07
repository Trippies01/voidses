"use client";

import { useState } from "react";
import { Hash, Mic, Video, Search, Pin, Volume2 } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChannelType } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageSearch } from "@/components/chat/message-search";
import { PinnedMessages } from "@/components/chat/pinned-messages";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  channelType?: ChannelType;
  channelId?: string;
  voiceChannelName?: string;
  isInVoiceChannel?: boolean;
  onLeaveVoice?: () => void;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  channelType,
  channelId,
  voiceChannelName,
}: ChatHeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);

  const getChannelIcon = () => {
    if (channelType === ChannelType.TEXT) {
      return <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />;
    }
    if (channelType === ChannelType.AUDIO) {
      return <Mic className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />;
    }
    if (channelType === ChannelType.VIDEO) {
      return <Video className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />;
    }
    return <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />;
  };

  return (
    <>
      <div className="flex items-center h-14 px-4 border-b border-white/5 bg-discord-bg-primary shadow-sm">
        <MobileToggle serverId={serverId} />
        {type === "channel" && getChannelIcon()}
        {type === "conversation" && (
          <UserAvatar 
            src={imageUrl}
            className="h-8 w-8 md:h-8 md:w-8 mr-2"
          />
        )}
        <p className="font-bold text-base text-discord-text-primary">
          {name}
        </p>
        
        {/* Voice Channel Indicator - Discord style */}
        {voiceChannelName && (
          <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-discord-green/10 rounded-lg border border-discord-green/30">
            <Volume2 className="w-4 h-4 text-discord-green" />
            <span className="text-discord-green text-xs font-bold">{voiceChannelName}</span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-x-2">
          {type === "channel" && channelId && (
            <>
              <ActionTooltip label="Sabitlenmiş Mesajlar" side="bottom">
                <button
                  onClick={() => setPinnedOpen(true)}
                  className="group flex items-center"
                >
                  <Pin className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition" />
                </button>
              </ActionTooltip>
              <ActionTooltip label="Mesaj Ara" side="bottom">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="group flex items-center"
                >
                  <Search className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition" />
                </button>
              </ActionTooltip>
            </>
          )}
          <SocketIndicator />
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="p-0 max-w-2xl max-h-[80vh] overflow-hidden">
          <MessageSearch serverId={serverId} onClose={() => setSearchOpen(false)} />
        </DialogContent>
      </Dialog>

      {channelId && (
        <Dialog open={pinnedOpen} onOpenChange={setPinnedOpen}>
          <DialogContent className="p-0 max-w-2xl max-h-[80vh] overflow-hidden">
            <PinnedMessages channelId={channelId} onClose={() => setPinnedOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

