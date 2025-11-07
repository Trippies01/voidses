"use client";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { ModalData, useModal } from "@/hooks/use-modal-store";
import { useUnreadCount } from "@/hooks/use-unread-count";
import { UnreadBadge } from "@/components/unread-badge";
import { VoiceChannelMembers } from "@/components/voice-channel-members";
import { useState } from "react";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
  membersInChannel?: any[];
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
  membersInChannel = [],
}: ServerChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  const Icon = iconMap[channel.type];
  
  // Only track unread for TEXT channels
  const { unreadCount, markAsRead } = useUnreadCount(
    channel.type === ChannelType.TEXT ? channel.id : "",
    server.id
  );

  const isCurrentChannel = params?.channelId === channel.id;
  const isVoiceChannel = channel.type === ChannelType.AUDIO || channel.type === ChannelType.VIDEO;
  const hasMembers = membersInChannel.length > 0;
  
  console.log(`🎤 ServerChannel ${channel.name}:`, {
    isVoiceChannel,
    hasMembers,
    membersCount: membersInChannel.length,
    isExpanded,
  });

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
    if (channel.type === ChannelType.TEXT) {
      markAsRead();
    }
  };

  const onAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    onOpen(action as any, { channel, server });
  }

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen("deleteChannel", { server, channel });
  }

  const onEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen("editChannel", { server, channel });
  }

  return (
    <div className="mb-1">
      <button
        onClick={onClick}
        className={cn(
          "group px-2 py-2 rounded-lg flex items-center gap-x-2 w-full transition-all duration-200",
          "hover:bg-discord-bg-hover",
          isCurrentChannel && "bg-discord-bg-active text-discord-text-primary"
        )}
      >
        <Icon className={cn(
          "flex-shrink-0 w-5 h-5 transition-colors",
          isCurrentChannel ? "text-discord-text-primary" : "text-discord-text-muted group-hover:text-discord-text-secondary"
        )} />
        <p className={cn(
          "line-clamp-1 font-semibold text-sm transition-colors",
          isCurrentChannel ? "text-discord-text-primary" : "text-discord-text-muted group-hover:text-discord-text-secondary"
        )}>
          {channel.name}
        </p>
        {!isCurrentChannel && channel.type === ChannelType.TEXT && unreadCount > 0 && (
          <UnreadBadge count={unreadCount} className="ml-auto" />
        )}
        {isVoiceChannel && hasMembers && (
          <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
            {membersInChannel.length}
          </span>
        )}
        {channel.name !== "genel" && role !== MemberRole.GUEST && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Düzenle">
              <Edit
                onClick={onEdit}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
            <ActionTooltip label="Sil">
              <Trash
                onClick={onDelete}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === "genel" && (
          <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
      
      {/* Voice Channel Members List */}
      {isVoiceChannel && hasMembers && isExpanded && (
        <VoiceChannelMembers 
          members={membersInChannel}
        />
      )}
    </div>
  );
};

