"use client";

import { useEffect, useState, useCallback } from "react";
import { Channel, ChannelType, MemberRole, Profile, Server, Member } from "@prisma/client";
import axios from "axios";
import qs from "query-string";
import { ServerChannel } from "./server-channel";
import { useSocket } from "@/components/providers/socket-provider";

interface VoiceChannelSectionProps {
  channels: Channel[];
  server: Server;
  role?: MemberRole;
  label: string;
  channelType: ChannelType;
  currentMemberId?: string;
}

export const VoiceChannelSection = ({
  channels,
  server,
  role,
  label,
  channelType,
  currentMemberId,
}: VoiceChannelSectionProps) => {
  const [channelMembers, setChannelMembers] = useState<Record<string, any[]>>({});
  const { socket } = useSocket();

  // Fetch members in voice channels
  const fetchVoiceMembers = useCallback(async () => {
    try {
      const url = `/api/servers/${server.id}/voice-members`;
      const response = await axios.get(url);
      setChannelMembers(response.data);
    } catch (error) {
      console.error("❌ [VOICE_MEMBERS_FETCH]", error);
    }
  }, [server.id]);

  useEffect(() => {
    fetchVoiceMembers();

    // Poll every 10 seconds for updates (reduced frequency)
    const interval = setInterval(fetchVoiceMembers, 10000);

    return () => clearInterval(interval);
  }, [server.id]); // Only depend on server.id, not fetchVoiceMembers

  // Listen for voice state changes via socket
  useEffect(() => {
    if (!socket) return;

    const voiceStateHandler = () => {
      fetchVoiceMembers();
    };

    socket.on(`server:${server.id}:voice-state`, voiceStateHandler);

    return () => {
      socket.off(`server:${server.id}:voice-state`, voiceStateHandler);
    };
  }, [socket, server.id, fetchVoiceMembers]);

  return (
    <div className="space-y-[2px]">
      {channels.map((channel) => {
        const membersInChannel = channelMembers[channel.id] || [];
        return (
          <ServerChannel
            key={channel.id}
            channel={channel}
            role={role}
            server={server}
            membersInChannel={membersInChannel}
            currentMemberId={currentMemberId}
          />
        );
      })}
    </div>
  );
};

